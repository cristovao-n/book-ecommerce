"use client";

import { useFavorites } from "@/src/hooks/useFavorites";
import { Card } from "../../components/card";
import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { Product } from "@/src/types/types";
import { useCart } from "@/src/hooks/useCart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteProduct,
  ensureSeededProducts,
  listProducts,
} from "@/src/lib/productsRepo";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 20, 50];
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = products.slice(startIndex, endIndex);
  const { toggleFavorite, favorites } = useFavorites();
  const { addItemToCart, isIntoCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    ensureSeededProducts();
    setProducts(listProducts());
  }, []);

  const refresh = () => setProducts(listProducts());

  const onDelete = (id: number) => {
    deleteProduct(id);
    refresh();
  };

  return (
    <main className="p-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-semibold">Produtos</h1>
          <Link
            href="/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Novo produto
          </Link>
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
              onEdit={(id) => router.push(`/products/${id}/edit`)}
              onDelete={onDelete}
            />
          ))}
        </div>

        <Pagination
          total={products.length}
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
