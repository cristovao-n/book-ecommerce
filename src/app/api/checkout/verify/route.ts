import { NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";
import { Resend } from "resend";
import { emailConfirmacao, emailErro } from "@/src/utils/mesagesTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);
const emailsEnviados = new Set<string>();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id ausente" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  const customerEmail = session.customer_details?.email;
  const customerName  = session.customer_details?.name ?? "";
  const amountTotal   = session.amount_total ?? 0;
  const lineItems     = session.line_items?.data ?? [];
  const isPaid        = session.payment_status === "paid";

  if (customerEmail && !emailsEnviados.has(sessionId)) {
    emailsEnviados.add(sessionId);

    try {
      const template = isPaid
        ? emailConfirmacao({ customerName, customerEmail, amountTotal, lineItems })
        : emailErro({ customerEmail, sessionId });

      await resend.emails.send({
        from: "no-reply@ai-store-web1.xyz",
        to: template.to,
        subject: template.subject,
        html: template.html,
      });
    } catch (err) {
      emailsEnviados.delete(sessionId);
      console.error("[verify] Erro ao enviar e-mail:", err);
    }
  }

  return NextResponse.json({
    status: session.payment_status,
    customerEmail,
    customerName,
    amountTotal,
    lineItems,
  });
}