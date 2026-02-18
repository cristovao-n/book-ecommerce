import { ShoppingCart, UserRound, Menu } from "lucide-react";
import { Flex } from "antd";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex items-center justify-between px2 py-4 m-1 bg-white shadow-md rounded">
      <div className="flex justify-between pl-5 gap-4">
        <Menu color="#666869" strokeWidth={2} />
        <Link href="/">
          <p className="font-bold text-gray-800">AI Books E-commerce</p>
        </Link>
      </div>

      <Flex gap={10}>
        <ul className="flex flex-row gap-10 pr-5">
          <li>
            <Link href="/carrinho">
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
