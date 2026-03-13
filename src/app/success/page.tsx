import { Suspense } from "react";
import { SuccessPageClient } from "./success-page-client";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <div className="w-9 h-9 rounded-full border-[3px] border-gray-200 border-t-gray-800 animate-spin" />
          <p className="text-sm text-gray-400">Confirmando pagamento…</p>
        </div>
      }
    >
      <SuccessPageClient />
    </Suspense>
  );
}