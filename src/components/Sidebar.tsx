import { ChevronDownIcon, PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Dispatch, SetStateAction, useState } from "react";

export const Sidebar = () => {
  return (
    <div className="relative flex h-screen w-1/6 min-w-max flex-shrink-0 flex-grow-0 select-none flex-col border-r-2 bg-white/5 p-6 text-white">
      <p className="my-2 ml-2 text-3xl font-semibold ">Таблицы</p>
      <Link
        href="/system/students"
        className="my-2 ml-6 text-2xl font-medium hover:underline"
      >
        Cтуденты
      </Link>

      <Link
        href="/system/curators"
        className="my-2 ml-6 text-2xl font-medium hover:underline"
      >
        Кураторы
      </Link>

      <Link
        href="/system/educationfacility"
        className="my-2 ml-6 text-2xl font-medium hover:underline"
      >
        Учебные учреждения
      </Link>

      <Link
        href="/system/aprenticeship"
        className="my-2 ml-6 text-2xl font-medium hover:underline"
      >
        Тип практики
      </Link>
    </div>
  );
};
