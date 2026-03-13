import { ActivityLog } from "@/src/types/types";

const STORAGE_KEY = "activityLogs";

function safeParseActivityLogs(raw: string | null): ActivityLog[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ActivityLog[];
  } catch {
    return [];
  }
}

function readAll(): ActivityLog[] {
  if (typeof window === "undefined") return [];
  return safeParseActivityLogs(window.localStorage.getItem(STORAGE_KEY));
}

function writeAll(logs: ActivityLog[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function nextId(logs: ActivityLog[]): number {
  const maxId = logs.reduce((acc, l) => Math.max(acc, l.id), 0);
  return maxId + 1;
}

export function listActivityLogs(): ActivityLog[] {
  return readAll().sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function addActivityLog(
  input: Omit<ActivityLog, "id">,
): ActivityLog {
  const logs = readAll();
  const created: ActivityLog = {
    ...input,
    id: nextId(logs),
  };
  writeAll([created, ...logs]);
  return created;
}

export function logProductCreated(productName: string) {
  addActivityLog({
    type: "PRODUCT_CREATED",
    productName,
    createdAt: new Date().toISOString(),
  });
}

export function logProductDeleted(productName: string) {
  addActivityLog({
    type: "PRODUCT_DELETED",
    productName,
    createdAt: new Date().toISOString(),
  });
}

export function logOrderCreated(orderId: number, customerName: string) {
  addActivityLog({
    type: "ORDER_CREATED",
    orderId,
    customerName,
    createdAt: new Date().toISOString(),
  });
}

