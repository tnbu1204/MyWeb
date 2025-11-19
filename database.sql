DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneNumber` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userName_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','123456','2025-11-01 10:15:50',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb3 NOT NULL,
  `price` int NOT NULL,
  `gender` enum('Nam','Nữ','Unisex') CHARACTER SET utf8mb3 DEFAULT 'Unisex',
  `category` enum('Áo','Quần','Váy') CHARACTER SET utf8mb3 DEFAULT 'Áo',
  `description` longtext CHARACTER SET utf8mb3,
  `stock` int DEFAULT '0',
  `image` varchar(255) CHARACTER SET utf8mb3 DEFAULT NULL,
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (48,'Áo thun trắng Ra Bịch',360000,'Nam','Áo','',150,'1763492641176-IMG_1018.jpg','2025-11-18 15:47:57','2025-11-18 19:04:01'),(49,'Áo thun Cara Club',250000,'Unisex','Áo','',110,'1763480925664-IMG_1007.jpg','2025-11-18 15:48:45','2025-11-18 18:55:50'),(50,'Áo polo Shizuka',200000,'Nữ','Áo','',120,'1763480980819-IMG_1889.jpg','2025-11-18 15:49:40','2025-11-18 18:55:54'),(51,'Áo thun sọc hồng',180000,'Nam','Áo','',130,'1763481018667-IMG_1944.jpg','2025-11-18 15:50:18','2025-11-18 18:55:58'),(52,'Áo thun sọc xanh',180000,'Nam','Áo','',140,'1763481038767-IMG_1971.jpg','2025-11-18 15:50:38','2025-11-18 18:56:01'),(53,'Chân váy Caro',150000,'Nữ','Váy','',160,'1763481097851-IMG_1046.jpg','2025-11-18 15:51:37','2025-11-18 18:56:09'),(54,'Áo BabyDoll',200000,'Nữ','Áo','',170,'1763481215617-IMG_0911.jpg','2025-11-18 15:53:35','2025-11-18 18:56:12'),(55,'Quần ống rộng kẻ sọc',280000,'Nữ','Quần','',180,'1763481320532-IMG_1851.jpg','2025-11-18 15:55:20','2025-11-18 18:56:16'),(56,'Áo thun con nai vàng ngơ ngác',240000,'Unisex','Áo','',190,'1763481474779-IMG_1983.jpg','2025-11-18 15:57:54','2025-11-18 18:56:19'),(57,'Quần đùi kẻ sọc',250000,'Nữ','Quần','',200,'1763481529599-IMG_1994.jpg','2025-11-18 15:58:49','2025-11-18 18:56:22'),(58,'Váy trắng Midi',260000,'Nữ','Váy','',210,'1763481575628-IMG_2069.jpg','2025-11-18 15:59:35','2025-11-18 18:56:25'),(59,'Váy yếm trắng',150000,'Nữ','Váy','',220,'1763481653165-IMG_4693a.jpg','2025-11-18 16:00:53','2025-11-18 18:56:29'),(60,'Áo BabyDoll đốm đốm',123000,'Nữ','Áo','',230,'1763481712757-IMG_5181.jpg','2025-11-18 16:01:52','2025-11-18 18:56:32'),(61,'Váy ngắn vẫn trắng',140000,'Nữ','Váy','',240,'1763481861625-IMG_5161.jpg','2025-11-18 16:04:21','2025-11-18 18:56:35'),(62,'Quần thun ống rộng',300000,'Unisex','Quần','',250,'1763482030977-IMG_0316.jpg','2025-11-18 16:07:10','2025-11-18 18:56:38');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--


DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_cart` (`user_id`,`product_id`),
  KEY `product_id_idx` (`product_id`),
  CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--


DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb3 DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb3 DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb3 DEFAULT NULL,
  `address` text CHARACTER SET utf8mb3,
  `payment_method` varchar(50) CHARACTER SET utf8mb3 DEFAULT NULL,
  `status` enum('Chờ xác nhận','Đang xử lý','Đang giao','Hoàn thành','Đã hủy') CHARACTER SET utf8mb3 DEFAULT 'Chờ xác nhận',
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `minus_stock` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `order_user_id` (`user_id`),
  CONSTRAINT `order_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--



DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id_idx` (`order_id`) /*!80000 INVISIBLE */,
  KEY `order_product_id_idx` (`product_id`),
  CONSTRAINT `order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

