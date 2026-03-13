"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/src/hooks/useCart";
import { SessionData } from "@/src/types/types";
import Link from "next/link";

const fmt = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    cents / 100
  );

export function SuccessPageClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fulfilled, setFulfilled] = useState(false);
  const [visible, setVisible] = useState(false);

  const fulfilledRef = useRef(false);

  useEffect(() => {
    if (!sessionId || fulfilledRef.current) return;
    fulfilledRef.current = true;

    fetch(`/api/checkout/verify?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((json: SessionData) => setData(json))
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        setTimeout(() => setVisible(true), 80);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-9 h-9 rounded-full border-[3px] border-gray-200 border-t-gray-800 animate-spin" />
        <p className="text-sm text-gray-400">Confirmando pagamento…</p>
      </div>
    );
  }

  const isPaid = data?.status === "paid";
  const firstName = data?.customerName?.split(" ")[0];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed -top-44 -right-44 w-[500px] h-[500px] rounded-full bg-green-100 opacity-50 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-52 -left-52 w-[600px] h-[600px] rounded-full bg-blue-100 opacity-40 blur-3xl pointer-events-none" />

      <div
        className={`
          relative z-10 bg-white rounded-2xl shadow-sm border border-gray-100
          w-full max-w-md p-8 flex flex-col items-center gap-5
          transition-all duration-500 ease-out
          \${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        <div className="flex items-center justify-center">
          {isPaid ? (
            <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-400 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          )}
        </div>

        <div className="text-center flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {isPaid ? "Pedido confirmado!" : "Pagamento não concluído"}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            {isPaid
              ? `Obrigado${firstName ? `, \${firstName}` : ""}! Você receberá um e-mail de confirmação em breve.`
              : "Nenhuma cobrança foi realizada. Você pode tentar novamente."}
          </p>
        </div>

        {isPaid && data && (
          <div className="w-full bg-gray-50 rounded-xl p-5 flex flex-col gap-3">
            {data.customerEmail && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">E-mail</span>
                <span className="text-xs text-gray-600 font-medium truncate max-w-[220px]">
                  {data.customerEmail}
                </span>
              </div>
            )}

            {data.lineItems && data.lineItems.length > 0 && (
              <>
                <div className="border-t border-gray-200" />
                <div className="flex flex-col gap-2">
                  {data.lineItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        {item.description ?? "Item"}
                        {item.quantity && item.quantity > 1 && (
                          <span className="text-gray-300">×{item.quantity}</span>
                        )}
                      </span>
                      <span className="text-xs font-medium text-gray-700">
                        {fmt(item.amount_total)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="border-t border-gray-200" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-800">
                Total pago
              </span>
              <span className="text-base font-bold text-green-600">
                {fmt(data.amountTotal ?? 0)}
              </span>
            </div>
          </div>
        )}

        <div className="w-full flex flex-col gap-2 mt-1">
          {isPaid ? (
            <>
              <Link
                href="/orders"
                className="w-full text-center bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-3 rounded-xl transition-colors"
              >
                Ver meus pedidos
              </Link>
              <Link
                href="/products"
                className="w-full text-center text-gray-500 hover:text-gray-700 text-sm py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                Continuar comprando
              </Link>
            </>
          ) : (
            <Link
              href="/products"
              className="w-full text-center bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-3 rounded-xl transition-colors"
            >
              Voltar às compras
            </Link>
          )}
        </div>

        <p className="text-xs text-gray-300 mt-1">
          🔒 Processado com segurança pelo{" "}
          <span className="text-[#635bff]">Stripe</span>
        </p>
      </div>
    </div>
  );
}

