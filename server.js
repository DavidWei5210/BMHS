
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 数据库连接池配置
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'yzbm_trade_db',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0
});

// --- 1. 用户注册接口 ---
app.post('/api/register', async (req, res) => {
  const { username, password, realName, role } = req.body;
  
  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: '必填项不能为空' });
  }

  try {
    // 检查用户名是否重复
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 写入数据库
    const [result] = await pool.query(
      'INSERT INTO users (username, password, real_name, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, realName, role]
    );

    res.status(201).json({ 
      success: true, 
      message: '注册成功', 
      userId: result.insertId 
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ success: false, message: '服务器异常，注册失败' });
  }
});

// --- 2. 用户登录接口 ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ success: false, message: '用户不存在' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: '密码错误' });
    }

    // 登录成功
    res.json({
      success: true,
      data: {
        role: user.role,
        realName: user.real_name,
        username: user.username
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '登录异常' });
  }
});

// --- 3. 原有业务接口 ---
app.get('/api/stats', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        todayGmv: 1245000 + Math.random() * 1000,
        activeResidents: 842,
        riskAlerts: 3,
        conversionCount: 1240
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '数据获取失败' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Server running on port ${PORT}`);
});
