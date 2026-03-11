import { useEffect, useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("favorites");
    if (storedData) {
      setFavorites(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (item: number) => {
    setFavorites((prev) =>
      prev.includes(item)
        ? prev.filter((fav) => fav !== item)
        : [...prev, item]
    );
  };

  const isFavorite = (item: number) => favorites.includes(item);

  return { favorites, toggleFavorite, isFavorite };
}