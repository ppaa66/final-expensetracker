-- สร้างฐานข้อมูล
CREATE DATABASE IF NOT EXISTS expense_tracker
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE expense_tracker;

-- สร้างตาราง transactions
CREATE TABLE IF NOT EXISTS transactions (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type ENUM('income','expense') NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- เพิ่มข้อมูลเริ่มต้น
INSERT INTO transactions (description, amount, type, category, date, created_at) VALUES
('เงินเดือน', 30000.00, 'income', 'เงินเดือน', '2025-10-01', '2025-10-20 04:34:31'),
('ค่าเช่าบ้าน', 8000.00, 'expense', 'ที่อยู่อาศัย', '2025-10-05', '2025-10-20 04:34:31'),
('ค่าอาหาร', 150.00, 'expense', 'อาหาร', '2025-10-06', '2025-10-20 04:34:31'),
('ขายของออนไลน์', 2500.00, 'income', 'รายได้เสริม', '2025-10-08', '2025-10-20 04:34:31'),
('ค่าน้ำค่าไฟ', 1200.00, 'expense', 'ค่าสาธารณูปโภค', '2025-10-10', '2025-10-20 04:34:31'),
('ค่าเดินทาง', 500.00, 'expense', 'การเดินทาง', '2025-10-12', '2025-10-20 04:34:31'),
('โบนัส', 5000.00, 'income', 'โบนัส', '2025-10-15', '2025-10-20 04:34:31'),
('ค่าอินเทอร์เน็ต', 599.00, 'expense', 'ค่าสาธารณูปโภค', '2025-10-16', '2025-10-20 04:34:31'),
('ช้อปปิ้ง', 3500.00, 'expense', 'ช้อปปิ้ง', '2025-10-18', '2025-10-20 04:34:31'),
('ค่ารักษาพยาบาล', 800.00, 'expense', 'สุขภาพ', '2025-10-20', '2025-10-20 04:34:31');
