import Layout from "@/components/Layout";
import getUserInitial from "@/utils/getUserInitial";
import { useRouter } from "next/router";
import { useLogoutMutation } from "@/graphql/generated/schema";
import { useAuth } from "@/hooks/CurrentProfile";

export default function StaffProfile() {
    
    const router = useRouter();
    const [logout] = useLogoutMutation();
    const { user, refetch } = useAuth();
    
    const handleLogout = async () => {
        try {
            await logout();
            await refetch();
            router.push("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    if(user) {
        return(
            <Layout pageTitle="Staff">
                <div className="max-w-full mx-auto md:max-w-[600px]">
                    <div className="w-[90%] p-4 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold text-center border-3 border-[#FFD771] mx-auto">
                        <h1>Mon profil</h1>
                    </div>
                    <div className="w-[90%] p-4 bg-[#FEF9F6] rounded-4xl border-3 border-[#FFD771] mx-auto my-5 flex flex-col items-center justify-evenly">
                        <div className="text-xs self-end">
                            <button title="Déconnexion" className="cursor-pointer border-2 border-[#FFD771] text-[#1b3c79] rounded-2xl p-1 hover:bg-[#FFD771]" onClick={handleLogout}><img alt="déconnexion" src="/porte.png" className="inline-block w-5 mr-1" />Déconnexion</button>
                        </div>
                        <div className="w-25 h-25 mt-3 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden border-4 border-[#FFD771] md:w-24 md:h-24">
                            {user.avatar ? (
                            <img src={user.avatar} alt="" title={`${user.first_name} ${user.last_name}`} />
                            ) : (
                                getUserInitial(user.last_name)
                            )}
                        </div>
                        <input type="text" title="nom" className="w-[90%] my-3 px-2 border-2 border-[#FFD771] text-[#1b3c79] rounded-md" value={user.last_name} readOnly disabled />
                        <input type="text" title="prénom" className="w-[90%] my-3 px-2 border-2 border-[#FFD771] text-[#1b3c79] rounded-md" value={user.first_name} readOnly disabled />
                        <input type="email" title="email" className="w-[90%] my-3 px-2 border-2 border-[#FFD771] text-[#1b3c79] rounded-md" value={user.email} readOnly disabled />
                        <input type="text" title="téléphone" className="w-[90%] my-3 px-2 border-2 border-[#FFD771] text-[#1b3c79] rounded-md" value={user.phone} readOnly disabled />
                        <input type="text" title="groupe affecté" className="w-[90%] my-3 px-2 border-2 border-[#FFD771] text-[#1b3c79] rounded-md" value={user.group?.name} readOnly disabled />
                    </div>
                </div>
            </Layout>
        ) 
    } 
}