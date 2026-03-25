import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/CurrentProfile";

export default function Footer() {
  const { user, isAdmin, isParent, isStaff, isAuthenticated } = useAuth();

  const firstChild = Array.isArray(user?.children) ? user.children[0] : null;

  return (
    <footer className=" flex w-fit mx-auto h-fit justify-center">
      <Link href={` ${isAuthenticated && isStaff ? `/${user?.role}` : "/"}`}>
        <Image
          src={"/home.png"}
          alt=""
          width={120}
          height={100}
          title={isAuthenticated ? "dashboard" : ""}
        />
      </Link>
      <Link href={` ${isAuthenticated && isStaff ? `/${user?.role}/planning` : 
      isAuthenticated && isAdmin ? `/${user?.role}/reportsHistory` :
        "#"}`}>
        <Image
          src={"/calendrier.png"}
          alt=""
          width={120}
          height={100}
          title={isAuthenticated && isStaff ? "plannings" : ""}
        />
      </Link>
      <Link
        href={` ${isAuthenticated && isStaff ? `/${user?.role}/conversations` : isAuthenticated && isParent ? `/${user?.role}/messages` : isAuthenticated && isAdmin ? `/${user?.role}/parents/conversations` : "#"} `}
      >
        <Image
          src={"/chat.png"}
          alt=""
          width={120}
          height={100}
          title={isAuthenticated && isStaff ? "conversations" : ""}
        />
      </Link>
    </footer>
  );
}
