import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/CurrentProfile";

export default function Footer() {
    const { user, isAdmin, isParent, isStaff, isAuthenticated } = useAuth();

    return (
        <footer className="flex w-fit mx-auto h-fit justify-center gap-4 lg:w-[60%] lg:justify-around">
            <Link
                href={
                    isAuthenticated && isStaff
                        ? `/${user?.role}`
                        : isAuthenticated && isAdmin
                            ? `/${user?.role}`
                            : isAuthenticated && isParent ? `/${user?.role}` : "/"
                }
            >
                <Image
                    src="/home.webp"
                    alt="accueil"
                    width={100}
                    height={80}
                    title="accueil"
                />
            </Link>

            <Link
                href={` ${isAuthenticated && isStaff
                    ? `/${user?.role}/planning`
                    : isAuthenticated && isAdmin
                        ? `/${user?.role}/reportsHistory`
                        : isAuthenticated && isParent
                            ? `/${user?.role}/#`
                            : "#"
                    }`}
            >
                <Image
                    src={"/calendrier.webp"}
                    alt="plannings"
                    width={120}
                    height={100}
                    title={isAuthenticated && isStaff ? "plannings" : ""}
                />
            </Link>
            <Link
                href={` ${isAuthenticated && isStaff ? `/${user?.role}/conversations` : isAuthenticated && isParent ? `/${user?.role}/messages` : isAuthenticated && isAdmin ? `/${user?.role}/parents/conversations` : "#"} `}
            >
                <Image
                    src={"/chat.webp"}
                    alt="conversations"
                    width={120}
                    height={100}
                    title={isAuthenticated ? "conversations" : ""}
                />
            </Link>
        </footer>
    );
}
