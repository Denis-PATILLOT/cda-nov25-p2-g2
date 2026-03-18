import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/CurrentProfile";

export default function Footer() {
  const { user, isAdmin, isParent, isStaff, isAuthenticated } = useAuth();

  const firstChild = Array.isArray(user?.children) ? user.children[0] : null;

  return (
    <footer className="flex w-fit mx-auto h-fit justify-center gap-4">
      {isAuthenticated && isStaff && (
        <Link href={`/${user?.role}`}>
          <Image src="/home.png" alt="Accueil staff" width={120} height={100} />
        </Link>
      )}

      {isAuthenticated && isParent && (
        <Link href={`/${user?.role}`}>
          <Image src="/home.png" alt="Accueil parent" width={120} height={100} />
        </Link>
      )}

      {isAuthenticated && isStaff && (
        <Link href={`/${user?.role}/planning`}>
          <Image src="/calendrier.png" alt="Planning" width={120} height={100} />
        </Link>
      )}

      {isAuthenticated && isParent && firstChild && (
        <Link href={`/${user?.role}/report/${firstChild.id}`}>
          <Image src="/calendrier.png" alt="Report" width={120} height={100} />
        </Link>
      )}

      {isAuthenticated && (
        <Link href={`/${user?.role}/chat`}>
          <Image src="/chat.png" alt="Chat" width={120} height={100} />
        </Link>
      )}
    </footer>
  );
}
