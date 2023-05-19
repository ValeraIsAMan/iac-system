import { type NextPage } from "next";
import Head from "next/head";

import { useSession } from "next-auth/react";

import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { Form, FormSchema } from "@/server/schema/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/utils/api";
import toast from "react-hot-toast";
import { requireAuth } from "@/utils/requireAuth";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

initFirebase();

const storage = getStorage();

type Image = {
  imageFile: Blob;
};

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const Form: NextPage = () => {
  const [progress, setProgress] = useState<number>(0);

  const [imageUrlNapravlenie, setImageUrlNapravlenie] = useState<string>("");

  const [fileName1, setFileName1] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: session, status } = useSession();
  const loadingSession = status === "loading";
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startdate: new Date(),
    },
  });

  const { mutate } = api.form.createForm.useMutation({
    onMutate: () => {
      toast.loading("Sending form...", {
        id: "form",
        style: {
          borderRadius: "10px",
          background: "#1E1E2A", //#1E1E2A
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "form",
        icon: "🥲",
        style: {
          borderRadius: "10px",
          background: "#F43F5E",
          color: "#fff",
        },
      });
    },
    onSuccess: (data) => {
      toast.success(`Form was subbmited!`, {
        id: "form",
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#22C55E",
          color: "#fff",
        },
      });
      router.push("/");
    },
  });

  const { data: eduNames } = api.form.getEduNames.useQuery();
  const { data: aprentNames } = api.form.getApreticeshipNames.useQuery();

  const onSubmit = (data: Form) => {
    data.napravlenie = imageUrlNapravlenie;
    // data.otchet = imageUrlOtchet;

    console.log(JSON.stringify(data, null, 4));
    mutate(data);
  };

  const onDrop = useCallback((acceptedFiles: any[]) => {
    // Upload files to storage
    const file = acceptedFiles[0];
    uploadImage({ imageFile: file });
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    useFsAccessApi: false,
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = async ({ imageFile }: Image) => {
    try {
      setLoading(true);
      const storageRef = ref(
        storage,
        "Направление_" + new Date().toISOString() + "_" + imageFile.name
      );
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrlNapravlenie(downloadURL);
            setFileName1(imageFile.name);
            setLoading(false);
            setSuccess(true);
          });
        }
      );
    } catch (e: any) {
      console.log(e.message);
      setLoading(false);
    }
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
                <Input
                  id="name"
                  type="text"
                  placeholder="Иван Иванович"
                  className=" mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  {...register("FIO", { required: true, minLength: 1 })}
                />
                {errors.FIO && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}

                <label
                  htmlFor="phonenumber"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Номер телефона
                </label>
                <Input
                  id="phonenumber"
                  type="number"
                  placeholder="e.g. 89052252431"
                  className="mb-2 block w-full  rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  {...register("phonenumber", {
                    required: true,
                    minLength: 9,
                    maxLength: 11,
                  })}
                />
                {errors.phonenumber && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}

                <label
                  htmlFor="datestart"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Начало практики
                </label>
                <Controller
                  control={control}
                  name="startdate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start bg-white text-left font-normal"
                            // !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date: any) => field.onChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />

                {errors.startdate && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}

                <label
                  htmlFor="dateend"
                  className="my-2 block text-sm font-medium text-white"
                >
                  Конец практики
                </label>
                <Controller
                  control={control}
                  name="enddate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start bg-white text-left font-normal"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Выберите дату</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date: any) => field.onChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />

                {errors.enddate && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}

                <label
                  htmlFor="napravlenie"
                  className="my-2 block text-sm font-medium text-white"
                >
                  Направление
                </label>

                <div className="my-4">
                  <div>
                    {!success && (
                      <div
                        className={` ${
                          loading ? "hidden" : ""
                        } flex w-full justify-center`}
                      >
                        <div className="flex flex-col items-center justify-center text-white">
                          <div {...getRootProps()}>
                            <input hidden {...getInputProps()} />
                            {/*                             
                            <>
                              <p className="font-bold">
                                Перетащите свое направление сюда
                              </p>
                              <p>Файл должен быть только PDF</p>
                            </> */}
                          </div>
                          {/* <p>или</p> */}
                          <div className="flex w-full justify-center">
                            <Button
                              variant={"outline"}
                              type="button"
                              onClick={open}
                            >
                              Выберите файл
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {loading && <UploadProgress progress={progress} />}

                  {success && (
                    <p className="font-bold text-white">{fileName1}</p>
                  )}
                </div>
                {errors.napravlenie && <span>Это поле обязательное!</span>}
                <input
                  type="text"
                  hidden
                  value={imageUrlNapravlenie}
                  className=" -z-100 h-1 bg-transparent text-transparent"
                  {...register("napravlenie")}
                />

                <label
                  htmlFor="eduName"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Наименование учебного учреждения
                </label>

                <Controller
                  control={control}
                  name="eduName"
                  render={({ field }) => (
                    <Select onValueChange={(data: any) => field.onChange(data)}>
                      <SelectTrigger className="bg-white" value={field.value}>
                        <SelectValue placeholder="Выбрать..." />
                      </SelectTrigger>
                      <SelectContent>
                        {eduNames?.map((item) => (
                          <SelectItem key={item.id} value={item.name as string}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.eduName && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}

                <label
                  htmlFor="specialty"
                  className="my-2 block text-sm font-medium text-white"
                >
                  Специальность
                </label>
                <Input
                  id="specialty"
                  type="text"
                  placeholder="09.02.07 Информационные системы и программирование"
                  className=" mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  {...register("specialty", { required: true })}
                />
                {errors.specialty && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}

                <label
                  htmlFor="year"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Курс
                </label>
                <Input
                  id="year"
                  type="number"
                  placeholder="Номер курса"
                  className=" mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  {...register("year", { required: true, min: 1, max: 6 })}
                />
                {errors.year && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}

                <label
                  htmlFor="apprenticeshipType"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Вид практики...
                </label>

                <Controller
                  control={control}
                  name="apprenticeshipType"
                  render={({ field }) => (
                    <Select onValueChange={(data: any) => field.onChange(data)}>
                      <SelectTrigger className=" bg-white" value={field.value}>
                        <SelectValue placeholder="Выбрать..." />
                      </SelectTrigger>
                      <SelectContent>
                        {aprentNames?.map((item) => (
                          <SelectItem key={item.id} value={item.name as string}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.apprenticeshipType && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}

                <div className=" flex justify-center">
                  <button
                    type="submit"
                    disabled={loadingSession}
                    className="mt-6 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                  >
                    {loadingSession ? "loading" : "Отправить"}
                  </button>
                </div>
              </form>
            </div>
          </>
        </div>
      </main>
    </>
  );
};

export default Form;
