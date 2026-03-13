import { ShoppingCart, UserRound, Menu } from "lucide-react";
import { Divider, Flex } from "antd";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-2 py-4 m-1 bg-white shadow-md rounded flex-wrap">
      <div className="flex justify-between pl-5 gap-4">
        <Menu color="#666869" strokeWidth={2} />
        <Link href="/">
          <p className="font-bold text-gray-800">AI Store</p>
        </Link>

        <Divider orientation="vertical" className="self-center" style={{borderColor: '#000000'}}/>

        <Link className="hover:text-blue-500 bold" href={"/products"}>
          Produtos
        </Link>

        <Link className="hover:text-blue-500 bold" href={"/orders"}>
          Pedidos
        </Link>

        <Link className="hover:text-blue-500 bold" href={"/orders-management"}>
          Gestão de Pedidos
        </Link>
      </div>

      <Flex gap={10}>
        <ul className="flex flex-row gap-10 pr-5">
          <li>
            <Link href="/cart">
              <ShoppingCart />
            </Link>
          </li>
          <li>
            <Link href="/perfil">
              <UserRound />
            </Link>
          </li>
        </ul>
      </Flex>
    </header>
  );
};
