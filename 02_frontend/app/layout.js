import './styles/globals.css';

export const metadata = {
  title: 'Expense Tracker',
  description: 'Track your income and expenses easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 1. ปรับพื้นหลัง Body ให้เป็นสีขาวและเพิ่มลวดลาย/เงาเล็กน้อย */}
      <body className="min-h-screen font-sans bg-white">
        
        {/* 2. ปรับ Header ให้ใช้ Gradient และเงาที่เข้มขึ้น */}
        <header className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white py-6 shadow-xl">
          {/* 3. ปรับ Title ให้ใหญ่ขึ้นและมีระยะห่างตัวอักษร (tracking-wider) */}
          <h1 className="text-4xl font-extrabold text-center tracking-wider">
            💰 Expense Tracker
          </h1>
        </header>

        {/* 4. Main content ให้มี padding และ max-width ที่ดี */}
        <main className="p-6 max-w-6xl mx-auto">{children}</main>
        
        {/* เพิ่ม Footer เล็กน้อย (ทางเลือก) */}
        <footer className="text-center py-4 text-gray-500 text-sm border-t mt-10">
            © 2025 Expense Tracker. All rights reserved.
        </footer>
      </body>
    </html>
  );
}