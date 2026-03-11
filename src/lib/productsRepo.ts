import { Product } from "@/src/types/types";

const STORAGE_KEY = "products";

const DEFAULT_STOCK = 10;

function safeParseProducts(raw: string | null): Product[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as Product[]).map((p) => ({
      ...p,
      estoque:
        typeof (p as any).estoque === "number" && Number.isFinite((p as any).estoque)
          ? (p as any).estoque
          : DEFAULT_STOCK,
      tags: Array.isArray((p as any).tags) ? (p as any).tags : [],
    }));
  } catch {
    return [];
  }
}

function readAll(): Product[] {
  if (typeof window === "undefined") return [];
  return safeParseProducts(window.localStorage.getItem(STORAGE_KEY));
}

function writeAll(products: Product[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function nextId(products: Product[]): number {
  const maxId = products.reduce((acc, p) => Math.max(acc, p.id), 0);
  return maxId + 1;
}

export function ensureSeededProducts() {
  if (typeof window === "undefined") return;

  const current = readAll();
  if (current.length > 0) return;

  const seeded: Product[] = [
    {
      id: 1,
      nome: "Livro de Ficção Científica",
      descricao: "Uma jornada épica por mundos distantes e tecnologias incríveis.",
      imagem: "https://placehold.co/600x600?text=Ficcao",
      preco: 45.99,
      categoria: "Ficção",
      tags: ["sci-fi", "aventura"],
      estoque: 10,
    },
    {
      id: 2,
      nome: "Guia de Culinária Brasileira",
      descricao: "Receitas clássicas e contemporâneas de várias regiões do Brasil.",
      imagem: "https://placehold.co/600x600?text=Culinaria",
      preco: 35.5,
      categoria: "Culinária",
      tags: ["receitas", "brasil"],
      estoque: 10,
    },
    {
      id: 3,
      nome: "Manual de Programação em JavaScript",
      descricao: "Do básico ao avançado com exemplos práticos e boas práticas.",
      imagem: "https://placehold.co/600x600?text=Javascript",
      preco: 89.9,
      categoria: "Tecnologia",
      tags: ["javascript", "web"],
      estoque: 10,
    },
    {
      id: 4,
      nome: "Romance de Mistério",
      descricao: "Segredos, reviravoltas e pistas em um suspense envolvente.",
      imagem: "https://placehold.co/600x600?text=Romance",
      preco: 32.0,
      categoria: "Romance",
      tags: ["mistério", "suspense"],
      estoque: 10,
    },
  ];

  writeAll(seeded);
}

export type ProductInput = Omit<Product, "id">;

export function listProducts(): Product[] {
  return readAll();
}

export function getProduct(id: number): Product | null {
  const products = readAll();
  return products.find((p) => p.id === id) ?? null;
}

export function createProduct(input: ProductInput): Product {
  const products = readAll();
  const created: Product = { ...input, id: nextId(products) };
  const next = [created, ...products];
  writeAll(next);
  return created;
}

export function updateProduct(id: number, input: ProductInput): Product {
  const products = readAll();
  const idx = products.findIndex((p) => p.id === id);
  if (idx < 0) {
    throw new Error("Product not found");
  }
  const updated: Product = { ...input, id };
  const next = [...products];
  next[idx] = updated;
  writeAll(next);
  return updated;
}

export function deleteProduct(id: number) {
  const products = readAll();
  writeAll(products.filter((p) => p.id !== id));
}

export function decrementInventory(
  lines: Array<{ productId: number; quantity: number }>,
) {
  const products = readAll();
  const byId = new Map(products.map((p) => [p.id, p]));

  for (const line of lines) {
    const p = byId.get(line.productId);
    if (!p) throw new Error(`Produto ${line.productId} não encontrado`);
    if (line.quantity <= 0 || !Number.isFinite(line.quantity)) {
      throw new Error("Quantidade inválida");
    }
    if (p.estoque < line.quantity) {
      throw new Error(`Estoque insuficiente: ${p.nome}`);
    }
  }

  const next = products.map((p) => {
    const orderedQty = lines
      .filter((l) => l.productId === p.id)
      .reduce((acc, l) => acc + l.quantity, 0);
    if (!orderedQty) return p;
    return { ...p, estoque: p.estoque - orderedQty };
  });

  writeAll(next);
}

