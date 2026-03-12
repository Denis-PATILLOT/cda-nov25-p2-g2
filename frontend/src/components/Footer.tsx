import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/CurrentProfile";

export default function Footer() {

  const {user, isAdmin, isParent, isStaff, isAuthenticated} = useAuth();

  return (
    <footer className=" flex w-fit mx-auto h-fit justify-center">
      <Link href={` ${isAuthenticated && isStaff ? `/${user?.role}` : "/"}`}>
        <Image src={"/home.png"} alt="" width={120} height={100} />
      </Link>
      <Link href={` ${isAuthenticated && isStaff ? `/${user?.role}/planning` : "#"}`}>
        <Image src={"/calendrier.png"} alt="" width={120} height={100} />
      </Link>
      <Image src={"/chat.png"} alt="" width={120} height={100} />
    </footer>
  );
}
