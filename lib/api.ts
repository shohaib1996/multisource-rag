import {
  AgentResponse,
  OrdersResponse,
  PaymentsResponse,
  KnowledgeFilesResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function askQuestion(question: string): Promise<AgentResponse> {
  const response = await fetch(`${API_BASE_URL}/agent/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getSources(): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_BASE_URL}/agent/sources`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getOrders(): Promise<OrdersResponse> {
  const response = await fetch(`${API_BASE_URL}/data/orders`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getPayments(): Promise<PaymentsResponse> {
  const response = await fetch(`${API_BASE_URL}/data/payments`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getKnowledgeFiles(): Promise<KnowledgeFilesResponse> {
  const response = await fetch(`${API_BASE_URL}/data/knowledge-files`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
