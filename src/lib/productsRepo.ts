import { Product } from "@/src/types/types";
import {
  logProductCreated,
  logProductDeleted,
} from "@/src/lib/activityLogsRepo";

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
      imagem: "https://storage.googleapis.com/propcart-br.appspot.com/images%2Fitems%2FZDo2UPcBdzhr1CniYN8i_1684855933547.jpg",
      preco: 45.99,
      categoria: "Ficção",
      tags: ["sci-fi", "aventura"],
      estoque: 10,
    },
    {
      id: 2,
      nome: "Guia de Culinária Brasileira",
      descricao: "Receitas clássicas e contemporâneas de várias regiões do Brasil.",
      imagem: "https://static.wixstatic.com/media/cfa9bb_c40940ebf34343a0bb4ada95cdc58ed2~mv2.jpg/v1/fill/w_420,h_549,al_c,lg_1,q_80/cfa9bb_c40940ebf34343a0bb4ada95cdc58ed2~mv2.jpg",
      preco: 35.5,
      categoria: "Culinária",
      tags: ["receitas", "brasil"],
      estoque: 10,
    },
    {
      id: 3,
      nome: "Manual de Programação em JavaScript",
      descricao: "Do básico ao avançado com exemplos práticos e boas práticas.",
      imagem: "https://m.media-amazon.com/images/I/91z1xY4ppaL._AC_UF1000,1000_QL80_.jpg",
      preco: 89.9,
      categoria: "Tecnologia",
      tags: ["javascript", "web"],
      estoque: 10,
    },
    {
      id: 4,
      nome: "Romance de Mistério",
      descricao: "Segredos, reviravoltas e pistas em um suspense envolvente.",
      imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy1r76q09-CKDS5DrW98GzAjTiSH7xsNGG4Q&s",
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
  logProductCreated(created.nome);
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
  const toDelete = products.find((p) => p.id === id);
  writeAll(products.filter((p) => p.id !== id));
  if (toDelete) {
    logProductDeleted(toDelete.nome);
  }
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

