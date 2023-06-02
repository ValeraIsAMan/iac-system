import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { User } from "@prisma/client";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Cross2Icon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "./table-data/schema";
import { UserForm } from "./table-data/schema";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "FIO",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ФИО" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("FIO")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telegram" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex space-x-2">
          <Link
            href={"http://t.me/" + name}
            target="_blank"
            className="max-w-[500px] truncate font-medium underline"
          >
            {name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "phonenumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Номер телефона" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("phonenumber")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "startdate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Начало" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {(row.getValue("startdate") as Date).toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "enddate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Конец" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {(row.getValue("enddate") as Date).toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "napravlenie",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Направление" />
    ),
    cell: ({ row }) => {
      const link = row.getValue("napravlenie");
      return (
        <div className="flex space-x-2">
          <Link
            href={link || ""}
            target="_blank"
            className="max-w-[500px] truncate font-medium underline"
          >
            {link ? "Открыть" : "Нету"}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "otchet",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Отчет" />
    ),
    cell: ({ row }) => {
      const link = row.getValue("otchet");
      return (
        <div className="flex space-x-2">
          <Link
            href={link || ""}
            target="_blank"
            className="max-w-[500px] truncate font-medium underline"
          >
            {link ? "Открыть" : "Нету"}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "curator",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Куратор" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("curator")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "eduName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Учереждение" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("eduName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "specialty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Специальность" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("specialty")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Курс" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("year")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "apprenticeshipType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Тип практики" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("apprenticeshipType")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "work",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Трудоустройство" />
    ),
    cell: ({ row }) => {
      const label = row.getValue("work") ? " Да" : "Нет";

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label}</Badge>}
        </div>
      );
    },
  },

  {
    accessorKey: "confirmed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Подтвержден" />
    ),
    cell: ({ row }) => {
      const label = row.getValue("confirmed") ? " Да" : "Нет";

      return (
        <div className="flex space-x-2">
          {label && (
            <Badge variant={label == "Нет" ? "destructive" : "secondary"}>
              {label}
            </Badge>
          )}
        </div>
      );
    },
  },
  //
  {
    accessorKey: "signedOtchet",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Подписан отчет" />
    ),
    cell: ({ row }) => {
      const label = row.getValue("signedOtchet") ? " Да" : "Нет";

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label}</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: "signedNapravlenie",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Подписано направление" />
    ),
    cell: ({ row }) => {
      const label = row.getValue("signedNapravlenie") ? " Да" : "Нет";

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label}</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: "signed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Редактировать" />
    ),
    cell: ({ row }) => {
      const { data: curators } = api.user.getAllCurators.useQuery();
      const { data: eduNames } = api.form.getEduNames.useQuery();
      const { data: aprentNames } = api.form.getApreticeshipNames.useQuery();

      const trpcClient = api.useContext();

      const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<UserForm>({
        resolver: zodResolver(userSchema),
        defaultValues: {
          FIO: row.original.FIO!,
          phonenumber: row.original.phonenumber!,
          curator: row.original.curator!,
          eduName: row.original.eduName!,
          specialty: row.original.specialty!,
          year: row.original.year!,
          apprenticeshipType: row.original.apprenticeshipType!,

          confirmed: row.original.confirmed!,
          signedNapravlenie: row.original.signedNapravlenie!,
          signedOtchet: row.original.signedOtchet!,
        },
      });

      const { mutate } = api.admin.editUser.useMutation({
        onMutate: () => {
          toast.loading("Редактируется...", {
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
            duration: 10000,
          });
        },
        onSuccess: (data) => {
          toast.success(`Сохранено!`, {
            id: "form",
            icon: "👏",
            style: {
              borderRadius: "10px",
              background: "#22C55E",
              color: "#fff",
            },
          });
          trpcClient.user.getAllUsers.refetch();
        },
      });

      const onSubmit = (data: UserForm) => {
        data.telegramId = row.original.telegramID as string;
        console.log(JSON.stringify(data, null, 4));
        mutate(data);
      };

      return (
        <div className="flex space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Редактировать</Button>
            </SheetTrigger>
            <SheetContent position="right" size="default">
              <SheetHeader>
                <SheetTitle>Редактировать студента</SheetTitle>
                <SheetDescription>
                  Делайте все изменения данных студента здесь, после нужно
                  нажать на кнопку сохранить.
                </SheetDescription>
              </SheetHeader>
              <form
                className="grid gap-4 py-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    ФИО
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    {...register("FIO")}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Telegram
                  </Label>
                  <Input
                    id="username"
                    className="col-span-3"
                    disabled
                    value={row.original.name!}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Номер телефона
                  </Label>
                  <Input
                    id="phone"
                    className="col-span-3"
                    {...register("phonenumber")}
                  />
                </div>
                {errors.FIO && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start" className="text-right">
                    Начало
                  </Label>
                  <Input
                    id="start"
                    value={row.original.startdate?.toLocaleDateString()}
                    className="col-span-3"
                    disabled
                  />
                </div>
                {errors.phonenumber && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="end" className="text-right">
                    Конец
                  </Label>
                  <Input
                    id="end"
                    value={row.original.enddate?.toLocaleDateString()}
                    className="col-span-3"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="curator" className="text-right">
                    Куратор
                  </Label>
                  <div className="col-span-3">
                    <Controller
                      control={control}
                      name="curator"
                      render={({ field }) => (
                        <Select
                          defaultValue={row.original.curator || "Выберете..."}
                          onValueChange={(data: any) => field.onChange(data)}
                        >
                          <SelectTrigger
                            className=" bg-white"
                            value={field.value}
                          >
                            <SelectValue placeholder="Выбрать..." />
                          </SelectTrigger>
                          <SelectContent>
                            {curators?.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.FIO as string}
                              >
                                {item.FIO}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                {errors.curator && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edu" className="text-right">
                    Учебное учереждение
                  </Label>
                  <div className="col-span-3">
                    <Controller
                      control={control}
                      name="eduName"
                      render={({ field }) => (
                        <Select
                          defaultValue={row.original.eduName || "Выберете..."}
                          onValueChange={(data: any) => field.onChange(data)}
                        >
                          <SelectTrigger
                            className="bg-white"
                            value={field.value}
                            placeholder="Выберете..."
                          >
                            <SelectValue
                              placeholder={
                                <span className="text-primary-500">
                                  Выберете...
                                </span>
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {eduNames?.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.name as string}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                {errors.eduName && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="spec" className="text-right">
                    Специальность
                  </Label>
                  <Input
                    id="spec"
                    className="col-span-3"
                    {...register("specialty")}
                  />
                </div>
                {errors.specialty && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="year" className="text-right">
                    Курс
                  </Label>
                  <Input
                    id="year"
                    className="col-span-3"
                    {...register("year")}
                  />
                </div>
                {errors.year && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Вид практики
                  </Label>
                  <div className="col-span-3">
                    <Controller
                      control={control}
                      name="apprenticeshipType"
                      render={({ field }) => (
                        <Select
                          onValueChange={(data: any) => field.onChange(data)}
                          defaultValue={
                            row.original.apprenticeshipType || "Выберете..."
                          }
                        >
                          <SelectTrigger
                            className=" bg-white"
                            value={field.value}
                          >
                            <SelectValue placeholder="Выбрать..." />
                          </SelectTrigger>
                          <SelectContent>
                            {aprentNames?.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.name as string}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                {errors.apprenticeshipType && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="confirmed"
                    className=" text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Подтвержден
                  </Label>
                  <Controller
                    control={control}
                    name="confirmed"
                    render={({ field }) => (
                      <Checkbox
                        id="confirmed"
                        className="col-span-3"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                {errors.confirmed && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="podpisNapr"
                    className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Направление подписано
                  </Label>
                  <Controller
                    control={control}
                    name="signedNapravlenie"
                    render={({ field }) => (
                      <Checkbox
                        id="podpisNapr"
                        className="col-span-3"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                {errors.signedNapravlenie && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="otchet"
                    className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Отчет подписан
                  </Label>
                  <Controller
                    control={control}
                    name="signedOtchet"
                    render={({ field }) => (
                      <Checkbox
                        id="otchet"
                        className="col-span-3"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
                {errors.signedOtchet && (
                  <span className="text-red-500">Это поле обязательное!</span>
                )}
              </form>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" onClick={() => onSubmit(watch())}>
                    Сохранить изменения
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      );
    },
  },
];
