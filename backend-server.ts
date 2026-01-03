
/**
 * 阿里云 ECS 后端部署示例 (Node.js + Express)
 * 运行环境准备:
 * 1. 安装 Node.js
 * 2. npm install express mysql2 cors dotenv
 */
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// 阿里云 RDS / ECS 自建数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'rm-bp1z2l....mysql.rds.aliyuncs.com',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'yzbm_trade_db',
  port: 3306
};

// 1. 获取首页看板统计数据
app.get('/api/stats', async (req, res) => {
  try {
    // 在真实场景中，这里会执行 SQL: SELECT SUM(amount) FROM orders WHERE date = TODAY
    // 模拟从数据库查询
    res.json({
      success: true,
      data: {
        todayGmv: 1245000 + Math.random() * 5000,
        activeResidents: 842,
        riskAlerts: 3,
        conversionCount: 1240
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '数据库连接失败' });
  }
});

// 2. 获取订单列表
app.get('/api/orders', async (req, res) => {
  try {
    // SQL: SELECT * FROM orders ORDER BY create_time DESC
    res.json({ success: true, data: [] /* 从数据库读取的订单数组 */ });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`云智边贸后端服务已启动: http://localhost:${PORT}`);
});
