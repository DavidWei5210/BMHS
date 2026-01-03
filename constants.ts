
import { 
  Commodity, DailyReport, EntrustmentAgreement, IncomeHistory, Invoice, 
  LaborDemand, LogisticsRecord, NewsItem, Order, OrderStatus, ProcurementDemand, 
  ResidentGroup, ResidentLevel, ResidentProfile, RiskProject, 
  Settlement, ShopApplication, SubOrder, Transaction, Vehicle, DatabaseConfig 
} from './types';

// 如果部署到 ECS，请将 localhost 替换为 ECS 的公网 IP 或域名
export const API_BASE_URL = '/api'; 
export const IS_PRODUCTION = true;

// ... (保持其他 Mock 数据作为前端静态演示备选)
export const AGENT_NAV_ITEMS = [
  { id: 'dashboard', label: '数据看板 (Dashboard)', icon: 'LayoutDashboard' }, 
  { id: 'residents', label: '边民与合作社管理', icon: 'UserCircle' },
  { id: 'orders', label: '交易申报审核', icon: 'ListOrdered' },
  { id: 'finance', label: '资金结算中心', icon: 'Wallet' },
  { id: 'risk', label: '风控预警中心', icon: 'ShieldCheck' },
  { id: 'cloud-db', label: '阿里云数据库', icon: 'Database' },
  { id: 'bilateral-trade', label: '一级市场/互市', icon: 'Store' },
  { id: 'customs-services', label: '海关通关服务', icon: 'Truck' },
  { id: 'news', label: '政策资讯配置', icon: 'Newspaper' },
];

/**
 * Fix: Added missing ENTERPRISE_NAV_ITEMS
 */
export const ENTERPRISE_NAV_ITEMS = [
  { id: 'enterprise-dashboard', label: '企业中心', icon: 'LayoutDashboard' },
  { id: 'market', label: '采购大厅', icon: 'ShoppingCart' },
  { id: 'orders', label: '订单管理', icon: 'ListOrdered' },
];

/**
 * Fix: Added missing RESIDENT_NAV_ITEMS
 */
export const RESIDENT_NAV_ITEMS = [
  { id: 'resident-dashboard', label: '个人首页', icon: 'UserCircle' },
  { id: 'market', label: '互市大厅', icon: 'Store' },
];

/**
 * Fix: Added missing GUEST_NAV_ITEMS
 */
export const GUEST_NAV_ITEMS = [
  { id: 'dashboard', label: '公开看板', icon: 'LayoutDashboard' },
  { id: 'market', label: '市场行情', icon: 'Store' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-20231026-001',
    productName: '越南去皮干腰果 (W320)',
    enterpriseName: '鑫源坚果加工有限公司',
    quantity: 32,
    totalAmount: 2560000,
    date: '2023-10-26',
    status: OrderStatus.PROCESSING,
    splitCount: 0,
    depositPaid: true,
  }
];

/**
 * Fix: Added missing MOCK_SUB_ORDERS
 */
export const MOCK_SUB_ORDERS: SubOrder[] = [
  {
    id: 'SUB-001',
    parentOrderId: 'ORD-20231026-001',
    residentName: '岩帕',
    residentIdDisplay: '533102********001',
    amount: 8000,
    status: 'confirmed',
    groupName: '弄岛互助组',
    timestamp: '2023-10-26 10:45'
  }
];

export const MOCK_GROUPS: ResidentGroup[] = [
  { id: 'G-001', name: '弄岛互助组', leader: '岩帕', membersCount: 45, location: '靖西龙邦', performance: 98, availableQuota: 360000 },
];

export const MOCK_RESIDENTS: ResidentProfile[] = [
  { id: 'R-092', name: '岩帕', idCard: '5331021985********', level: ResidentLevel.GOLD, joinDate: '2021-03-15', activeScore: 98, referralCount: 12, isIndividualBusiness: true, status: 'active', groupId: 'G-001', monthEarnings: 2450, creditScore: 780, monthlyUsageCount: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=岩帕' },
];

export const MOCK_RESIDENT_PROFILE: ResidentProfile = MOCK_RESIDENTS[0];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-001', type: 'inflow', amount: 800000, description: '鑫源坚果 货款入账', timestamp: '2023-10-26 10:30', category: '货款' },
];

export const MOCK_INCOME_HISTORY: IncomeHistory[] = [
  { id: 'INC-001', description: '互市贸易收益 (腰果)', type: 'trade', date: '2023-10-25', amount: 20 },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-202310-001', title: '云南省边民互市专用发票', date: '2023-10-22', amount: 8000 },
];

