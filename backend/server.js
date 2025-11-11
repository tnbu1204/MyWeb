import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";
import multer from "multer"; // để upload file
import fs from "fs";
import path from "path";

const app = express(); // khoi tao ung dung -> server
app.use(cors()); // cho phep request tu domain khac
app.use(express.json()); // chuyen du lieu JSON {"key":"value"} thanh Object js {key: "value"} = syntax bodyParse.kieudulieu hoac express.kieudulieu

dotenv.config();
const db = mysql.createConnection({ // tao ket noi toi database => OBJECT
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
const PORT = process.env.PORT || 5000;

// THUC HIEN KET NOI
db.connect((err) => { //connect callback loi khi ket noi ko thanh cong => err, con thanh cong thi` thoi
    if (err) {
        console.error("Lỗi kết nối MySQL:", err);
    } else {
        console.log("Kết nối MySQL thành công!");
    }
});

// REGISTER
app.post("/register", (req, res) => { // POST => /register; req => nhan du lieu, res => phan hoi
    const { username, password, confirmPassword, email, phoneNumber } = req.body; // detructuring => luu du lieu 

    if (!username || !password || !confirmPassword || !email || !phoneNumber) { // kiem tra thong tin co de trong hay ko?
        return res.status(400).json({ message: "Thiếu thông tin" }); // gui phan hoi ve cho fontend, !!! RETURN !!!
    }

    if (password !== confirmPassword) { // kiem tra xac nhan mat khau co giong nhau chua?
        return res.status(400).json({ message: "Mật khẩu nhập lại không khớp!" }) // gui phan hoi ve cho fontend, !!! RETURN !!!
    }

    let sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, username, (err, results) => {
        if (err) {
            console.error("Lỗi khi thêm người dùng:", err);
            // status 400 để .ok xác định đó là lỗi
            return res.status(400).json({ message: "Lỗi server!! Đăng ký chưa thành công" }); // gui phan hoi KHI CO LOI XAY RA, !!! RETURN !!!
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" }); // gui phan hoi KHI TEN DANG NHAP DA TON TAI, !!! RETURN !!!
        }

        sql = "INSERT INTO users (username, password, email, phoneNumber) VALUES (?, ?, ?, ?)"; // gan cau lenh vao sql
        db.query(sql, [username, password, email, phoneNumber], (err) => { // query thuc thi sql, tham so, callback
            if (err) {
                console.error("Lỗi khi thêm người dùng:", err);
                return res.status(400).json({ message: "Lỗi server!! Đăng ký chưa thành công" }); // gui phan hoi KHI CO LOI XAY RA, !!! RETURN !!!
            }
            res.json({ message: "Đăng ký thành công!" }); // gui phan hoi DANG KY THANH CONG
        });
    })
})

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Thiếu thông tin" });
    }

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error("Lỗi khi truy vấn:", err);
            return res.status(500).json({ message: "Lỗi máy chủ" });
        }

        if (results.length > 0) {
            const user = results[0]; // lưu dữ liệu login vào user 
            const role = user.username === "admin" ? "admin" : "user"; // xac minh role de vao trang admin
            return res.status(200).json({
                message: "",
                userId: user.id,
                username: user.username,
                userEmail: user.email,
                userPhoneNumber: user.phoneNumber,
                role: role
            });
        } else {
            return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
        }
    })
})

// Cấu hình nơi lưu ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Thư mục uploads nằm trong backend
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage }); // upload => luu hinh anh

// Cho phép React truy cập ảnh
app.use("/uploads", express.static("uploads"));

// API thêm sản phẩm
app.post("/admin/add-product", upload.single("image"), (req, res) => {
    const { name, price, description, gender, category, stock } = req.body; // luu cac thong tin file 
    const image = req.file?.filename;

    if (!name || !price || !gender || !category || !stock) {
        return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
    }

    if (stock < 0) {
        return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    if (!image) {
        return res.status(400).json({ message: "Thiếu hình sản phẩm" });
    }

    const sql = "INSERT INTO products (name, price, description, image, gender, category, stock) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, price, description, image, gender, category, stock], (err) => {
        if (err) {
            console.error("Lỗi khi thêm sản phẩm:", err);
            return res.status(500).json({ message: "Lỗi server" });
        }
        res.status(200).json({ message: "Thêm sản phẩm thành công!" });
    });
});

