import { signIn } from "next-auth/react";
import { LoginButton } from "@telegram-auth/react";

import { useRouter } from "next/router";

const Signin = () => {
  const router = useRouter();
  const botUsername = "Star_practik_bot";
  // const botUsername = "testaicbot";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <input name="csrfToken" type="hidden" />

        <LoginButton
          botUsername={botUsername}
          onAuthCallback={(data) => {
            void signIn("telegram-login", { callbackUrl: "/" }, data);
          }}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            router.push("/");
          }}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        >
          Go to home page
        </button>
      </div>
    </main>
  );
};

export default Signin;
