import { api } from "@/utils/api";
import { NextPage } from "next";
import { DataTable } from "../../components/data-table";
import { columns } from "@/components/columns";
import { requireAuth } from "@/utils/requireAuth";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { env } from "@/env.mjs";
import Head from "next/head";
import { Nav } from "@/components/Nav";
import Link from "next/link";

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
const ExperimentalStudents: NextPage = () => {
  const {
    data: user,
    refetch,
    dataUpdatedAt,
  } = api.user.getAllUsers.useQuery();

  return (
    <>
      <Head>
        <title>AIC System</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Nav refetch={refetch} dataUpdatedAt={dataUpdatedAt} />
        <h1 className=" mb-2 text-center text-2xl font-semibold text-white">
          Студенты
        </h1>

        <div className="w-screen  bg-white px-2 py-4 dark:bg-zinc-900 dark:text-slate-50 ">
          {user && <DataTable data={user} columns={columns} />}
        </div>
        <div className="flex-1 flex-grow"></div>
        <footer className="relative bottom-0 border-t-2 shadow">
          <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
              © 2023{" "}
              <a
                href="https://eversel2.vercel.app/"
                className="hover:underline"
              >
                IACSYSTEM™
              </a>
            </span>
            <ul className="mt-3 flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
              <li>
                <Link href="/system" className="mr-4 hover:underline md:mr-6">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="https://t.me/embersee" className="hover:underline">
                  Поддержка
                </Link>
              </li>
            </ul>
          </div>
        </footer>
      </main>
    </>
  );
};

export default ExperimentalStudents;
