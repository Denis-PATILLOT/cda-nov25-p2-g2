import type { ApolloClient } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { type Exact, type ProfileQuery, useLogoutMutation } from "@/graphql/generated/schema";

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
  // typage des props obligatoire sinon erreur

  const [logout] = useLogoutMutation();
  const router = useRouter();

  if (!user) return ""; // pas de contenu renvoyé si pas de user

  const handleLogout = async () => {
    try {
      await logout();
      await refetch();
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // fn pour afficher mette la première lettre du nom de famille si pas d'avatar
  const getUserInitial = (lastName: string) => {
    return lastName.charAt(0).toUpperCase();
  };

  return (
    <header>
      <nav className="flex p-3 w-full flex-row justify-between items-center bg-transparent">
        <Link href="/" className="w-[50%] md:w-[300px]">
          <img src="/logo-inline.png" /> {/* logo pour le header sans espace haut et bas */}
        </Link>

        <div className="flex gap-2 items-center">
          {user && (
            <>
              <div className="flex items-center gap-2 mr-2">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden md:w-24 md:h-24">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      title={`${user.first_name} ${user.last_name}`}
                      className="cursor-pointer"
                      onClick={handleLogout}
                    />
                  ) : (
                    getUserInitial(user.last_name)
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
