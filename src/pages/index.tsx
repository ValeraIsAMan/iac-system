import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { DateRangePicker } from "rsuite";

import { useRouter } from "next/router";
import { Loading } from "@/components/Loading";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  return (
    <>
      <Head>
        <title>AIC System</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {loading ? (
            <Loading isLoading={loading} />
          ) : (
            <>
              <div className="flex flex-col items-center gap-2">
                {session ? (
                  <p className="text-2xl text-white">
                    Hello, {session.user.name}!{" "}
                  </p>
                ) : (
                  <p className="text-2xl text-white"> Пройдите авторизацию!</p>
                )}

                <button
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                  onClick={session ? () => void signOut() : () => void signIn()}
                >
                  {session ? "Sign out" : "Sign in"}
                </button>
              </div>
              {status === "authenticated" && (
                <button
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                  onClick={() => router.push("/form")}
                >
                  Заполнить форму
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
