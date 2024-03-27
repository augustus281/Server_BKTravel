CREATE DATABASE tour_local;

DROP TABLE IF EXISTS `tour_local`.`user`;

-- Users table
CREATE TABLE `tour_local`.`user` (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(255),
    gender VARCHAR(10),
    dob DATE,
    avatar VARCHAR(255),
    phone VARCHAR(10),
    gmail VARCHAR(255),
    role_id INT DEFAULT 3,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
