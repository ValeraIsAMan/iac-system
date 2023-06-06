import Image from "next/image";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";

export const Nav = ({
  refetch,
  dataUpdatedAt,
}: {
  refetch: () => void;
  dataUpdatedAt: number;
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const components: { title: string; href: string; description: string }[] = [
    {
      title: "Студенты",
      href: "/system/students",
      description: "",
    },
    {
      title: "Кураторы",
      href: "/system/curators",
      description: "",
    },
    {
      title: "Учреждения",
      href: "/system/educationfacility",
      description: "",
    },
    {
      title: "Тип практики",
      href: "/system/aprenticeship",
      description: "",
    },
    {
      title: "Администрация",
      href: "/system/",
      description: "",
    },
    {
      title: "Главная",
      href: "/",
      description: "",
    },
    {
      title: "Эксперементальная таблица студентов",
      href: "/system/x-students",
      description: "",
    },
  ];

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <Link href={props.href!} legacyBehavior passHref>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a
              ref={ref}
              className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                className
              )}
              {...props}
            >
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </a>
          </NavigationMenuLink>
        </Link>
      </li>
    );
  });

  return (
    <div className="flex items-center justify-between gap-2 p-4">
      <div className="flex gap-2">
        <div className=" z-50 flex items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Таблицы</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4 md:w-[300px] md:grid-cols-2 lg:w-[350px] ">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
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
