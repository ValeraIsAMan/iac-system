import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { useRouter } from "next/router";
import { Loading } from "@/components/Loading";
import { api } from "@/utils/api";
import { requireAuth } from "@/utils/requireAuth";
import { getServerAuthSession } from "@/server/auth";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { env } from "@/env.mjs";

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

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    data: users,
    status: queryStatus,
    refetch,
  } = api.user.getAllUsers.useQuery();

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

  const deleteStudent = (telegramID: string) => {
    deleteUser({ id: telegramID });
  };

  const confirmStudent = (telegramID: string, curator: string) => {
    studentMutate({ id: telegramID, curator: curator });
  };

  const confirmCurator = (telegramID: string, curator: string) => {
    curatorMutate({ id: telegramID, curator: curator });
  };

  const deleteCurator = (telegramID: string) => {
    curatorDeleteMutate({ id: telegramID });
  };

  const options = [
    {
      name: "Select…",
      value: "",
    },
    {
      name: "Александр Юрьеви",
      value: "Александр Юрьеви",
    },
    {
      name: "Кого еще кроме Александра Юрьевича",
      value: "Кого еще кроме Александра Юрьевича",
    },
    {
      name: "Александр Юрьевич лучший!",
      value: "Александр Юрьевич лучший!",
    },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]!.value);

  return (
    <>
      <Head>
        <title>AIC System</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <>
            <div className="flex items-center gap-2">
              {session ? (
                <p className="text-2xl text-white">Hello, Administrator!</p>
              ) : (
                <p className="text-2xl text-white"> Пройдите авторизацию!</p>
              )}

              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={
                  session
                    ? () => void signOut()
                    : () => router.push("/auth/signin")
                }
              >
                {session ? "Sign out" : "Sign in"}
              </button>
            </div>

            <div className="container relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
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
                      Подтвержден?
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Действие
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
                            Ссылка на диск
                          </a>
                        </td>
                        <td className=" px-6 py-4">
                          <a
                            href={user.otchet!}
                            target="_blank"
                            className="w-32 truncate text-left underline"
                          >
                            Ссылка на диск
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {!user.curator ? (
                            <select
                              id={`curator-${index}`}
                              value={selectedOption}
                              onChange={(e) =>
                                confirmCurator(
                                  user.telegramID as string,
                                  e.target.value
                                )
                              }
                              className="block w-52 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            >
                              {options.map((item) => (
                                <option key={item.value} value={item.value}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
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
                        <td className="px-6 py-4">{user.eduName}</td>
                        <td className="px-6 py-4">{user.specialty}</td>
                        <td className="px-6 py-4">{user.year}</td>
                        <td className="px-6 py-4">{user.apprenticeshipType}</td>
                        <td className="px-6 py-4">
                          {user.employment ? "Да" : "Нет"}
                        </td>
                        <td className="px-6 py-4">
                          {user.confirmed ? "Да" : "Нет"}
                        </td>
                        <td className="flex items-center space-x-3 px-6 py-4">
                          <button
                            onClick={
                              // () => console.log(selectedOption)
                              () =>
                                confirmStudent(
                                  user.telegramID as string,
                                  user.curator as string
                                )
                            }
                            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                          >
                            Подтвердить
                          </button>
                          <button
                            onClick={() =>
                              deleteStudent(user.telegramID as string)
                            }
                            className="font-medium text-red-600 hover:underline dark:text-red-500"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        </div>
      </main>
    </>
  );
};

export default Home;
