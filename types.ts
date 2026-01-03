
export enum OrderStatus {
  MATCHING = '匹配中',
  ASSIGNED = '已派单',
  COMPLETED = '已履约',
  CANCELLED = '已取消',
  PENDING_DEPOSIT = '待缴保证金',
  PROCESSING = '处理中',
  CLEARED = '已清关',
  SETTLED = '已结算'
}

export type UserRole = 'agent' | 'resident' | 'enterprise' | null;

export interface DatabaseConfig {
  instanceId: string;
  instanceName: string;
  engine: string;
  version: string;
  status: 'Running' | 'Scaling' | 'Restarting';
  region: string;
  cpuCores: number;
  memoryGb: number;
  storageGb: number;
  usedStorageGb: number;
  connections: number;
}

export interface Enterprise {
  id: string;
  name: string;
  industry: string;
  verified: boolean;
}

export interface ProcurementDemand {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  productName: string;
  quantity: number;
  unit: string;
  targetPrice: number;
  deadline: string;
  status: 'active' | 'matched' | 'closed';
  description: string;
  matchProgress: number;
  residentCount: number;
}

export interface LaborDemand {
  id: string;
  enterpriseName: string;
  type: 'loading' | 'transport' | 'tallying' | 'sorting' | 'other';
  title: string;
  peopleCount: number;
  wage: string;
  workDate: string;
  workTime: string;
  location: string;
  requirements: string;
  isComplianceChecked: boolean;
  status: 'hiring' | 'full' | 'completed';
  appliedCount: number;
}

export enum ResidentLevel {
  ORDINARY = '注册边民',
  BRONZE = '铜牌互助组成员', 
  SILVER = '银牌诚信边民', 
  GOLD = '金牌合伙人',   
  BUSINESS = '个体工商户',
  PARTNER = '高级合伙人'
}

export interface ResidentProfile {
  id: string;
  name: string;
  idCard: string;
  level: ResidentLevel;
  joinDate: string;
  activeScore: number;
  referralCount: number;
  isIndividualBusiness: boolean;
  businessLicenseNo?: string;
  status: 'active' | 'pending_verify' | 'suspended';
  groupId: string;
  avatar?: string;
  isVerified?: boolean;
  monthEarnings?: number;
  monthlyUsageCount?: number;
  creditScore?: number;
  businessName?: string;
}

export interface ResidentGroup {
  id: string;
  name: string;
  leader: string;
  membersCount: number;
  location: string;
  performance: number;
  availableQuota: number;
}

export interface NewsItem {
  id: string;
  title: string;
  type: 'policy' | 'notice' | 'training' | 'news';
  date: string;
  priority: 'high' | 'normal';
  summary: string;
  read?: boolean;
}

export interface TrainingCourse {
  id: string;
  title: string;
  category: 'compliance' | 'skill' | 'tax';
  completedCount: number;
  duration: string;
}

export interface ProfitConfig {
  totalServiceFee: number;
  residentRateType: 'fixed' | 'ratio';
  residentValue: number;
  groupRatio: number;
  agentRatio: number;
}

export interface Order {
  id: string;
  productName: string;
  enterpriseName: string;
  quantity: number;
  totalAmount: number;
  date: string;
  status: OrderStatus;
  splitCount: number;
  depositPaid: boolean;
  profitConfig?: ProfitConfig;
}

export interface SubOrder {
  id: string;
  parentOrderId: string;
  residentName: string;
  residentIdDisplay: string;
  amount: number;
  status: 'pending' | 'confirmed';
  groupName: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  type: 'inflow' | 'outflow';
  amount: number;
  description: string;
  timestamp: string;
  category: string;
}

export interface Commodity {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  origin: string;
  trend: 'up' | 'down' | 'stable';
  changeRate: number;
  image: string;
}

export interface LogisticsRecord {
  truckPlate: string;
  orderId: string;
  driver: string;
  currentLocation: string;
  steps: {
    title: string;
    description: string;
    time: string;
    status: 'completed' | 'current' | 'pending';
  }[];
}

export interface RiskProject {
  id: string;
  projectName: string;
  enterprise: string;
  commodity: string;
  totalTradeAmount: number;
  participantCount: number;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive';
}

export interface IncomeHistory {
  id: string;
  description: string;
  type: 'trade' | 'dividend' | 'subsidy' | 'referral' | 'labor';
  date: string;
  amount: number;
}

export interface Invoice {
  id: string;
  title: string;
  date: string;
  amount: number;
}

export interface DailyReport {
  date: string;
  tradeCount: number;
  tradeAmount: number;
  netIncome: number;
}

export interface Settlement {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  status: 'success' | 'processing';
}

export interface Vehicle {
  id: string;
  plate: string;
  driverName: string;
  driverPhone: string;
  type: string;
  status: 'active' | 'maintenance' | 'busy';
  bindDate: string;
}

export interface ShopApplication {
  id: string;
  shopName: string;
  location: string;
  type: 'physical' | 'virtual';
  status: 'pending' | 'approved' | 'rejected';
  submitDate: string;
}

export interface EntrustmentAgreement {
  id: string;
  batchNo: string;
  residentCount: number;
  enterpriseName: string;
  validPeriod: string;
  status: 'active' | 'expired';
}
