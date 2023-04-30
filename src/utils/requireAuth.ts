import type { GetServerSideProps, GetServerSidePropsContext } from "next";

// import { unstable_getServerSession } from 'next-auth'
import { getServerAuthSession } from "../server/common/get-server-auth-session";

export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
      return {
        redirect: {
          destination: "/", // login path
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };
