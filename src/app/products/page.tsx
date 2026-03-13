"use client";

import { useFavorites } from "@/src/hooks/useFavorites";
import { Card } from "../../components/card";
import { Button, Input, Pagination, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Product } from "@/src/types/types";
import { useCart } from "@/src/hooks/useCart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteProduct,
  ensureSeededProducts,
  listProducts,
} from "@/src/lib/productsRepo";
import { useAuth } from "@/src/app/auth/AuthContext";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categoria, setCategoria] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const pageSizeOptions = [5, 10, 20, 50];
  const { toggleFavorite, favorites } = useFavorites();
  const { addItemToCart, isIntoCart } = useCart();
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    ensureSeededProducts();
    setProducts(listProducts());
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoria, tags, query]);

  const refresh = () => setProducts(listProducts());

  const onDelete = (id: number) => {
    deleteProduct(id);
    refresh();
  };

  const categoriaOptions = useMemo(() => {
    const cats = Array.from(
      new Set(products.map((p) => p.categoria).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
    return cats.map((c) => ({ label: c, value: c }));
  }, [products]);

  const tagOptions = useMemo(() => {
    const allTags = products.flatMap((p) => p.tags ?? []);
    const uniq = Array.from(new Set(allTags)).sort((a, b) => a.localeCompare(b));
    return uniq.map((t) => ({ label: t, value: t }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (categoria && p.categoria !== categoria) return false;
      if (tags.length && !tags.some((t) => (p.tags ?? []).includes(t))) {
        return false;
      }
      if (q) {
        const hay = `${p.nome ?? ""} ${p.descricao ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, categoria, tags, query]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredProducts.slice(startIndex, endIndex);

  return (
    <main className="p-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-semibold">Produtos</h1>
          {role === "admin" && (
            <Link
              href="/products/new"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Novo produto
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">
                Categoria
              </span>
              <Select
                allowClear
                placeholder="Todas"
                value={categoria}
                options={categoriaOptions}
                onChange={(v) => setCategoria(v)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Tags</span>
              <Select
                mode="multiple"
                allowClear
                placeholder="Selecione tags"
                value={tags}
                options={tagOptions}
                onChange={(v) => setTags(v)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Buscar</span>
              <Input
                placeholder="Título ou descrição"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                allowClear
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-sm text-gray-600">
              Mostrando <b>{filteredProducts.length}</b> de <b>{products.length}</b>
            </span>
            <Button
              onClick={() => {
                setCategoria(undefined);
                setTags([]);
                setQuery("");
              }}
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-2 w-full auto-rows-max">
          {currentData.map((props) => (
            <Card
              qnt_reviews={0}
              avarage_rating={0}
              key={props.id}
              {...props}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              addItemToCart={addItemToCart}
              isIntoCart={isIntoCart}
              disableCartActions={role === "admin"}
              onEdit={
                role === "admin"
                  ? (id) => router.push(`/products/${id}/edit`)
                  : undefined
              }
              onDelete={role === "admin" ? onDelete : undefined}
            />
          ))}
        </div>

        <Pagination
          total={filteredProducts.length}
          current={currentPage}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          showSizeChanger
          showTotal={(total) => `Total ${total} items`}
          responsive
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          size="large"
        />
      </div>
    </main>
  );
}
