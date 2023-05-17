import {
  ArrowLeftIcon,
  DividerHorizontalIcon,
  DotFilledIcon,
  ListBulletIcon,
  ShadowInnerIcon,
  TableIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

import { Button } from "./ui/button";
import { useRouter } from "next/router";

export const Sidebar = () => {
  const router = useRouter();
  return (
    <div className="relative flex h-screen w-1/6 min-w-max flex-shrink-0 flex-grow-0 select-none flex-col border-r-2 bg-white/5 p-6 text-white">
      <Button
        className="mb-4 flex items-center justify-center"
        variant="outline"
        onClick={() => router.push("/system")}
      >
        <ArrowLeftIcon className=" h-6 w-6 " />
        <p className="my-2 ml-2 text-xl font-semibold ">Главная страница</p>
      </Button>
      <div className="flex items-center ">
        <TableIcon className=" h-6 w-6 " />
        <p className="my-2 ml-2 text-3xl font-semibold ">Таблицы</p>
      </div>
      <Link
        href="/system/students"
        className="my-2 ml-6 flex items-center gap-2 text-2xl font-medium hover:underline"
      >
        <DividerHorizontalIcon className="h-4 w-4" />
        Cтуденты
      </Link>

      <Link
        href="/system/curators"
        className="my-2 ml-6 flex items-center gap-2 text-2xl font-medium hover:underline"
      >
        <DividerHorizontalIcon className="h-4 w-4" />
        Кураторы
      </Link>

      <Link
        href="/system/educationfacility"
        className="my-2 ml-6 flex items-center gap-2 text-2xl font-medium hover:underline"
      >
        <DividerHorizontalIcon className="h-4 w-4" />
        Учебные учреждения
      </Link>

      <Link
        href="/system/aprenticeship"
        className="my-2 ml-6 flex items-center gap-2 text-2xl font-medium hover:underline"
      >
        <DividerHorizontalIcon className="h-4 w-4" />
        Тип практики
      </Link>
    </div>
  );
};
