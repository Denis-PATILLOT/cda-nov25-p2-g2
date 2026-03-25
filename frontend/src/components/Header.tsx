import type { ApolloClient } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { type Exact, type ProfileQuery, useLogoutMutation } from "@/graphql/generated/schema";
import getUserInitial from "@/utils/getUserInitial";

type HeaderProps = {
  user: {
    __typename?: "User" | undefined;
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string | null | undefined;
    creation_date: any;
    email: string;
    phone: string;
    role: string;
    children?:
      | {
          __typename?: "Child" | undefined;
          id: number;
        }[]
      | null
      | undefined;
    group?:
      | {
          __typename?: "Group" | undefined;
          id: string;
        }
      | null
      | undefined;
  } | null;
  refetch: (
    variables?: Partial<Exact<{ [key: string]: never }>> | undefined,
  ) => Promise<ApolloClient.QueryResult<ProfileQuery> | null>;
};

export default function Header({ user, refetch }: HeaderProps) {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const isParent = user.role === "parent";
  const isStaff = user.role === "staff";

  const handleLogout = async () => {
    try {
      await logout();
      await refetch();
      setIsMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <header>
      <nav className="flex w-full items-center justify-between bg-transparent px-4 py-3 md:px-6">
        <Link href={`/${user.role || "/"}`} className="w-[48%] max-w-[220px] md:max-w-[300px]">
          <img src="/logo-inline.png" alt="logo BabyBoard" />
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white/90 bg-pink-50 shadow-[0_8px_20px_rgba(20,40,90,0.15)] transition duration-200 hover:scale-105 hover:border-yellow-200 md:h-20 md:w-20"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-label="Ouvrir le menu profil"
          >
            {user.avatar ? (
              // biome-ignore lint/performance/noImgElement: image utilisateur
              <img
                src={user.avatar}
                alt={`Profil de ${user.first_name}`}
                title="Ouvrir le menu profil"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-base font-bold text-blue-900 md:text-xl">
                {getUserInitial(user.last_name)}
              </span>
            )}
          </button>

          <div
            className={`absolute right-0 z-50 mt-3 w-64 origin-top-right overflow-hidden rounded-[26px] border-2 border-sky-200 bg-white/95 shadow-[0_18px_40px_rgba(20,40,90,0.18)] backdrop-blur transition-all duration-200 ${
              isMenuOpen
                ? "visible translate-y-0 scale-100 opacity-100"
                : "invisible -translate-y-2 scale-95 opacity-0"
            }`}
          >
            <div className="bg-gradient-to-r from-pink-50 via-white to-sky-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-pink-100 shadow">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`Profil de ${user.first_name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-blue-900">
                      {getUserInitial(user.last_name)}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-blue-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="truncate text-xs text-blue-900/70">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              {(isParent || isStaff) && (
                <Link
                  href={`/${user.role}/profile`}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-blue-900 transition hover:bg-sky-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">👤</span>
                  <span className="font-medium">Voir mon profil</span>
                </Link>
              )}
              {isParent && (
                <Link
                  href={`/${user.role}/password`}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-blue-900 transition hover:bg-pink-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">🔒</span>
                  <span className="font-medium">Changer de mot de passe</span>
                </Link>
              )}
              {isParent && (
                <Link
                  href="/parent/contact"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-blue-900 transition hover:bg-green-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">📩</span>
                  <span className="font-medium">Contact</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-red-500 transition hover:bg-red-50"
              >
                <span className="text-lg">🚪</span>
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
