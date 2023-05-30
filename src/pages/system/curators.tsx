import { type NextPage } from "next";
import Head from "next/head";

import { api } from "@/utils/api";
import { requireAuth } from "@/utils/requireAuth";
import { getServerAuthSession } from "@/server/auth";
import toast from "react-hot-toast";

import { env } from "@/env.mjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Curator, CuratorSchema } from "@/server/schema/form.schema";

import { Nav } from "@/components/Nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

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

const Curators: NextPage = () => {
  const [open, isOpen] = useState(false);

  const openSidebar = () => {
    isOpen((prev) => !prev);
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Curator>({
    resolver: zodResolver(CuratorSchema),
  });

  const {
    data: curators,
    refetch: refetch,
    dataUpdatedAt,
  } = api.user.getAllCurators.useQuery();

  const { mutate: createCuratorMutate } = api.user.createCurator.useMutation({
    onMutate: () => {
      toast.loading("Создание...", {
        id: "curatorCreate",
        style: {
          borderRadius: "10px",
          background: "#1E1E2A", //#1E1E2A
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "curatorCreate",
        icon: "🥲",
        style: {
          borderRadius: "10px",
          background: "#F43F5E",
          color: "#fff",
        },
      });
    },
    onSuccess: (data) => {
      toast.success(`Создан куратор`, {
        id: "curatorCreate",
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
  const { mutate: deleteCuratorMutate } = api.user.deleteCurators.useMutation({
    onMutate: () => {
      toast.loading("Удаление...", {
        id: "curatorCreate",
        style: {
          borderRadius: "10px",
          background: "#1E1E2A", //#1E1E2A
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "curatorCreate",
        icon: "🥲",
        style: {
          borderRadius: "10px",
          background: "#F43F5E",
          color: "#fff",
        },
      });
    },
    onSuccess: (data) => {
      toast.success(`Удален куратор`, {
        id: "curatorCreate",
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

  const onSubmit = (data: Curator) => {
    createCuratorMutate({
      id: data.telegramID,
      FIO: data.FIO,
      link: data.link,
    });
  };

  const deleteCurators = (telegramId: string) => {
    deleteCuratorMutate({ id: telegramId });
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
          <h1 className="my-2 text-center text-2xl font-semibold text-white">
            Кураторы
          </h1>

          <div className="container">
            <div className=" relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Кол.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      ФИО
                    </th>
                    <th scope="col" className="px-6 py-3">
                      TelegramID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ссылка в группу
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Действие
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {curators?.map((c, index) => {
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
                          {c.FIO}
                        </th>

                        <td className="px-6 py-4">{c.telegramID}</td>
                        <th
                          scope="row"
                          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 underline dark:text-white"
                        >
                          <Link href={c.link!} target="_blank">
                            {c.link}
                          </Link>
                        </th>

                        <td className="flex items-center space-x-3 px-6 py-4">
                          <button
                            onClick={() =>
                              deleteCurators(c.telegramID as string)
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                  <div className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <Input
                      id="name"
                      placeholder="ФИО Куратора"
                      type="text"
                      className="text-black dark:text-white"
                      {...register("FIO", { required: true })}
                    />
                    {errors.FIO && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="px-6 py-4">
                    <Input
                      id="telegram"
                      placeholder="TelegramID"
                      type="text"
                      className="text-black dark:text-white"
                      {...register("telegramID", { required: true })}
                    />
                    {errors.telegramID && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="px-6 py-4">
                    <Input
                      id="link"
                      placeholder="Ссылка"
                      type="text"
                      className="text-black dark:text-white"
                      {...register("link", { required: true })}
                    />
                    {errors.link && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 px-6 py-4">
                    <Button
                      type="submit"
                      className="bg-green-600 font-medium hover:bg-green-500 hover:underline dark:bg-green-500"
                    >
                      Создать
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            <div>
              <Alert variant="default" className="mt-4 w-fit">
                <AlertTitle>
                  Откуда мне взять Telegram ID куратора? 🤔
                </AlertTitle>
                <AlertDescription>
                  Нужно попросить куратора открыть{" "}
                  <a
                    href="https://t.me/myidbot"
                    className="underline"
                    target="_blank"
                  >
                    этого бота
                  </a>{" "}
                  в телеграмме и написать ему "/getid", он отправит куратору его
                  Telegram ID!
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Curators;
