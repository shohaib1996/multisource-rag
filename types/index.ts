export type IntentType = "ORDER" | "REVENUE" | "CURRENCY" | "EXCHANGE" | "DOCS";

export interface DataSource {
  key: IntentType;
  name: string;
  description: string;
}

export interface AvailableSources {
  ORDER: string;
  REVENUE: string;
  CURRENCY: string;
  EXCHANGE: string;
  DOCS: string;
}

export interface AgentResponse {
  question: string;
  answer: string;
  available_sources: AvailableSources;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: IntentType[];
}

export interface AskQuestionRequest {
  question: string;
}

// Data endpoint types
export interface Order {
  order_id: number;
  user_id: number;
  status: "pending" | "shipped" | "delivered" | "failed" | "cancelled";
  total_amount: number;
  currency: string;
  created_at: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
}

export interface Payment {
  id: number;
  order_id: number;
  provider: string;
  payment_method: string;
  payment_status: "paid" | "failed" | "refunded";
  amount: number;
  currency: string;
  paid_at: string;
  created_at: string;
}

export interface PaymentsResponse {
  payments: Payment[];
  total: number;
}

export interface KnowledgeFile {
  filename: string;
  title: string;
  content: string;
  size_bytes: number;
}

export interface KnowledgeFilesResponse {
  files: KnowledgeFile[];
  total: number;
}