// Cập nhật sản phẩm
app.put("/admin/update-product/:id", upload.single("image"), (req, res) => {
    const { id } = req.params;
    const { name, price, description, gender, category, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    // Kiểm tra dữ liệu
    if (!name || !price || !gender || !category || !stock) {
        return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
    }

    if (stock < 0) {
        return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    // Lấy ảnh cũ trong DB
    db.query("SELECT image FROM products WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Lỗi khi truy vấn ảnh cũ:", err);
            return res.status(500).json({ message: "Lỗi server khi lấy sản phẩm" });
        }

        const oldImage = result[0]?.image;

        // nếu có ảnh mới => xóa ảnh cũ
        if (image && oldImage) {
            const oldPath = path.join("uploads", oldImage); // ghép các thành phần thành đường dẫn theo hệ điều hành
            // fs.access => kiểm tra file có tồn tại hay ko | fs.constants.F_OK => chỉ cần kiểm tra xem file có tồn tại, không cần kiểm tra quyền ghi/đọc
            fs.access(oldPath, fs.constants.F_OK, (err) => { // => dùng để ktra file tồn tại trước khi xóa => tránh crash server
                if (!err) {
                    fs.unlink(oldPath, (err) => { // xoa file theo duong dan
                        if (err) console.log("❌ Không thể xóa ảnh cũ:", err);
                        else console.log("🗑️ Đã xóa ảnh cũ:", oldImage);
                    })
                }
            })
        }
    })

    let sql, params;
    if (image) {
        sql = `
            UPDATE products 
            SET name = ?, price = ?, description = ?, gender = ?, category = ?, stock = ?, image = ?, update_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        params = [name, price, description, gender, category, stock, image, id];
    } else {
        sql = `
            UPDATE products 
            SET name = ?, price = ?, description = ?, gender = ?, category = ?, stock = ?, update_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        params = [name, price, description, gender, category, stock, id];
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Lỗi khi cập nhật sản phẩm:", err);
            return res.status(500).json({ message: "Lỗi server khi cập nhật sản phẩm" });
        }
        res.json({ message: "Cập nhật sản phẩm thành công!" });
    });
});


// Xóa sản phẩm
app.delete("/admin/delete-product/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT image FROM products WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log("Lỗi khi lấy image sản phẩm để xóa file");
            return res.status(500).json({ message: "Lỗi server" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        const oldImage = result[0]?.image;
        const oldPath = path.join("uploads", oldImage);

        fs.access(oldPath, fs.constants.F_OK, (err) => {
            if (!err) {
                fs.unlink(oldPath, (err) => {
                    if (err) console.log("Không thể xóa ảnh cũ:", err);
                    else console.log("🗑️ Đã xóa ảnh:", oldImage);
                })
            }
        })

        const sql = "DELETE FROM products WHERE id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error("Lỗi khi xóa sản phẩm:", err);
                return res.status(500).json({ message: "Lỗi server" });
            }
            res.json({ message: "Đã xóa sản phẩm thành công!" });
        });
    })
});

// API lấy danh sách products
app.get("/api/products", (req, res) => {
    const sql = "SELECT id, name, price, description, image, gender, category, stock FROM products";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy dữ liệu Products từ Database", err);
        }

        // Thêm URL đầy đủ cho mỗi ảnh
        const products = results.map(p => ({ // map tạo mảng mới, duyệt qua từng phần tử
            ...p,
            imageUrl: `http://localhost:5000/uploads/${p.image}`
        }))

        res.json(products);
    })
})

// API Thêm sản phẩm vào giỏ
app.post("/api/cart/add", (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ message: "Thiếu thông tin" });
    }

    const sql = `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `;
    db.query(sql, [user_id, product_id, quantity], (err) => {
        if (err) {
            console.error("Lỗi khi thêm vào giỏ:", err);
            return res.status(500).json({ message: "Lỗi server" });
        }
        res.status(200).json({ message: "Đã thêm sản phẩm vào giỏ hàng!" });
    })
})

