import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/CurrentProfile";

export default function Footer() {
  const { user, isAdmin, isParent, isStaff, isAuthenticated } = useAuth();
  const router = useRouter();

  const homePath = isAuthenticated && isStaff ? `/${user?.role}` : "/";
  const planningPath = isAuthenticated && isStaff ? `/${user?.role}/planning` : "#";
  const chatPath =
    isAuthenticated && isStaff
      ? `/${user?.role}/conversation`
      : isAuthenticated && isParent
        ? `/${user?.role}/messages`
        : isAuthenticated && isAdmin
          ? `/${user?.role}/parents/conversations`
          : "#";

  const isActive = (path: string) => router.asPath.startsWith(path);

  const getClass = (path: string) =>
    `
    transition-all duration-300
    ${isActive(path) ? "scale-125" : "scale-100"}
    hover:scale-110
  `;

  return (
    <footer className="flex w-fit mx-auto h-fit justify-center gap-4">
      <Link href={homePath}>
        <Image src="/home.png" alt="" width={100} height={80} className={getClass(homePath)} />
      </Link>

      <Link href={planningPath}>
        <Image
          src="/calendrier.png"
          alt=""
          width={100}
          height={80}
          className={getClass(planningPath)}
        />
      </Link>

      <Link href={chatPath}>
        <Image src="/chat.png" alt="" width={100} height={80} className={getClass(chatPath)} />
      </Link>
    </footer>
  );
}
