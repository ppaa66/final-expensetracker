const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config({ path: '.env.local' });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'expense_tracker',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// GET transactions (เรียงวันที่ใหม่ → เก่า)
app.get('/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM transactions ORDER BY date DESC'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: เพิ่มข้อมูลใหม่ (ใส่ date จาก frontend)
app.post('/transactions', async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;

    if (!description || !amount || !type || !category || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['income','expense'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const [result] = await pool.query(
      `INSERT INTO transactions (description, amount, type, category, date)
       VALUES (?, ?, ?, ?, ?)`,
      [description, parseFloat(amount), type, category, date]
    );

    const [rows] = await pool.query(
      'SELECT * FROM transactions WHERE id = ?',
      [result.insertId]
    );

    res.json(rows[0]);

  } catch (e) {
    console.error('POST /transactions error:', e);
    res.status(500).json({ error: 'Internal Server Error', message: e.message });
  }
});

// DELETE: ลบรายการตาม id
app.delete('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM transactions WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ success: true });
  } catch (e) {
    console.error('DELETE /transactions/:id error:', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
