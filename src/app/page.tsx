import { Metadata } from "next";
import HomeClient from "./homepage/homePage";

export const metadata: Metadata = {
  title: "AI Store",
  description:
    "Sua loja online - Encontre os melhores produtos com ótimos preços e ofertas exclusivas.",
  openGraph: {
    title: "AI Store",
    description:
      "Sua loja online - Encontre os melhores produtos com ótimos preços e ofertas exclusivas.",
    siteName: "AI Store",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function Home() {
  return <HomeClient />;
}
