import { type NextPage } from "next";
import Head from "next/head";

import { api } from "@/utils/api";
import { requireAuth } from "@/utils/requireAuth";
import { getServerAuthSession } from "@/server/auth";
import toast from "react-hot-toast";

import { env } from "@/env.mjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EduFac,
  EduSchema,
  PraktSchema,
  PraktType,
} from "@/server/schema/form.schema";
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

const Aprenticeship: NextPage = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PraktType>({
    resolver: zodResolver(PraktSchema),
  });

  const {
    data: apprenticeshipNames,
    refetch: refetch,
    dataUpdatedAt,
  } = api.form.getApreticeshipNames.useQuery();

  const { mutate: createPraktTypeMutate } =
    api.form.createPraktType.useMutation({
      onMutate: () => {
        toast.loading("Создание...", {
          id: "praktCreate",
          style: {
            borderRadius: "10px",
            background: "#1E1E2A", //#1E1E2A
            color: "#fff",
          },
        });
      },
      onError: (error) => {
        toast.error(error.message, {
          id: "praktCreate",
          icon: "🥲",
          style: {
            borderRadius: "10px",
            background: "#F43F5E",
            color: "#fff",
          },
        });
      },
      onSuccess: (data) => {
        toast.success(`Создано тип практики`, {
          id: "praktCreate",
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
  const { mutate: deletePraktTypeMutate } =
    api.form.deletePraktType.useMutation({
      onMutate: () => {
        toast.loading("Удаление...", {
          id: "praktDel",
          style: {
            borderRadius: "10px",
            background: "#1E1E2A", //#1E1E2A
            color: "#fff",
          },
        });
      },
      onError: (error) => {
        toast.error(error.message, {
          id: "praktDel",
          icon: "🥲",
          style: {
            borderRadius: "10px",
            background: "#F43F5E",
            color: "#fff",
          },
        });
      },
      onSuccess: (data) => {
        toast.success(`Удалено учереждение`, {
          id: "praktDel",
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

  const createPraktType = (data: EduFac) => {
    createPraktTypeMutate({ name: data.name });
  };

  const deletePraktType = (data: EduFac) => {
    deletePraktTypeMutate({ name: data.name });
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
            Тип практики
          </h1>

          <div className="container">
            <div className=" relative h-full overflow-x-scroll shadow-md sm:rounded-lg">
              <table className=" w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Кол.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Название
                    </th>

                    <th scope="col" className="px-6 py-3">
                      Действие
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {apprenticeshipNames?.map((c, index) => {
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
                          {c.name}
                        </th>

                        <td className="flex items-center space-x-3 px-6 py-4">
                          <button
                            onClick={() =>
                              deletePraktType({ name: c.name as string })
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
              <form onSubmit={handleSubmit(createPraktType)}>
                <div className="flex border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                  <div className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <input
                      id="name"
                      placeholder="Название учереждения"
                      type="text"
                      className="text-black dark:text-white"
                      {...register("name", { required: true })}
                    ></input>
                    {errors.name && (
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

export default Aprenticeship;