// API Lấy giỏ hàng của người dùng
app.get("/api/cart/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    const sql = `
    SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy giỏ hàng:", err);
            return res.status(500).json({ message: "Lỗi server" });
        }

        const cart = results.map(item => ({
            ...item,
            imageUrl: `http://localhost:5000/uploads/${item.image}`
        }));

        res.json(cart);
    });
});

// PUT - Cập nhật số lượng sản phẩm trong giỏ hàng
app.put("/api/cart/:id", (req, res) => {
    const cartId = req.params.id; // id của dòng trong bảng cart
    const { quantity } = req.body; // số lượng mới

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    const sql = "UPDATE cart SET quantity = ? WHERE id = ?";
    db.query(sql, [quantity, cartId], (err, result) => {
        if (err) {
            console.error("Lỗi khi cập nhật số lượng:", err);
            return res.status(500).json({ message: "Lỗi server" });
        }

        res.json({ message: "Cập nhật số lượng thành công" });
    });
});

// DELETE - Xóa sản phẩm khỏi giỏ hàng
app.delete("/api/cart/:id", (req, res) => {
    const cartId = req.params.id;

    const sql = "DELETE FROM cart WHERE id = ?";
    db.query(sql, [cartId], (err, result) => {
        if (err) {
            console.error("Lỗi khi xóa sản phẩm:", err);
            return res.status(500).json({ message: "Lỗi server" });
        }

        res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
    });
});

// API: Đặt hàng
app.post("/api/orders", (req, res) => {
    const { user_id, name, phone, email, address, payment, cartItems } = req.body;

    if (!user_id || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
    }

    // Thêm đơn hàng vào bảng orders
    const orderSql = `
    INSERT INTO orders (user_id, name, phone, email, address, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

    db.query(
        orderSql,
        [user_id, name, phone, email, address, payment],
        (err, result) => {
            if (err) {
                console.error("Lỗi khi thêm đơn hàng:", err);
                return res.status(500).json({ message: "Lỗi khi tạo đơn hàng" });
            }

            const orderId = result.insertId;

            // Thêm chi tiết sản phẩm vào order_items
            const orderItemsSql = `
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES ?
        `;
            const values = cartItems.map((item) => [
                orderId,
                item.product_id,
                item.quantity,
                item.price,
            ]);

            db.query(orderItemsSql, [values], (err2) => {
                console.log("Dữ liệu gửi vào order_items:", values);
                if (err2) {
                    console.error("Lỗi khi thêm chi tiết sản phẩm:", err2);
                    return res.status(500).json({ message: "Lỗi khi lưu chi tiết đơn hàng" });
                }

                // Xóa giỏ hàng của user
                const deleteCartSql = "DELETE FROM cart WHERE user_id = ?";
                db.query(deleteCartSql, [user_id], (err3) => {
                    if (err3) {
                        console.error("Lỗi khi xóa giỏ hàng:", err3);
                        return res.status(500).json({ message: "Lỗi khi xóa giỏ hàng" });
                    }

                    res.json({ message: "Đặt hàng thành công!", orderId });
                });
            });
        }
    );
});

// API lấy trạng thái đơn hàng
app.get("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT
            o.id, o.name, o.email, o.phone, o.address, o.payment_method, o.status,
            SUM(oi.price * oi.quantity) AS total
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = ?
        GROUP BY order_id
    `;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy thông tin đơn hàng:", err);
            return res.status(500).json({ message: "Lỗi khi lấy thông tin đơn hàng" });
        }
        if (results.length === 0)
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        res.json(results[0]);
    });
});


// API hủy đơn hàng
app.put("/api/orders/:id/cancel", (req, res) => {
    const { id } = req.params;
    const sql = `
    UPDATE orders SET status = 'Đã hủy'
    WHERE id = ? AND status != 'Đã giao' AND status != 'Đang giao' AND status != 'Đang xử lý'
    `;
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi khi hủy đơn hàng" });
        if (result.affectedRows === 0)
            return res.status(400).json({ message: "Không thể hủy đơn hàng này" });
        res.json({ message: "Đơn hàng đã được hủy thành công" });
    });
});

