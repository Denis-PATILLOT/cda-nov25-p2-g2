import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { useAllParentsWithAdminConverationsQuery, useCreateConversationMutation } from "@/graphql/generated/schema";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { getGroupBg } from "@/utils/getGroupBg";
import Link from "next/link";

type Parent= {
    __typename?: "User" | undefined;
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string | null | undefined;
    children?: {
        __typename?: "Child" | undefined;
        id: number;
        firstName: string;
        lastName: string;
        picture: string;
        birthDate: any;
        group: {
            __typename?: "Group" | undefined;
            id: string;
            name: string;
        };
    }[] | null | undefined;
    startedConversations?: {
        __typename?: "Conversation" | undefined;
        id: number;
        participant: {
            __typename?: "User" | undefined;
            id: number;
        };
    }[] | null | undefined;
    participatedConversations?: {
        __typename?: "Conversation" | undefined;
        id: number;
        initiator: {
            __typename?: "User" | undefined;
            id: number;
        };
    }[] | null | undefined
};


export default function AdminParentsPage() {
  const router = useRouter();
  const { user, authLoading, isAdmin, shouldSkip } = useAdminGuard();

  const { data, loading, error, refetch } = useAllParentsWithAdminConverationsQuery({
    fetchPolicy: "network-only",
    skip: shouldSkip,
  });

  // mutation pour conversation à créer
  const [createConversation] = useCreateConversationMutation();

  // données de tous les parents récupérés
  const parents = data?.allParentsWithAdminConverations ?? [];

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("ALL");
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);

  const[errorConversation, setErrorConversation] = useState("");
  
  const groups = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of parents) {
      for (const c of p.children ?? []) {
        if (c.group?.id && c.group?.name) {
          map.set(String(c.group.id), c.group.name);
        }
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name })).sort((a,b) => Number(a.id) - Number(b.id));
  }, [parents]);

  const filteredParents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return parents.filter((p) => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      const matchSearch = !q || fullName.includes(q);
      const matchGroup =
        groupFilter === "ALL" ||
        (p.children ?? []).some((c) => String(c.group?.id) === groupFilter);
      return matchSearch && matchGroup;
    });
  }, [parents, search, groupFilter]);

  
  if (authLoading) return null;
  if (!user || !isAdmin) return null;

  // gestion d'une création de conversation
  const createNewConversation = async (parent : Parent ) => {
    
    try {
        console.log("nouvelle conversation à créer");
        const {data} = await createConversation({ variables: {
            initiatorId: user.id,
            participantId: parent.id
        }});

        if(data?.createConversation.id) router.push(`/admin/parents/conversations/${data.createConversation.id}`)
    } catch(err:any) {
        setErrorConversation(err.message)
    }
  }

  return (
    <Layout pageTitle="Conversations - Admin">

      <div className="mx-auto w-full max-w-[420px] px-4 pt-2 pb-6 md:max-w-none md:px-16 md:pt-0 lg:px-24">
        <div className="relative flex items-center justify-between md:mt-20">
       
          <button type="button" onClick={() => router.push("/admin")} className="p-0">
            <div className="h-10 w-10 overflow-hidden cursor-pointer flex items-center justify-center md:h-20 md:w-20">
              <img
                src="/admin/flechegauche.png"
                alt="Retour"
                className="h-16 w-16 md:h-28 md:w-28"
              />
            </div>
          </button>
          
          <h1 className="text-[16px] font-semibold md:absolute md:left-1/2 md:-translate-x-1/2 md:text-[28px]">
            Conversations - Parents
          </h1>
          
        </div>

        <div className="mt-2 flex items-center h-9 rounded-lg bg-white/80 border-2 border-(--color-primary) px-3 shadow-sm md:mt-6 md:h-14 md:rounded-2xl md:px-5">
        
          <div className="h-8 w-8 overflow-hidden flex items-center justify-center shrink-0 mr-2">
            <img src="/admin/loupe.png" alt="Recherche" className="h-14 w-14 opacity-60" />
          </div>
          
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Recherche un parent..."
            className="w-full bg-transparent text-[13px] outline-none md:text-[18px]"
          />
        </div>

        <div className="mt-2 relative w-fit md:mt-4">
          <button
            type="button"
            onClick={() => setGroupDropdownOpen((prev) => !prev)}
            className="flex items-center w-full h-9 cursor-pointer rounded-xl border-2 border-(--color-primary) bg-white/80 px-2 shadow-sm text-[12px] text-left outline-none gap-1 md:h-12 md:text-[16px] md:px-4 md:rounded-2xl"
          >
            <div className="h-8 w-8 overflow-hidden  flex items-center justify-center shrink-0">
              <img src="/admin/groupe.png" alt="Groupe" className="h-14 w-14 opacity-70" />
            </div>
            <span className="text-gray-500">
              {groupFilter === "ALL"
                ? "Tous les groupes"
                : (groups.find((g) => g.id === groupFilter)?.name ?? "Tous les groupes")}
            </span>
            <span
              className={`ml-1 text-gray-400 transition-transform duration-200 ${groupDropdownOpen ? "rotate-180" : ""}`}
            >
              ▾
            </span>
          </button>

          {groupDropdownOpen && (
            <div className="absolute left-0 top-10 z-10 rounded-xl border-2 border-(--color-primary) bg-white overflow-hidden shadow-lg w-full md:top-14 md:rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setGroupFilter("ALL");
                  setGroupDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-[12px] cursor-pointer border-b border-gray-50 hover:bg-orange-50 md:text-[16px] md:px-5 md:py-3 ${groupFilter === "ALL" ? "font-semibold" : ""}`}
              >
                Tous les groupes
              </button>
              {groups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setGroupFilter(g.id);
                    setGroupDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[12px] cursor-pointer border-b border-gray-50 last:border-0 hover:bg-orange-50 md:text-[16px] md:px-5 md:py-3 ${groupFilter === g.id ? "font-semibold" : ""}`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <p className="mt-6 text-center text-[13px] opacity-70 md:text-[18px]">Chargement...</p>
        )}
        {error && (
          <p className="mt-6 text-center text-[13px] text-red-600 md:text-[18px]">
            Erreur lors du chargement.
          </p>
        )}
        { errorConversation && <p className="mt-6 text-center text-[13px] text-red-600 md:text-[18px] border-red-100 alert bg-red-200">{errorConversation}</p>}

        {!loading && !error && (
          <div className="mt-4 flex flex-col gap-3 md:gap-6 md:mt-8">
            {filteredParents.length === 0 && (
              <div className="rounded-2xl bg-white/80 border-2 border-(--color-secondary) p-4 text-[13px] text-center opacity-70 md:text-[18px]">
                Aucun parent trouvé.
              </div>
            )}

            {filteredParents.map((parent) => {
              const conversationWithAdmin = (parent.startedConversations?.[0] || parent.participatedConversations?.[0]) ?? null
              const parentChildren = parent.children ?? [];
              return (
                <div
                  key={parent.id}
                  className="relative rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-3 py-3 shadow-md md:px-6 md:py-5 md:rounded-3xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-5">
                      <img
                        src={parent.avatar ?? "/admin/parentavatar.png"}
                        alt={`${parent.first_name} ${parent.last_name}`}
                        className="h-12 w-12 rounded-full object-cover border-2 border-(--color-primary) shrink-0 md:h-20 md:w-20"
                      />
                      <span className="text-[14px] font-semibold md:text-[20px]">
                        {parent.first_name} {parent.last_name}
                      </span>
                      <Link href={` ${ conversationWithAdmin && conversationWithAdmin.id ? `/admin/parents/conversations/${conversationWithAdmin.id}` : 
                            ""
                        } `} >
                        {conversationWithAdmin ? 
                            <img src="/boutons/chat.png" className="cursor-pointer absolute top-0 right-0 transition-all hover:scale-[140%]" alt="" title="ouvrir conversation" width={80}/> :
                            <img src="/boutons/plus.png" className="cursor-pointer absolute top-0 right-5 transition-all hover:scale-[140%]" alt="" title="créer conversation" width={35} onClick={() => createNewConversation(parent)}/> 
                        }    
                        
                      </Link>
                    </div>
                  </div>

                  {parentChildren.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1 pl-[60px] md:pl-[100px] md:mt-3 md:gap-2">
                      {parentChildren.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center gap-2 md:grid md:grid-cols-[3fr_2fr] md:gap-3"
                        >
                          <div className="flex items-center gap-2 md:gap-3">
                            <img
                              src={child.picture}
                              alt={`${child.firstName} ${child.lastName}`}
                              className="h-6 w-6 rounded-full object-cover bg-gray-100 border border-(--color-primary) shrink-0 md:h-9 md:w-9"
                            />
                            <span className="text-[12px] opacity-70 truncate md:text-[15px]">
                              {child.firstName} {child.lastName}
                            </span>
                          </div>
                          <span
                            className="justify-self-start rounded-full border-2 border-white px-2 py-0.5 text-[10px] font-medium shadow-sm whitespace-nowrap md:text-[13px] md:px-3"
                            style={{
                              backgroundColor: child.group
                                ? getGroupBg(String(child.group.id))
                                : "transparent",
                            }}
                          >
                            {child.group?.name ?? ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

