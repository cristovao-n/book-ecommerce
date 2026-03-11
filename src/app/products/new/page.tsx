"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/src/components/productForm";
import { createProduct, ensureSeededProducts } from "@/src/lib/productsRepo";
import { BackLink } from "@/src/components/backLink";

export default function NewProductPage() {
  const router = useRouter();

  return (
    <main className="max-w-3xl mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Novo produto</h1>
        <BackLink href="/products" />
      </div>

      <div className="bg-white shadow-md rounded p-4">
        <ProductForm
          submitText="Criar"
          onSubmit={(values) => {
            ensureSeededProducts();
            const created = createProduct(values);
            router.push(`/products/${created.id}`);
          }}
        />
      </div>
    </main>
  );
}

