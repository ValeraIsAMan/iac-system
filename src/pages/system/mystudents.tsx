import { type NextPage } from "next";
import Head from "next/head";

import { api } from "@/utils/api";
import { requireAuth } from "@/utils/requireAuth";
import { getServerAuthSession } from "@/server/auth";
import React, { useRef } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";

import { Nav } from "@/components/Nav";

import { useSession } from "next-auth/react";
import { prisma } from "@/server/db";
import { Button } from "@/components/ui/button";

export const getServerSideProps = requireAuth(async (ctx) => {
  const session = await getServerAuthSession(ctx);

  const curators = await prisma.curator.findMany({
    select: {
      telegramID: true,
    },
  });

  if (curators == null) {
    return {
      redirect: {
        destination: "/auth/signin", // login path
        permanent: false,
      },
    };
  }

  if (!curators.some((value) => value.telegramID === session?.user.id)) {
    return {
      redirect: {
        destination: "/auth/signin", // login path
        permanent: false,
      },
    };
  }

  return { props: {} };
});

const MyStudents: NextPage = () => {
  const { data: session } = useSession();
  const tableRef = useRef(null);
  const {
    data: users,
    status: queryStatus,
    refetch,
    isRefetching,
    dataUpdatedAt,
  } = api.user.getMyStudents.useQuery({
    telegramID: session?.user?.id as string,
  });

  return (
    <>
      <Head>
        <title>AIC System</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {/* <Sidebar /> */}
        <div className=" w-full overflow-scroll p-4">
          <Nav refetch={refetch} dataUpdatedAt={dataUpdatedAt} />
          <h1 className="my-2 text-center text-2xl font-semibold text-white">
            Мои Студенты
          </h1>
          <div className="container px-0 ">
            <div className="relative h-[80vh] overflow-scroll shadow-md sm:rounded-lg">
              <table
                className="relative mx-auto text-sm text-gray-500 dark:text-gray-400"
                ref={tableRef}
              >
                <thead className="sticky left-0 top-0 z-50 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Кол.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      ФИО
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Telegram
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Номер телефона
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Начало практики
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Конец практики
                    </th>
                    <th scope="col" className=" px-6 py-3">
                      Направление
                    </th>
                    <th scope="col" className="  px-6 py-3">
                      Отчет
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Куратор
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Наименование учебного учреждения
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Наименование специальности
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Курс
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Вид практики
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Трудоустройство
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Подтвержден
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Документы подписаны
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user, index) => {
                    return (
                      <tr
                        key={index}
                        className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                      >
                        <th
                          scope="row"
                          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                        >
                          {index + 1}
                        </th>
                        <th
                          scope="row"
                          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                        >
                          {user.FIO}
                        </th>
                        <td className="px-6 py-4">
                          <a
                            href={`https://t.me/${user.name}`}
                            target="_blank"
                            className="underline"
                          >
                            {user.name}
                          </a>
                        </td>
                        <td className="px-6 py-4">{user.phonenumber}</td>
                        <td className="px-6 py-4">
                          {user.startdate?.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {user.enddate?.toLocaleDateString()}
                        </td>
                        <td className=" px-6 py-4">
                          <a
                            href={user.napravlenie!}
                            target="_blank"
                            className="w-32 truncate text-left underline"
                          >
                            Открыть
                          </a>
                        </td>
                        {user.otchet !== null ? (
                          <td className=" px-6 py-4">
                            <a
                              href={user.otchet}
                              target="_blank"
                              className="w-32 truncate text-left underline"
                            >
                              Открыть
                            </a>
                          </td>
                        ) : (
                          <td className=" px-6 py-4">
                            <a
                              href=""
                              target="_blank"
                              className="w-32 truncate text-left underline"
                            >
                              Не отправлен
                            </a>
                          </td>
                        )}
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {user.curator}
                        </td>
                        <td className="px-6 py-4">{user.eduName}</td>
                        <td className="px-6 py-4">{user.specialty}</td>
                        <td className="px-6 py-4">{user.year}</td>
                        <td className="px-6 py-4">{user.apprenticeshipType}</td>
                        <td className="px-6 py-4">
                          {user.employment ? (
                            <span className="text-green-500">Да</span>
                          ) : (
                            <span className="text-red-500">Нет</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {user.confirmed ? (
                            <span className="text-green-500">Да</span>
                          ) : (
                            <span className="text-red-500">Нет</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {user.signed ? (
                            <span className="text-green-500">Да</span>
                          ) : (
                            <span className="text-red-500">Нет</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <DownloadTableExcel
                filename={`Студенты-${new Date().toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}`}
                sheet="Студенты"
                currentTableRef={tableRef.current}
              >
                <Button variant="secondary"> Экспорт в эксель </Button>
              </DownloadTableExcel>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MyStudents;
