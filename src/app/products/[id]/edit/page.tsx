"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/src/components/productForm";
import {
  ensureSeededProducts,
  getProduct,
  updateProduct,
} from "@/src/lib/productsRepo";
import { Product } from "@/src/types/types";
import { BackLink } from "@/src/components/backLink";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = useMemo(() => Number(params.id), [params.id]);

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    ensureSeededProducts();
    setProduct(getProduct(id));
  }, [id]);

  if (!product) {
    return (
      <main className="max-w-3xl mx-auto p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Editar produto</h1>
          <BackLink href="/products" />
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <p>Produto não encontrado.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Editar produto</h1>
        <BackLink href={`/products/${id}`} />
      </div>

      <div className="bg-white shadow-md rounded p-4">
        <ProductForm
          submitText="Salvar"
          initialValues={{
            nome: product.nome,
            descricao: product.descricao,
            imagem: product.imagem,
            preco: product.preco,
            categoria: product.categoria,
            tags: product.tags,
          }}
          onSubmit={(values) => {
            updateProduct(id, values);
            router.push(`/products/${id}`);
          }}
        />
      </div>
    </main>
  );
}

