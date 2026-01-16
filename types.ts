export type ActiveTool = 'feed' | 'cocreation' | 'helper' | 'orders' | 'dashboard' | 'guardian';
export type UserRole = 'Customer' | 'Artisan';

export interface Product {
  id: number;
  name: string;
  artisan: {
    name: string;
    initial: string;
    location?: string;
  };
  price: string;
  rating: number;
  hype: number;
  image: string;
  tags?: string[];
  description: string;
}

export type OrderStatus = 'In Progress' | 'Pending Approval' | 'Completed' | 'Quality Check';
export type ProgressStep = 1 | 2 | 3 | 4 | 5;

export interface Order {
  id: string;
  title: string;
  artisan: string;
  orderId: string;
  status: OrderStatus;
  image: string;
  orderDate: string;
  estDeliveryDate: string;
  progressStep: ProgressStep;
}

export interface GuardianResult {
  status: 'PASS' | 'FAIL';
  ui_message: string;
  internal_reason: string;
}

export interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export interface ProductListing {
  product_name: string;
  long_description: string;
  price_recommendation: {
    currency: string;
    low_end: number;
    high_end: number;
    rationale: string;
  };
  suggested_tags: string[];
  promotion_idea: string;
}

export interface ChartData {
  chart_title: string;
  month_labels: string[];
  completed_orders: number[];
  pending_orders: number[];
}
