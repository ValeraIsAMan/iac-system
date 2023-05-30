import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { requireAuth } from "@/utils/requireAuth";
import { getServerAuthSession } from "@/server/auth";

import { env } from "@/env.mjs";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

const System: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>AIC System</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className=" w-full overflow-scroll p-4">
          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center">
              {session && (
                <>
                  <p className="text-2xl text-white">
                    Hello, {session.user.name}!
                  </p>
                  <div className=" relative mx-2 my-auto h-12 w-12 rounded-full ">
                    <Image
                      src={session.user?.image as string}
                      alt={session.user?.name as string}
                      // height={40}
                      // width={40}
                      fill
                      className="rounded-full"
                    />
                  </div>
                </>
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
          </div>
          <h1 className="my-2 text-center text-2xl font-semibold text-white">
            Выберете таблицу
          </h1>

          <div className="container flex justify-center gap-4 text-white">
            <Button
              onClick={() => router.push("/system/students")}
              variant="outline"
              size="lg"
            >
              Cтуденты
            </Button>

            <Button
              onClick={() => router.push("/system/curators")}
              variant="outline"
              size="lg"
            >
              Кураторы
            </Button>

            <Button
              onClick={() => router.push("/system/educationfacility")}
              variant="outline"
              size="lg"
            >
              Учебные учреждения
            </Button>

            <Button
              onClick={() => router.push("/system/aprenticeship")}
              variant="outline"
              size="lg"
            >
              Тип практики
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default System;
