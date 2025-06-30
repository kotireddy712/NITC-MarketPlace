-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: nitc_mp_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `total_items` int DEFAULT '0',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Books & Study Material',2),(2,'Electronics & Gadgets',6),(3,'Laptops & Accessories',0),(4,'Cycles & Transportation',0),(5,'Room Essentials',0),(6,'Sports Equipment',1),(7,'Clothing & Wearables',1),(8,'Hostel Utilities',0),(9,'Musical Instruments',0),(10,'Event Costumes & Props',1),(11,'Lab Equipment & Tools',0),(12,'Mess & Food Coupons',0),(13,'Project Components',0),(14,'Art & Stationery',1),(15,'Games & Entertainment',0),(16,'Miscellaneous',0);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_otp`
--

DROP TABLE IF EXISTS `email_otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_otp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_otp`
--

LOCK TABLES `email_otp` WRITE;
/*!40000 ALTER TABLE `email_otp` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_contact_number` varchar(20) DEFAULT NULL,
  `feedback_text` text NOT NULL,
  `submission_timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedback_id`),
  KEY `fk_user_id` (`user_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,NULL,'CH NAGENDHRA REDDY','chilakala_b230650cs@nitc.ac.in','83416 66479','WOW, IT WAS NICE WEB.DEV PROJECT AND IDEA BEAUTIFUL.','2025-06-27 12:54:09'),(2,NULL,'CH NAGENDHRA REDDY','chilakala_b230650cs@nitc.ac.in','83416 66479','NIce, but background to be chnaged.','2025-06-27 14:21:06'),(3,NULL,'CH NAGENDHRA REDDY','chilakala_b230650cs@nitc.ac.in','83416 66479','ok good nice idea.','2025-06-27 14:23:23'),(5,25,'CH NAGENDHRA REDDY','chilakala_b230650cs@nitc.ac.in','83416 66479','hello','2025-06-27 14:46:13');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `quantity` int DEFAULT '1',
  `image_url` text,
  `item_condition` enum('New','Good','Used') DEFAULT 'Used',
  `is_sold` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  `category_id` int NOT NULL,
  `is_approved` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`item_id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `items_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'bluetooth','Air pods AC3ne lite.one pod not working.',1000.00,1,'https://res.cloudinary.com/dnihh3gox/image/upload/v1751084570/qwz4kxmyw3fyrns04f6p.png','Used',0,'2025-06-28 04:22:52','2025-06-28 04:36:10',25,2,1),(4,'jon','o0i0jonl',10.00,1,'https://res.cloudinary.com/dnihh3gox/image/upload/v1751125263/yqtqq7sg5wqebmfmurin.jpg','Used',0,'2025-06-28 15:41:04','2025-06-28 16:57:28',25,1,1);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lost_found_items`
--

DROP TABLE IF EXISTS `lost_found_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lost_found_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `listing_type` enum('Lost','Found') NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `description` text,
  `location_details` varchar(255) DEFAULT NULL,
  `date_time_lost_found` datetime NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `status` enum('Active','Claimed','Returned','Archived') DEFAULT 'Active',
  `posted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` datetime DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `lost_found_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lost_found_items`
--

LOCK TABLES `lost_found_items` WRITE;
/*!40000 ALTER TABLE `lost_found_items` DISABLE KEYS */;
INSERT INTO `lost_found_items` VALUES (1,25,'Lost','Bluetooth','Realme Buds-Q company Ear pods, black color box.','Near CSE department','2025-06-08 03:50:00','https://res.cloudinary.com/dnihh3gox/image/upload/v1749378974/gjzrv725pfsewpycpggs.png','Active','2025-06-08 16:06:14',NULL),(2,25,'Found','Mobile Charger','White color adaptor with black wire','In CCC Terminal Room-1','2025-06-09 15:45:00','https://res.cloudinary.com/dnihh3gox/image/upload/v1749392839/dhwe6yxuvczgqxuq22bc.png','Active','2025-06-08 19:57:19',NULL);
/*!40000 ALTER TABLE `lost_found_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `photo_url` varchar(255) DEFAULT 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `is_disabled` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'aadil_b230011cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(2,NULL,'adidev_b230138cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(3,NULL,'adithyan_b230143cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(4,NULL,'ajad_b230772cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(5,NULL,'akkala_b230152cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(6,NULL,'alvin_b230160cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(7,NULL,'amal_b230162cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(8,NULL,'ameen_b230166cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(9,NULL,'amit_b230801cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(10,NULL,'anaykrishna_b230179cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(11,NULL,'anirudh_b230183cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(12,NULL,'anita_b230818cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(13,NULL,'ardhra_b230198cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(14,NULL,'arun_b230203cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(15,NULL,'aswin_b230213cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(16,NULL,'athira_b230219cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(17,NULL,'athul_b230222cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(18,NULL,'atla_b230223cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(19,NULL,'ayaan_b230638cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(20,NULL,'balukrishna_b230231cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(21,NULL,'banoth_b230235cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(22,NULL,'bayanaboina_b230871cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(23,NULL,'bhimanadham_b230645cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(24,NULL,'bollam_b230260cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(25,'CH NAGENDHRA REDDY','chilakala_b230650cs@nitc.ac.in','$2b$12$24Kp1IjP1g6Ulf4e1Qoxn.f0mKkP7p.2/FgnUUwt81PGrKN8p/eC6','83416 66479',NULL,'https://res.cloudinary.com/dnihh3gox/image/upload/v1748928606/jtw4ns2ovuibja6jdjlt.jpg','user',0),(26,NULL,'chinthala_b230267cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(27,NULL,'devadath_b230276cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(28,NULL,'doppalapudi_b230656cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(29,NULL,'dumpuru_b230093cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(31,NULL,'edwin_b230294cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(32,NULL,'fahad_b230103cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(33,NULL,'farheen_b230299cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(34,NULL,'gannamaneni_b230658cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(35,NULL,'ginne_b230660cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(36,NULL,'guguloth_b230319cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(37,NULL,'gunna_b230324cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(38,NULL,'hadi_b230326cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(39,NULL,'jadhav_b230664cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(40,NULL,'janhvi_b230352cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(41,NULL,'jayanta_b230984cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(42,NULL,'johan_b230049cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(43,NULL,'joseph_b230051cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(45,'K ABHIRAM','katta_b230669cs@nitc.ac.in','scrypt:32768:8:1$YGYOTBfPwH17XMph$e6913a0992be9821c710bfaa278a7c1b66d859a891201930225ab286db8643eb672a3aa621b66116db60a43f3804ae854976efd9e9984ac6dddef5107e65b040','8374400562',NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(46,NULL,'keerthana_b230376cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(47,NULL,'kiran_b230383cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(48,NULL,'kolasani_b230385cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(49,NULL,'kondegari_b231025cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(50,NULL,'mujahid_b231361cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(51,NULL,'akash_b220139cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(52,NULL,'kotha_b230389cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(53,NULL,'kumari_b230392cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(54,NULL,'kuruva_b230394cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(55,NULL,'lishin_b231045cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(56,NULL,'malepati_b230673cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(57,NULL,'mandadi_b230407cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(58,NULL,'manthrala_b230674cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(59,NULL,'medaboina_b230414cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(60,NULL,'mihir_b231079cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(61,NULL,'mohammed_b230058cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(62,NULL,'mohit_b230427cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(63,NULL,'muhammad_b231099cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(64,NULL,'muhammed_b230430cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(65,NULL,'muhammed_b230680cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(66,NULL,'nadeem_b230440cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(67,NULL,'nandini_b230445cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(68,NULL,'navaneeth_b230684cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(69,NULL,'neeraj_b230453cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(70,NULL,'neha_b230073cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(71,NULL,'nidhi_b230075cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(72,NULL,'niranjan_b230466cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(73,NULL,'nitha_b230472cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(74,NULL,'om_b230476cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(75,NULL,'palla_b230481cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(76,NULL,'pankaj_b230484cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(77,NULL,'pinank_b230491cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(78,NULL,'prachi_b230495cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(79,NULL,'renish_b231198cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(80,NULL,'riya_b230086cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(81,NULL,'rudrakshala_b230530cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(82,NULL,'sahil_b230535cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(83,NULL,'sanin_b230542cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(84,NULL,'shaik_b230703cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(85,NULL,'shinit_b230559cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(86,NULL,'simran_b230707cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(87,NULL,'sreelakshmi_b230576cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(88,NULL,'suragala_b230581cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(89,NULL,'tarun_b230098cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(90,NULL,'thomas_b230593cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(91,NULL,'utpal_b230598cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(92,NULL,'vaishnavi_b230602cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(93,NULL,'vakiti_b231314cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(94,NULL,'veeramreddy_b230608cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(95,NULL,'vighnesh_b230611cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(96,NULL,'visruth_b231337cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(98,NULL,'zam_b231364cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(99,NULL,'pandit_b220452cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(100,NULL,'shaik_b221196cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(101,NULL,'siddharth_b220535cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(102,NULL,'aakansh_b230117cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(103,NULL,'adimulam_b230755cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(104,NULL,'aditya_b230015cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(105,NULL,'ajay_b230017cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(106,NULL,'alamuru_b230154cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(107,NULL,'alyn_b230161cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(108,NULL,'ameen_b230165cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(109,NULL,'ameer_b230167cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(110,NULL,'amna_b230169cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(111,NULL,'animesh_b230182cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(112,NULL,'anirudh_b230629cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(113,NULL,'anvi_b230027cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(114,NULL,'arjun_b230202cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(115,NULL,'asheeqa_b230207cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(116,NULL,'aswin_b230215cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(117,NULL,'athul_b230030cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(118,NULL,'athul_b230031cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(119,NULL,'atluri_b230857cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(120,NULL,'ayushman_b230230cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(121,NULL,'banoth_b230234cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(122,NULL,'banothu_b230239cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(123,NULL,'bhagavathi_b230247cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(124,NULL,'bokka_b230646cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(125,NULL,'challa_b230648cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(126,NULL,'chirag_b230652cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(127,NULL,'devanand_b230278cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(128,NULL,'duggimi_b230923cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(129,NULL,'dunna_b230924cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(130,NULL,'durgesh_b230293cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(131,NULL,'etta_b230929cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(132,NULL,'faizal_b230298cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(133,NULL,'fathima_b230301cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(134,NULL,'gautham_b230309cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(135,NULL,'gulapala_b230957cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(136,NULL,'guthireddy_b230959cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(137,NULL,'ish_b230346cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(138,NULL,'janardhan_b230979cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(139,NULL,'janvi_b230354cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(140,NULL,'jesvin_b230359cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(141,NULL,'john_b230050cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(142,NULL,'joshua_b230362cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(143,NULL,'karanam_b231007cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(144,NULL,'kathuri_b230668cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(145,NULL,'kavalla_b230374cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(146,NULL,'kethavath_b230379cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(147,NULL,'kola_b230384cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(148,NULL,'konki_b230386cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(149,NULL,'lukmanul_b231360cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(150,NULL,'bhukya_b220227cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(151,NULL,'girijith_b220292cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(152,NULL,'saeed_b210028cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(153,NULL,'kukkala_b231035cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(154,NULL,'kunduru_b231038cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(155,NULL,'lakshit_b230395cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(156,NULL,'m_b230400cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(157,NULL,'mallempati_b231062cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(158,NULL,'manisha_b230053cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(159,NULL,'mathew_b230411cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(160,NULL,'medaboyina_b230415cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(161,NULL,'mohamed_b230420cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(162,NULL,'mohammed_b230426cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(163,NULL,'muhammad_b230060cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(164,NULL,'muhammed_b230679cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(165,NULL,'muhammed_b230434cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(166,NULL,'munukuntla_b231114cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(167,NULL,'naga_b230069cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(168,NULL,'nathani_b231122cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(169,NULL,'naveena_b230449cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(170,NULL,'neeraj_b231127cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(171,NULL,'nidhal_b230458cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(172,NULL,'niraj_b230463cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(173,NULL,'nishanth_b230471cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(174,NULL,'nithin_b230473cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(175,NULL,'p_b230477cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(176,NULL,'pankaj_b230483cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(177,NULL,'pedakota_b230487cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(178,NULL,'poosa_b230691cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(179,NULL,'prathyush_b230501cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(180,NULL,'raghuveer_b230515cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(181,NULL,'rahul_b231185cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(182,NULL,'richie_b230519cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(183,NULL,'rohith_b230527cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(184,NULL,'sahil_b230089cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(185,NULL,'shaheen_b230552cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(186,NULL,'shaik_b230555cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(187,NULL,'shazil_b231241cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(188,NULL,'shresth_b230090cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(189,NULL,'simhadri_b230567cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(190,NULL,'sivaprabha_b230569cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(191,NULL,'sreehari_b230574cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(192,NULL,'sreeneha_b230092cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(193,NULL,'syed_b230587cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(194,NULL,'thalluri_b231291cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(195,NULL,'uruputuri_b231306cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(196,NULL,'vaishnavi_b230603cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(197,NULL,'vedavyas_b230607cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(198,NULL,'veeravalli_b230609cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(199,NULL,'vinay_b230612cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(200,NULL,'vivekanand_b230617cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(201,NULL,'yuvraj_b230625cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(202,NULL,'shubham_b210580cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(203,NULL,'vishal_b220589cs@nitc.ac.in',NULL,NULL,NULL,'https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0),(204,'DEVARA','errasamudram123@gmail.com','$2b$12$LFRtTO6nLgqrnSArDI7IEuGtdYyX0nU6BAhG91lXDaBbUansEYcJ2','8374400562','2025-06-12 20:59:41','https://cdn-icons-png.flaticon.com/512/3135/3135715.png','user',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-30 20:47:02
