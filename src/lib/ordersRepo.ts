import { Order, PaymentMethod, ShippingStatus } from "@/src/types/types";
import { logOrderCreated } from "@/src/lib/activityLogsRepo";

const STORAGE_KEY = "orders";

function safeParseOrders(raw: string | null): Order[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Order[];
  } catch {
    return [];
  }
}

function readAll(): Order[] {
  if (typeof window === "undefined") return [];
  return safeParseOrders(window.localStorage.getItem(STORAGE_KEY));
}

function writeAll(orders: Order[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function nextId(orders: Order[]): number {
  const maxId = orders.reduce((acc, o) => Math.max(acc, o.id), 0);
  return maxId + 1;
}

export function listOrders(): Order[] {
  return readAll();
}

export function createOrder(input: Omit<Order, "id">): Order {
  const orders = readAll();
  const created: Order = {
    ...input,
    id: nextId(orders),
  };
  writeAll([created, ...orders]);
  logOrderCreated(created.id, created.customerName);
  return created;
}
