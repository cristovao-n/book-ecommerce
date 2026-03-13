"use client";

import { ShoppingCart, UserRound, Menu } from "lucide-react";
import { Badge, Button, Divider, Flex } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/app/auth/AuthContext";

export const Header = () => {
  const { role, loginAsAdmin, logoutToClient } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isOnProductsPage = pathname?.startsWith("/products");
  const isAdmin = role === "admin";

  const handleAdminLogout = () => {
    logoutToClient();
    router.push("/products");
  };

  const handleAdminLoginShortcut = () => {
    router.push("/admin-login");
  };

  const cartIcon = <ShoppingCart />;

  return (
    <header className="flex items-center justify-between px-2 py-4 m-1 bg-white shadow-md rounded flex-wrap">
      <div className="flex justify-between pl-5 gap-4">
        <Menu color="#666869" strokeWidth={2} />
        <Link href="/">
          <p className="font-bold text-gray-800">AI Store</p>
        </Link>

        <Divider
          orientation="vertical"
          className="self-center"
          style={{ borderColor: "#000000" }}
        />

        <Link className="hover:text-blue-500 bold" href={"/products"}>
          Produtos
        </Link>

        {isAdmin && (
          <Link
            className="hover:text-blue-500 bold"
            href={"/activity-logs"}
          >
            Registro de Atividades
          </Link>
        )}

        {!isAdmin && (
          <Link className="hover:text-blue-500 bold" href={"/orders"}>
            Pedidos
          </Link>
        )}

        {isAdmin && (
          <Link className="hover:text-blue-500 bold" href={"/orders-management"}>
            Gestão de Pedidos
          </Link>
        )}
      </div>

      <Flex gap={10} align="center">
        <div className="flex items-center gap-3 pr-5">
          <ul className="flex flex-row gap-6 items-center">
            {!isAdmin && (
              <li>
                <Link href="/cart">{cartIcon}</Link>
              </li>
            )}
            <li className="flex items-center gap-2">
              <UserRound />
              {isAdmin ? (
                <>
                  <Badge color="purple" text="Admin" />
                  <Button size="small" onClick={handleAdminLogout}>
                    Sair
                  </Button>
                </>
              ) : (
                <Button size="small" type="link" onClick={handleAdminLoginShortcut}>
                  Login admin
                </Button>
              )}
            </li>
          </ul>
        </div>
      </Flex>
    </header>
  );
};
