import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Mỗi khi pathname thay đổi -> cuộn lên đầu trang
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);

    return null; // Component này không hiển thị gì
}
