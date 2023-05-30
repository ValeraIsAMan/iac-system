import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { useRouter } from "next/router";

import { api } from "@/utils/api";

import { useDropzone } from "react-dropzone";

import initFirebase from "@/lib/firebaseInit";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import UploadProgress from "@/components/uploadProgress";

import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { requireAuth } from "@/utils/requireAuth";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";

initFirebase();

const storage = getStorage();

type Image = {
  imageFile: Blob;
};

export const getServerSideProps = requireAuth(async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (env.ADMIN_ID.includes(session?.user?.id as string)) {
    return {
      redirect: {
        destination: "/system", // admin path
        permanent: false,
      },
    };
  }

  const curators = await prisma.curator.findMany({
    select: {
      telegramID: true,
    },
  });

  if (curators == null) {
    return { props: {} };
  }

  if (curators.some((value) => value.telegramID === session?.user.id)) {
    return {
      redirect: {
        destination: "/system/mystudents", // curator path
        permanent: false,
      },
    };
  }

  return { props: {} };
});

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  // const loading = status === "loading";
  const router = useRouter();

  const [progress2, setProgress2] = useState<number>(0);

  const [imageUrlOtchet, setImageUrlOtchet] = useState<string>("");

  const [fileName2, setFileName2] = useState("");

  const [loading2, setLoading2] = useState(false);
  const [success2, setSuccess2] = useState(false);

  const {
    data: user,
    status: queryStatus,
    refetch,
  } = api.user.getStatus.useQuery();

  const { mutate } = api.user.submitOtchet.useMutation({
    onMutate: () => {
      toast.loading("Отправляется отчет...", {
        id: "otchet",
        style: {
          borderRadius: "10px",
          background: "#1E1E2A", //#1E1E2A
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "otchet",
        icon: "🥲",
        style: {
          borderRadius: "10px",
          background: "#F43F5E",
          color: "#fff",
        },
      });
    },
    onSuccess: (data) => {
      toast.success(`Отчет отправлен!`, {
        id: "otchet",
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

  const onDrop2 = useCallback((acceptedFiles: any[]) => {
    // Upload files to storage
    const file = acceptedFiles[0];
    uploadImage2({ imageFile: file });
  }, []);

  const {
    getRootProps: getRootProps2,
    getInputProps: getInputProps2,
    open: open2,
  } = useDropzone({
    useFsAccessApi: false,
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    onDrop: onDrop2,
  });

  const uploadImage2 = async ({ imageFile }: Image) => {
    try {
      setLoading2(true);
      const storageRef2 = ref(
        storage,
        "Отчет_" + new Date().toISOString() + "_" + imageFile.name
      );
      const uploadTask = uploadBytesResumable(storageRef2, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress2(progress);
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrlOtchet(downloadURL);
            setFileName2(imageFile.name);
            setLoading2(false);
            setSuccess2(true);
          });
        }
      );
    } catch (e: any) {
      console.log(e.message);
      setLoading2(false);
    }
  };

  const sendOtchet = () => {
    mutate({ id: session?.user.id as string, fileURL: imageUrlOtchet });
  };

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
            <div className="flex flex-col items-center gap-2">
              {session ? (
                <>
                  <p className="text-2xl text-white">
                    Hello, {session.user.name}!
                  </p>
                </>
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
            {queryStatus === "success" && (
              <div className="text-2xl text-white">
                <div className="flex">
                  <p>Статус: </p>
                  {user.confirmed ? (
                    <span className="text-green-500"> Подтвержден</span>
                  ) : (
                    <span className="text-red-500"> Не подтвержден</span>
                  )}
                </div>
                <p>
                  После подтверждения, вам придёт сообщение с ссылкой в группу.
                </p>
                <p>
                  Дата начала практики:{" "}
                  {user?.startdate?.toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>

                {user.confirmed ? (
                  user.otchet == null ? (
                    <div className="my-4">
                      <div>
                        {!success2 && (
                          <div
                            className={` ${
                              loading2 ? "hidden" : ""
                            } flex w-full justify-center`}
                          >
                            <div className="flex flex-col items-center justify-center text-white">
                              <div {...getRootProps2()}>
                                <input hidden {...getInputProps2()} />

                                <>
                                  <p className="font-bold">
                                    Перетащите свой отчет сюда
                                  </p>
                                </>
                              </div>
                              <p>или</p>
                              <div className="flex w-full justify-center">
                                <Button
                                  variant={"outline"}
                                  type="button"
                                  onClick={open2}
                                >
                                  Выберите файл
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {loading2 && <UploadProgress progress={progress2} />}

                      {success2 && (
                        <div className="flex">
                          <p className="mr-4 font-bold text-white">
                            {fileName2}
                          </p>
                          <Button
                            className="font-bold text-white"
                            onClick={() => sendOtchet()}
                            variant="outline"
                          >
                            Отправить
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>Отчет был отправлен</p>
                  )
                ) : null}
              </div>
            )}
            {status === "authenticated"
              ? !(queryStatus === "success") && (
                  <button
                    className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                    onClick={() => router.push("/form")}
                  >
                    Заполнить форму
                  </button>
                )
              : null}
          </>
        </div>
      </main>
    </>
  );
};

export default Home;
