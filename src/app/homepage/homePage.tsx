"use client";

import Link from "next/link";
import { Card } from "../../components/card";
import { useFavorites } from "../../hooks/useFavorites";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../hooks/useCart";

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export default function HomeClient() {
  const [products, setProducts] = useState<Product[]>([]);

  const { toggleFavorite, favorites } = useFavorites();
  const { addItemToCart, isIntoCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      const response = await axios.get("https://fakestoreapi.com/products");

      setProducts(response.data.slice(0, 4));
    };

    loadProducts();
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen">
      <section
        className="shadow-md bg-cover bg-right bg-no-repeat relative"
        style={{ backgroundImage: "url('/images/hero-products.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Encontre os melhores produtos
            </h1>

            <p className="text-gray-600 mb-8 text-lg">
              Explore nossa loja e descubra ofertas incríveis em diversas
              categorias.
            </p>

            <Link
              href="/products"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition"
            >
              Explorar Produtos
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-10 text-gray-800">
            Produtos em destaque
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                description={""}
                key={product.id}
                {...product}
                qnt_reviews={0}
                avarage_rating={0}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                addItemToCart={addItemToCart}
                isIntoCart={isIntoCart}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="font-semibold text-lg mb-2">Entrega rápida</h3>
            <p className="text-gray-600 text-sm">
              Receba seus produtos com rapidez em todo o Brasil.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Pagamento seguro</h3>
            <p className="text-gray-600 text-sm">
              Diversos métodos de pagamento com total segurança.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Grandes ofertas</h3>
            <p className="text-gray-600 text-sm">
              Promoções exclusivas em várias categorias de produtos.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
