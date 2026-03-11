"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  deleteProduct,
  ensureSeededProducts,
  getProduct,
} from "@/src/lib/productsRepo";
import { Product } from "@/src/types/types";
import { Button, Popconfirm, Tag } from "antd";
import { formatCurrency } from "@/src/utils/utils";
import { BackLink } from "@/src/components/backLink";

export default function ProductDetailsPage() {
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
          <h1 className="text-xl font-semibold">Produto</h1>
          <BackLink href="/products" />
        </div>
        <div className="bg-white shadow-md rounded p-4">
          <p>Produto não encontrado.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">{product.nome}</h1>
          <span className="text-gray-600">{formatCurrency(product.preco)}</span>
        </div>

        <div className="flex items-center gap-2">
          <BackLink href="/products" />
          <Button onClick={() => router.push(`/products/${product.id}/edit`)}>
            Editar
          </Button>
          <Popconfirm
            title="Excluir produto?"
            description="Essa ação não pode ser desfeita."
            okText="Excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              deleteProduct(product.id);
              router.push("/products");
            }}
          >
            <Button danger>Excluir</Button>
          </Popconfirm>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded overflow-hidden">
          <img
            src={product.imagem}
            alt={product.nome}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-white shadow-md rounded p-4 flex flex-col gap-3">
          <div>
            <h2 className="font-semibold">Descrição</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {product.descricao}
            </p>
          </div>

          <div>
            <h2 className="font-semibold">Categoria</h2>
            <p className="text-gray-700">{product.categoria}</p>
          </div>

          <div>
            <h2 className="font-semibold">Tags</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.tags.length ? (
                product.tags.map((t) => <Tag key={t}>{t}</Tag>)
              ) : (
                <span className="text-gray-500">Sem tags</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

