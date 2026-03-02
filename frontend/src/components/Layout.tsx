import { Poppins } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/CurrentProfile";
import Footer from "./Footer";
import Header from "./Header";

const poppins = Poppins({
  display: "auto",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface LayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export default function Layout({ children, pageTitle }: LayoutProps) {
  const router = useRouter();

  const { user, refetch } = useAuth(); 

  return (
    <>
      <Head>
        <title>{`BabyBoard - ${pageTitle}`}</title>
        <meta name="description" content="ads website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`body ${router.pathname === "/" ? "home md:home-large" : router.pathname.startsWith("/admin") ? "home md:home-large" : router.pathname.startsWith("/parent") ? "home md:home-page" : router.pathname.startsWith("/staff") ?  `group${user?.group?.id} md:staff-large` : router.pathname.startsWith("/profil") ? "home md:home-large": ""} `} >
        {user && <Header user={user} refetch={refetch} />}
        <main className={` ${poppins.className} `}>{children}</main>
        {user && <Footer />}
      </div>
    </>
  );
}
