import { type NextPage } from "next";
import Head from "next/head";

import { api } from "@/utils/api";
import { requireAuth } from "@/utils/requireAuth";
import { getServerAuthSession } from "@/server/auth";
import toast from "react-hot-toast";

import { Cross2Icon } from "@radix-ui/react-icons";
import { env } from "@/env.mjs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Nav } from "@/components/Nav";
import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";

export const getServerSideProps = requireAuth(async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!env.ADMIN_ID.includes(session?.user?.id as string)) {
    return {
      redirect: {
        destination: "/", // login path
        permanent: false,
      },
    };
  }

  return { props: {} };
});

const Students: NextPage = () => {
  const tableRef = useRef(null);

  const [open, isOpen] = useState(false);

  const {
    data: users,
    status: queryStatus,
    refetch,
    isRefetching,
    dataUpdatedAt,
  } = api.user.getAllUsers.useQuery();

  const { data: curators, refetch: refetchCurator } =
    api.user.getAllCurators.useQuery();

  const { mutate: studentMutate } = api.user.confirmStudent.useMutation({
    onMutate: () => {
      toast.loading("Подтверждение...", {
        id: "confirm",
        style: {
          borderRadius: "10px",
          background: "#1E1E2A", //#1E1E2A
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "confirm",
        icon: "🥲",
        style: {
          borderRadius: "10px",
          background: "#F43F5E",
          color: "#fff",
        },
      });
    },
    onSuccess: (data) => {
      toast.success(`Студент был оповещен`, {
        id: "confirm",
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#22C55E",
          color: "#fff",
        },
      });
      refetch();
    },
  });

  const { mutate: deleteUser } = api.user.deleteStudent.useMutation({
    onMutate: () => {
      toast.loading("Удаление...", {
        id: "confirm",
        style: {
          borderRadius: "10px",
          background: "#1E1E2A", //#1E1E2A
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "confirm",
        icon: "🥲",
        style: {
          borderRadius: "10px",
          background: "#F43F5E",
          color: "#fff",
        },
      });
    },
    onSuccess: (data) => {
      toast.success(`Студент был удален`, {
        id: "confirm",
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#22C55E",
          color: "#fff",
        },
      });
      refetch();
    },
  });

  const { mutate: curatorMutate } = api.user.confirmCurator.useMutation({
    onMutate: () => {
      toast.loading("Добавление куратора...", {
        id: "curator",
        style: {
          borderRadius: "10px",
          background: "#1E1E2A", //#1E1E2A
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "curator",
        icon: "🥲",
        style: {
          borderRadius: "10px",
          background: "#F43F5E",
          color: "#fff",
        },
      });
    },
    onSuccess: (data) => {
      toast.success(`Куратор был удален`, {
        id: "curator",
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#22C55E",
          color: "#fff",
        },
      });
      refetch();
    },
  });

  const { mutate: curatorDeleteMutate } = api.user.deleteCurator.useMutation({
    onMutate: () => {
      toast.loading("Удаление...", {
        id: "curatorDel",
        style: {
          borderRadius: "10px",
          background: "#1E1E2A", //#1E1E2A
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "curator",
        icon: "🥲",
        style: {
          borderRadius: "10px",
          background: "#F43F5E",
          color: "#fff",
        },
      });
    },
    onSuccess: (data) => {
      toast.success(`Куратор был удален`, {
        id: "curatorDel",
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#22C55E",
          color: "#fff",
        },
      });
      refetch();
    },
  });
  const { mutate: signMutateNapravlenie } =
    api.user.confirmSigningNapravlenie.useMutation({
      onMutate: () => {
        toast.loading("Отправление...", {
          id: "sign",
          style: {
            borderRadius: "10px",
            background: "#1E1E2A", //#1E1E2A
            color: "#fff",
          },
        });
      },
      onError: (error) => {
        toast.error(error.message, {
          id: "sign",
          icon: "🥲",
          style: {
            borderRadius: "10px",
            background: "#F43F5E",
            color: "#fff",
          },
        });
      },
      onSuccess: (data) => {
        toast.success(`Студент оповещен`, {
          id: "sign",
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#22C55E",
            color: "#fff",
          },
        });
        refetch();
      },
    });

  const { mutate: signMutateOtchet } =
    api.user.confirmSigningOtchet.useMutation({
      onMutate: () => {
        toast.loading("Отправление...", {
          id: "sign",
          style: {
            borderRadius: "10px",
            background: "#1E1E2A", //#1E1E2A
            color: "#fff",
          },
        });
      },
      onError: (error) => {
        toast.error(error.message, {
          id: "sign",
          icon: "🥲",
          style: {
            borderRadius: "10px",
            background: "#F43F5E",
            color: "#fff",
          },
        });
      },
      onSuccess: (data) => {
        toast.success(`Студент оповещен`, {
          id: "sign",
          icon: "👏",
          style: {
            borderRadius: "10px",
            background: "#22C55E",
            color: "#fff",
          },
        });
        refetch();
      },
    });

  const deleteStudent = (telegramID: string) => {
    deleteUser({ id: telegramID });
  };

  const confirmStudent = (telegramID: string, curator: string) => {
    studentMutate({ id: telegramID, curator: curator || "" });
  };

  const confirmCurator = (telegramID: string, curator: string) => {
    curatorMutate({ id: telegramID, curator: curator });
  };

  const deleteCurator = (telegramID: string) => {
    curatorDeleteMutate({ id: telegramID });
  };

  const napravlenieSigned = (telegramID: string) => {
    signMutateNapravlenie({ id: telegramID });
  };

  const otchetSigned = (telegramID: string) => {
    signMutateOtchet({ id: telegramID });
  };

  const openSidebar = () => {
    isOpen((prev) => !prev);
    console.log("click");
  };

  return (
    <>
      <Head>
        <title>AIC System</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className=" w-full overflow-scroll">
          <Nav refetch={refetch} dataUpdatedAt={dataUpdatedAt} />
          <h1 className="mb-2 text-center text-2xl font-semibold text-white">
            Студенты
          </h1>

          <div className="mx-0 w-full px-0  ">
            <div className="relative h-[81vh] overflow-scroll shadow-md sm:rounded-lg">
              <table
                className="relative mx-auto text-sm text-gray-500 dark:text-gray-400"
                ref={tableRef}
              >
                <thead className="sticky left-0 top-0 z-40 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
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
                      Направление подписано
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Отчет подписан
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Действия
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
                        {user.napravlenie !== null ? (
                          <td className=" px-6 py-4">
                            <a
                              href={user.napravlenie!}
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
                          {!user.curator ? (
                            <Select
                              onValueChange={(e: string) =>
                                confirmCurator(user.telegramID as string, e)
                              }
                            >
                              <SelectTrigger className=" bg-white">
                                <SelectValue placeholder="Выбрать..." />
                              </SelectTrigger>
                              <SelectContent>
                                {curators?.map((item) => (
                                  <SelectItem
                                    key={item.id}
                                    value={item.FIO as string}
                                  >
                                    {item.FIO}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            user.curator && (
                              <div className="flex items-center justify-center">
                                {user.curator}
                                <button
                                  onClick={() =>
                                    deleteCurator(user.telegramID as string)
                                  }
                                  className="ml-5 rounded-full hover:bg-red-500"
                                >
                                  <Cross2Icon />
                                </button>
                              </div>
                            )
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {user.eduName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {user.specialty}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {user.year}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {user.apprenticeshipType}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
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
                          {user.signedNapravlenie ? (
                            <span className="text-green-500">Да</span>
                          ) : (
                            <span className="text-red-500">Нет</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {user.signedOtchet ? (
                            <span className="text-green-500">Да</span>
                          ) : (
                            <span className="text-red-500">Нет</span>
                          )}
                        </td>
                        <td className="flex items-center space-x-3 px-6 py-4">
                          <Button
                            onClick={() =>
                              confirmStudent(
                                user.telegramID as string,
                                user.curator as string
                              )
                            }
                            className="whitespace-nowrap border border-green-500 font-medium text-green-600 hover:underline dark:text-green-500"
                            variant="link"
                          >
                            Подтвердить
                          </Button>
                          <Button
                            onClick={() =>
                              napravlenieSigned(user.telegramID as string)
                            }
                            className="whitespace-nowrap border border-blue-500 font-medium text-blue-600 hover:underline dark:text-blue-500"
                            variant="link"
                          >
                            Подписано Направление
                          </Button>
                          <Button
                            onClick={() =>
                              otchetSigned(user.telegramID as string)
                            }
                            className="whitespace-nowrap border border-blue-500 font-medium text-blue-600 hover:underline dark:text-blue-500"
                            variant="link"
                          >
                            Подписан Отчет
                          </Button>

                          <Button
                            onClick={() =>
                              deleteStudent(user.telegramID as string)
                            }
                            className="whitespace-nowrap font-medium hover:underline "
                            variant="destructive"
                          >
                            Удалить
                          </Button>
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

export default Students;
