import { NotificationInstance } from "antd/es/notification/interface";
import { NotificationType } from "../types/types";


export const openNotificationWithIcon = (api: NotificationInstance, type: NotificationType, title: string, description: string) => {
    api[type]({
      title: title,
      description: description,
      placement: 'bottomRight'
    });
  };

const formatCurrency = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    cents / 100
  );

export function emailConfirmacao({
  customerName,
  customerEmail,
  amountTotal,
  lineItems,
}: {
  customerName: string;
  customerEmail: string;
  amountTotal: number;
  lineItems: { description: string | null; amount_total: number; quantity: number | null }[];
}) {
  const linhas = lineItems
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0">${item.description ?? "Produto"}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity ?? 1}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right">${formatCurrency(item.amount_total)}</td>
        </tr>`
    )
    .join("");

  return {
    to: customerEmail,
    subject: "✅ Pedido confirmado — AI Store",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#111">
        <h2 style="color:#2563eb">Pedido confirmado!</h2>
        <p>Olá ! Seu pagamento foi aprovado com sucesso.</p>

        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <thead>
            <tr style="border-bottom:2px solid #e5e7eb">
              <th style="text-align:left;padding-bottom:8px">Produto</th>
              <th style="text-align:center;padding-bottom:8px">Qtd</th>
              <th style="text-align:right;padding-bottom:8px">Valor</th>
            </tr>
          </thead>
          <tbody>${linhas}</tbody>
        </table>

        <p style="font-size:18px;font-weight:bold;text-align:right">
          Total: ${formatCurrency(amountTotal)}
        </p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="font-size:12px;color:#6b7280">
          Este é um e-mail automático. Em caso de dúvidas, responda a este e-mail.
        </p>
      </div>
    `,
  };
}

export function emailErro({
  customerEmail,
  sessionId,
}: {
  customerEmail: string;
  sessionId: string;
}) {
  return {
    to: customerEmail,
    subject: "❌ Problema no seu pagamento — AI Store",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#111">
        <h2 style="color:#dc2626">Pagamento não confirmado</h2>
        <p>Identificamos um problema ao processar seu pagamento.</p>
        <p>Nenhum valor foi cobrado. Você pode tentar novamente pelo link abaixo:</p>

        <a href="${process.env.NEXT_PUBLIC_URL}/cart"
           style="display:inline-block;margin:16px 0;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          Tentar novamente
        </a>

        <p style="font-size:12px;color:#6b7280">Código da sessão: ${sessionId}</p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="font-size:12px;color:#6b7280">
          Se você não realizou esta compra, ignore este e-mail.
        </p>
      </div>
    `,
  };
}