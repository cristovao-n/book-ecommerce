"use client";

import { useFavorites } from "@/src/hooks/useFavorites";
import { Card } from "../../components/card";
import { Pagination } from "antd";
import { useState } from "react";

const cardPropsList = [
  {
    productName: "Livro de Ficção Científica",
    productPrice: 45.99,
    qnt_reviews: 250,
    avarage_rating: 4.8,
  },
  {
    productName: "Guia de Culinária Brasileira",
    productPrice: 35.5,
    qnt_reviews: 180,
    avarage_rating: 4.6,
  },
  {
    productName: "Romance de Mistério",
    productPrice: 32.0,
    qnt_reviews: 95,
    avarage_rating: 4.3,
  },
  {
    productName: "Manual de Programação em JavaScript",
    productPrice: 89.9,
    qnt_reviews: 520,
    avarage_rating: 4.9,
  },
  {
    productName: "Dicionário Técnico Inglês-Português",
    productPrice: 55.75,
    qnt_reviews: 142,
    avarage_rating: 4.4,
  },
  {
    productName: "Livro Infantil - Aventuras Mágicas",
    productPrice: 24.99,
    qnt_reviews: 310,
    avarage_rating: 4.7,
  },
  {
    productName: "Biografia de Grandes Personagens",
    productPrice: 67.5,
    qnt_reviews: 88,
    avarage_rating: 4.5,
  },
  {
    productName: "Poesia Contemporânea Brasileira",
    productPrice: 38.25,
    qnt_reviews: 156,
    avarage_rating: 4.2,
  },
  {
    productName: "Enciclopédia de História Universal",
    productPrice: 125.0,
    qnt_reviews: 75,
    avarage_rating: 4.6,
  },
  {
    productName: "Guia Prático de Desenvolvimento Pessoal",
    productPrice: 42.8,
    qnt_reviews: 420,
    avarage_rating: 4.8,
  },
];

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 20, 50];
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = cardPropsList.slice(startIndex, endIndex);
  const { toggleFavorite, favorites } = useFavorites();


  return (
    <main className="flex flex-col gap-8 justify-center items-center p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-2 w-full auto-rows-max">
        {currentData.map((props, index) => (
          <Card key={index} {...props} favorites={favorites} toggleFavorite={toggleFavorite}/>
        ))}
      </div>

      <Pagination
        total={cardPropsList.length}
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
    </main>
  );
}