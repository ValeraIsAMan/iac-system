import Image from "next/image";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReloadIcon } from "@radix-ui/react-icons";

export const Nav = ({
  refetch,
  dataUpdatedAt,
}: {
  refetch: () => void;
  dataUpdatedAt: number;
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center justify-center">
        <Button variant="secondary" onClick={() => refetch()}>
          <ReloadIcon className=" h-5 w-5 transition-transform hover:animate-spin" />
        </Button>
        {dataUpdatedAt && (
          <p className="ml-4 text-white">
            Обновлено в {new Date(dataUpdatedAt).toLocaleTimeString("ru-RU")}
          </p>
        )}
      </div>

      <div className="flex items-center">
        {session ? (
          <>
            <p className="text-2xl text-white">Hello, {session.user.name}!</p>
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
        ) : (
          <p className="text-2xl text-white"> Пройдите авторизацию!</p>
        )}

        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={
            session ? () => void signOut() : () => router.push("/auth/signin")
          }
        >
          {session ? "Sign out" : "Sign in"}
        </button>
      </div>
    </div>
  );
};