// API: Lấy danh sách đơn hàng của user
app.get("/api/orders/user/:user_id", (req, res) => {
    const { user_id } = req.params;

    const sql = `
        SELECT
            o.id, o.name, o.phone, o.email, o.address, o.payment_method, o.status, o.create_at,
            SUM(oi.price * oi.quantity) AS total
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        WHERE user_id = ?
        GROUP BY order_id
        ORDER BY create_at DESC
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", err);
            return res.status(500).json({ message: "Lỗi khi lấy đơn hàng" });
        }

        res.json(results);
    });
});

// API: Lấy chi tiết sản phẩm trong đơn hàng
app.get("/api/orders/:order_id/items", (req, res) => {
    const { order_id } = req.params;

    const sql = `
        SELECT p.name, p.image, oi.quantity, oi.price 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `;

    db.query(sql, [order_id], (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
            return res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng" });
        }

        const items = results.map(item => ({
            ...item,
            imageUrl: `http://localhost:5000/uploads/${item.image}`
        }));

        res.json(items);
    });

});

// API: Lấy toàn bộ đơn hàng (admin)
app.get("/api/admin/orders", (req, res) => {
    const sql = `
    SELECT o.id, o.name, o.email, o.phone, o.payment_method, o.status, o.create_at, SUM(oi.quantity * oi.price) AS total
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    GROUP BY order_id
    ORDER BY create_at DESC
  `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", err);
            return res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng" });
        }
        res.json(results);
    });
});

// API Lấy chi tiết 1 đơn hàng (admin)
app.get("/api/admin/orders/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT 
            o.status,
            oi.quantity, oi.price, oi.id,
            p.name, p.image, p.gender, p.category, p.stock
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi server" });
        res.json(result);
    });
});

// API Cập nhật số lượng chi tiết sản phẩm của đơn hàng (admin)
app.put("/api/admin/order/item/:id", (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    const sql = `
        UPDATE order_items
        SET quantity = ?
        WHERE id = ?
    `

    db.query(sql, [quantity, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi server" });
        res.json({ message: "Cập nhật thành công" });
    });
})

// API Xóa sản phẩm khỏi chi tiết đơn hàng (admin)
app.delete("/api/admin/order/item/delete/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM order_items WHERE id = ?"

    db.query(sql, id, (err, result) => {
        if (err) return res.status(400).json({ message: "Lỗi server " });
        res.json({ message: "Xóa sản phẩm khỏi đơn hàng thành công" });
    });
})

//  API: Cập nhật trạng thái đơn hàng (admin)
app.put("/api/admin/orders/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error("Lỗi khi cập nhật trạng thái:", err);
            return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái" });
        }
        res.json({ message: "Cập nhật thành công" });
    });
});

// API: Lay thong tin tai khoan (admin)
app.get("/api/admin/users", (req, res) => {
    const sql = `
    SELECT 
        u.id, u.username, u.create_at, u.email, u.phoneNumber,
        COUNT(DISTINCT o.id) AS tongdonhang,
        COALESCE(SUM(oi.quantity * oi.price), 0) AS tongchitieu
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY u.id
    ORDER BY u.id ASC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy thông tin tài khoản", err);
            return res.status(500).json({ message: "Lỗi khi lấy thông tin tài khoản" });
        }
        res.json(results);
    })
})

// API: xoa tai khoan (admin)
app.delete("/api/admin/users/delete/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM users WHERE id = ?"
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Không thể xóa tài khoản");
            res.status(500).json({ message: "Không thể xóa tài khoản" });
        }
        res.json({ message: "Đã xóa tài khoản thành công" });
    })
})

app.listen(PORT, (err) => {
    if (err) {
        console.log("Có lỗi xảy ra khi khởi động", err);
    } console.log("Server đang chạy ở http://localhost:5000");
})
