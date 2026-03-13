"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/app/auth/AuthContext";
import { ActivityLog } from "@/src/types/types";
import { listActivityLogs } from "@/src/lib/activityLogsRepo";
import Link from "next/link";
import { Card } from "antd";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR");
}

function renderMessage(log: ActivityLog) {
  const time = formatTime(log.createdAt);

  if (log.type === "PRODUCT_CREATED") {
    return (
      <>
        Admin cadastrou o produto{" "}
        <strong>{log.productName ?? "desconhecido"}</strong> às {time}
      </>
    );
  }

  if (log.type === "PRODUCT_DELETED") {
    return (
      <>
        Admin deletou o produto{" "}
        <strong>{log.productName ?? "desconhecido"}</strong> às {time}
      </>
    );
  }

  if (log.type === "ORDER_CREATED" && log.orderId != null) {
    return (
      <>
        Cliente{" "}
        <strong>{log.customerName ?? "desconhecido"}</strong> realizou uma nova
        compra{" "}
        <Link
          href={`/orders-management?orderId=${log.orderId}`}
          className="text-blue-600 hover:underline"
        >
          ver pedido #{log.orderId}
        </Link>{" "}
        às {time}
      </>
    );
  }

  return <>Atividade registrada às {time}</>;
}

export default function ActivityLogsPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (role !== "admin") {
      router.replace("/admin-login");
      return;
    }
    setLogs(listActivityLogs());
  }, [role, router]);

  const hasLogs = useMemo(() => logs.length > 0, [logs]);

  return (
    <main className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Registro de Atividades</h1>
      </div>

      {!hasLogs ? (
        <div className="bg-white shadow p-6 text-center text-gray-600">
          Nenhuma atividade registrada ainda.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map((log) => (
            <Card key={log.id} className="shadow-sm">
              <p className="text-sm text-gray-800">{renderMessage(log)}</p>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

