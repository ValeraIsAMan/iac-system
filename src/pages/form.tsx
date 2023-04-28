import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { DateRangePicker } from "rsuite";

import { useRouter } from "next/router";
import { Loading } from "@/components/Loading";
import { useForm } from "react-hook-form";
import { Form, FormSchema } from "@/server/schema/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "@/components/Spinner";

const Form: NextPage = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(FormSchema),
  });

  //   const { mutate, error, isLoading } = trpc.order.createItem.useMutation({
  //     onMutate: () => {
  //       toast.loading("Creating order...", {
  //         id: "additem",
  //         style: {
  //           borderRadius: "10px",
  //           background: "#1E1E2A", //#1E1E2A
  //           color: "#fff",
  //         },
  //       });
  //     },
  //     onError: (error) => {
  //       toast.error(error.message, {
  //         id: "additem",
  //         icon: "🥲",
  //         style: {
  //           borderRadius: "10px",
  //           background: "#F43F5E",
  //           color: "#fff",
  //         },
  //       });
  //     },
  //     onSuccess: (data) => {
  //       toast.success(`Item: ${data.result.name} added!`, {
  //         id: "additem",
  //         icon: "👏",
  //         style: {
  //           borderRadius: "10px",
  //           background: "#22C55E",
  //           color: "#fff",
  //         },
  //       });
  //       router.push("/dashboard");
  //     },
  //   });

  const onSubmit = (data: Form) => {
    console.log("hello");
    // mutate(data);
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
          {loading ? (
            <Loading isLoading={loading} />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <p className="text-2xl text-white">
                  Hello, {session?.user.name}!
                </p>
                <button
                  className="rounded-full bg-white/10 px-8 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                  onClick={session ? () => void signOut() : () => void signIn()}
                >
                  {session ? "Sign out" : "Sign in"}
                </button>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="p-4 text-xl text-white">
                  Заполните форму для прохождении практики!
                </h1>
                <form
                  className="w-96 flex-col items-center rounded-md  bg-white/5 p-6 shadow-2xl"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {/* <h2 className="text-rose-500">{error && error.message}</h2> */}
                  <label
                    htmlFor="FIO"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    ФИО
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Иван Иванович"
                    className=" mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    {...register("FIO", { required: true })}
                  />
                  {errors.FIO && (
                    <span className="text-red-500">This field is required</span>
                  )}

                  <label
                    htmlFor="phonenumber"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Номер телефона
                  </label>
                  <input
                    id="phonenumber"
                    type="number"
                    placeholder="e.g. 88912739871"
                    className="mb-2 block w-full  rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    {...register("phonenumber", {
                      valueAsNumber: true,
                      required: true,

                      validate: (value) => value > 0,
                    })}
                  />
                  {errors.phonenumber && (
                    <span className="text-red-500">This field is required</span>
                  )}

                  {/* <label
              htmlFor="napravlenie"
              className="mb-2 block text-sm font-medium text-white"
            >
              Направление
            </label>
            <input
              id="napravlenie"
              type="text"
              placeholder="Направление"
              className=" mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              {...register("napravlenie", { required: true })}
            />
            {errors.napravlenie && <span>This field is required</span>}

            <label
              htmlFor="otchet"
              className="mb-2 block text-sm font-medium text-white"
            >
              Отчет
            </label>
            <input
              id="otchet"
              type="text"
              placeholder="Отчет"
              className=" mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              {...register("otchet", { required: true })}
            />
            {errors.otchet && <span>This field is required</span>} */}

                  <label
                    htmlFor="curator"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Куратор
                  </label>
                  <input
                    id="curator"
                    type="text"
                    placeholder="curator"
                    className=" mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    {...register("curator", { required: true })}
                  />
                  {errors.curator && (
                    <span className="text-red-500">This field is required</span>
                  )}

                  <label
                    htmlFor="eduName"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Наименование учебного учреждения
                  </label>
                  <input
                    id="eduName"
                    type="text"
                    placeholder="ceduName"
                    className=" mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    {...register("eduName", { required: true })}
                  />
                  {errors.eduName && (
                    <span className="text-red-500">This field is required</span>
                  )}

                  <label
                    htmlFor="specialty"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Специальность
                  </label>
                  <input
                    id="specialty"
                    type="text"
                    placeholder="specialty"
                    className=" mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    {...register("specialty", { required: true })}
                  />
                  {errors.specialty && (
                    <span className="text-red-500">This field is required</span>
                  )}

                  <label
                    htmlFor="year"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Курс
                  </label>
                  <input
                    id="year"
                    type="number"
                    placeholder="year"
                    className=" mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    {...register("year", { required: true })}
                  />
                  {errors.year && (
                    <span className="text-red-500">This field is required</span>
                  )}

                  <label
                    htmlFor="apprenticeshipType"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Вид практики...
                  </label>
                  <select
                    {...register("apprenticeshipType", { required: true })}
                    id="apprenticeshipType"
                    className="mb-2 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  >
                    <option value="Преддипломная">Преддипломная</option>
                    <option value="Еще какаято">Еще какаято</option>
                    <option value="Еще какаято2">Еще какаято2</option>
                  </select>
                  {errors.apprenticeshipType && (
                    <span className="text-red-500">This field is required</span>
                  )}

                  <label
                    htmlFor="work"
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Трудоустройство
                  </label>
                  <input
                    id="work"
                    type="checkbox"
                    placeholder="work"
                    className=" mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    {...register("work", { required: true })}
                  />
                  {errors.work && (
                    <span className="text-red-500">This field is required</span>
                  )}

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                    >
                      {loading ? <Spinner /> : "Отправить"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Form;
