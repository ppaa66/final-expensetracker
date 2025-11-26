'use client';

import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, Trash2, DollarSign } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const API_URL = 'http://localhost:3001';

  const incomeCategories = ["เงินเดือน", "โบนัส", "ของขาย", "อื่น ๆ"];
  const expenseCategories = ["อาหาร", "เดินทาง", "ช้อปปิ้ง", "บิล", "สุขภาพ", "บันเทิง", "อื่น ๆ"];

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 👉 โหลดข้อมูล + เรียงใหม่ → เก่า
  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_URL}/transactions`);
      const data = await res.json();

      const sorted = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setTransactions(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  // 👉 เพิ่มรายการ + รีเฟรช + reset form
  const addTransaction = async () => {
    if (!description || !amount || !category || !date) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน!');
      return;
    }

    const newItem = {
      description,
      amount: parseFloat(amount),
      type,
      category,
      date
    };

    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        setDescription('');
        setAmount('');
        setCategory('');
        setType('expense');
        setDate('');

        fetchTransactions();
      } else {
        alert("เพิ่มรายการไม่สำเร็จ! ตรวจสอบ backend");
      }
    } catch (err) {
      console.error(err);
      alert("เชื่อมต่อ API ไม่สำเร็จ");
    }
  };

  // 👉 ลบรายการ
  const deleteTransaction = async (id) => {
    if (!confirm('ต้องการลบรายการนี้?')) return;

    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  // 👉 คำนวณสรุปยอด
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netTotal = incomeTotal - expenseTotal;

  return (
    <div className="page-container">
      <div className="content-wrapper">

        {/* Header */}
        <div className="header">
          <h1 className="main-title">Transaction Manager</h1>
          <p className="subtitle">จัดการรายรับรายจ่ายของคุณ</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="card card-income">
            <div className="card-header">
              <div className="icon-wrapper">
                <TrendingUp className="icon" />
              </div>
              <span className="card-label">รายรับ</span>
            </div>
            <p className="card-amount">{incomeTotal.toLocaleString()} ฿</p>
            <p className="card-subtitle">Income</p>
          </div>

          <div className="card card-expense">
            <div className="card-header">
              <div className="icon-wrapper">
                <TrendingDown className="icon" />
              </div>
              <span className="card-label">รายจ่าย</span>
            </div>
            <p className="card-amount">{expenseTotal.toLocaleString()} ฿</p>
            <p className="card-subtitle">Expense</p>
          </div>

          <div className="card card-balance">
            <div className="card-header">
              <div className="icon-wrapper">
                <Wallet className="icon" />
              </div>
              <span className="card-label">คงเหลือ</span>
            </div>
            <p className="card-amount">{netTotal.toLocaleString()} ฿</p>
            <p className="card-subtitle">Net Balance</p>
          </div>
        </div>

        {/* Add Transaction Form */}
        <div className="form-card">
          <div className="section-header">
            <div className="section-icon">
              <Plus className="icon-sm" />
            </div>
            <h2 className="section-title">เพิ่มรายการใหม่</h2>
          </div>

          <div className="form-grid">
            <input
              className="input-field"
              placeholder="รายละเอียด"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              className="input-field"
              placeholder="จำนวนเงิน"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              className="input-field"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setCategory('');
              }}
            >
              <option value="expense">รายจ่าย</option>
              <option value="income">รายรับ</option>
            </select>

            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">เลือกหมวดหมู่</option>
              {(type === "income" ? incomeCategories : expenseCategories).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              className="input-field"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button className="btn-add" onClick={addTransaction}>
              <Plus className="icon-sm" /> เพิ่ม
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="list-card">
          <div className="section-header">
            <div className="section-icon">
              <DollarSign className="icon-sm" />
            </div>
            <h2 className="section-title">รายการทั้งหมด</h2>
          </div>

          {transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Wallet className="icon-lg" />
              </div>
              <p className="empty-text">ยังไม่มีรายการ</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>วันที่</th>
                    <th>รายละเอียด</th>
                    <th>หมวดหมู่</th>
                    <th>ประเภท</th>
                    <th className="text-right">จำนวนเงิน</th>
                    <th className="text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{new Date(t.date).toLocaleDateString('th-TH')}</td>
                      <td>{t.description}</td>
                      <td><span className="badge-category">{t.category}</span></td>
                      <td>
                        {t.type === 'income' ? (
                          <span className="badge-income">
                            <TrendingUp className="icon-xs" /> รายรับ
                          </span>
                        ) : (
                          <span className="badge-expense">
                            <TrendingDown className="icon-xs" /> รายจ่าย
                          </span>
                        )}
                      </td>
                      <td className={`text-right font-bold ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {t.type === 'income' ? '+' : '-'}
                        {parseFloat(t.amount).toLocaleString()} ฿
                      </td>
                      <td className="text-center">
                        <button onClick={() => deleteTransaction(t.id)} className="btn-delete">
                          <Trash2 className="icon-xs" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
