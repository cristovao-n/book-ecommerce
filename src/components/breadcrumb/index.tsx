"use client";

import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";

const renderPaths = () => {
  const currentPagePaths = usePathname();
  const paths = currentPagePaths.split("/").filter((seg) => seg.length > 0);
  const home = [{ title: <a href="/">Home</a> }];
  const formatedPaths = paths.map((path) => ({
    title: <a href={path}>{path.charAt(0).toUpperCase() + path.slice(1)}</a>,
  }));

  return [...home, ...formatedPaths];
};

export const SimpleBreadcrumb = () => {
  const formatedPaths = renderPaths();
  const pathDeep = formatedPaths.length;

  return pathDeep == 1 ? "" : <Breadcrumb items={[...formatedPaths]} />;
};