export const MOCK_DAILY_REPORTS: DailyReport[] = [
  { date: '10-25', tradeCount: 1, tradeAmount: 8000, netIncome: 20 },
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  { id: 'STL-2023102501', orderId: 'ORD-20231025-005', date: '2023-10-25 14:30', amount: 20, status: 'success' },
];

export const MOCK_COMMODITIES: Commodity[] = [
  { id: 'C-001', name: '越南去皮干腰果', category: '坚果', price: 42.5, unit: 'kg', stock: 5000, origin: '越南平福', trend: 'up', changeRate: 2.5, image: 'https://images.unsplash.com/photo-1536591375315-1988d6960991?auto=format&fit=crop&q=80&w=400' },
];

export const MOCK_LABOR_DEMANDS: LaborDemand[] = [
  { id: 'L-001', enterpriseName: '鑫源坚果加工厂', type: 'loading', title: '腰果原料卸货', peopleCount: 8, wage: '200元/天', workDate: '2023-10-27', workTime: '08:00 - 18:00', location: '龙邦落地加工园A3仓', requirements: '身体健康，有搬运经验优先', isComplianceChecked: true, status: 'hiring', appliedCount: 3 },
];

export const MOCK_LOGISTICS: LogisticsRecord = {
  truckPlate: '桂L·88291',
  orderId: 'ORD-20231026-001',
  driver: '张三',
  currentLocation: '靖西龙邦口岸海关监管区',
  steps: [
    { title: '越南货场装车', description: '完成装载 50.02 吨', time: '10-26 08:30', status: 'completed' },
  ]
};

export const MOCK_NEWS: NewsItem[] = [
  { id: 'N-001', title: '关于2023年国庆期间边民互市贸易通关安排的通知', type: 'notice', date: '2023-09-28', priority: 'high', summary: '国庆期间...', read: false },
];

export const MOCK_RISK_PROJECTS: RiskProject[] = [
  { id: 'PRJ-001', projectName: '越南腰果进口加工项目', enterprise: '鑫源坚果', commodity: '腰果', totalTradeAmount: 15000000, participantCount: 320, complianceScore: 95, riskLevel: 'low', status: 'active' },
];

export const MOCK_PROCUREMENT_DEMANDS: ProcurementDemand[] = [
  { id: 'D-001', enterpriseId: 'E-001', enterpriseName: '鑫源坚果加工有限公司', productName: '越南去皮干腰果', quantity: 500, unit: '吨', targetPrice: 42000, deadline: '2023-11-15', status: 'active', description: '规格 W320', matchProgress: 65, residentCount: 120 },
];

export const MOCK_DEMANDS = MOCK_PROCUREMENT_DEMANDS;

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'V-001', plate: '桂L·88291', driverName: '张三', driverPhone: '138****8888', type: '9.6米高栏', status: 'busy', bindDate: '2023-01-15' },
];

export const MOCK_SHOP_APPLICATIONS: ShopApplication[] = [
  { id: 'S-001', shopName: '弄岛互助组坚果直销', location: '互市贸易区A栋101', type: 'physical', status: 'approved', submitDate: '2023-10-15' },
];

export const MOCK_ENTRUSTMENTS: EntrustmentAgreement[] = [
  { id: 'E-20231001', batchNo: 'B-202310-001', residentCount: 265, enterpriseName: '鑫源坚果加工有限公司', validPeriod: '2023-10-01 ~ 2024-09-30', status: 'active' },
];

/**
 * Fix: Added missing MOCK_DB_CONFIG
 */
export const MOCK_DB_CONFIG: DatabaseConfig = {
  instanceId: 'rm-bp1z2l....',
  instanceName: 'yzbm_trade_db',
  engine: 'MySQL',
  version: '8.0',
  status: 'Running',
  region: 'cn-hangzhou',
  cpuCores: 2,
  memoryGb: 4,
  storageGb: 20,
  usedStorageGb: 5.4,
  connections: 43
};

/**
 * Fix: Added missing MOCK_DB_PERFORMANCE
 */
export const MOCK_DB_PERFORMANCE = [
  { time: '10:00', cpu: 15, mem: 45, iops: 120 },
  { time: '10:10', cpu: 25, mem: 48, iops: 180 },
  { time: '10:20', cpu: 45, mem: 52, iops: 320 },
  { time: '10:30', cpu: 65, mem: 58, iops: 450 },
  { time: '10:40', cpu: 40, mem: 55, iops: 280 },
  { time: '10:50', cpu: 32, mem: 53, iops: 210 },
  { time: '11:00', cpu: 30, mem: 52, iops: 190 },
];
