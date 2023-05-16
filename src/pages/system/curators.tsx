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
import { Sidebar } from "@/components/Sidebar";
import { Nav } from "@/components/Nav";

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
    createCuratorMutate({ id: data.telegramID, FIO: data.FIO });
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
        <Sidebar />
        <div className=" w-5/6 overflow-scroll p-4">
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
                    <input
                      id="name"
                      placeholder="ФИО Куратора"
                      type="text"
                      className="text-black dark:text-white"
                      {...register("FIO", { required: true })}
                    ></input>
                    {errors.FIO && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="px-6 py-4">
                    <input
                      id="telegram"
                      placeholder="TelegramID"
                      type="text"
                      className="text-black dark:text-white"
                      {...register("telegramID", { required: true })}
                    ></input>
                    {errors.telegramID && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 px-6 py-4">
                    <button
                      type="submit"
                      className="font-medium text-green-600 hover:underline dark:text-green-500"
                    >
                      Создать
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Curators;
