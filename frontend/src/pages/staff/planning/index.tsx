import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/CurrentProfile";
import { useGetAllPlanningsByGroupQuery } from "@/graphql/generated/schema";
import Link from "next/link";

export default function StaffPlanning() {
    
    const router = useRouter();
    const { user, group, isAuthenticated, isStaff } = useAuth();
    const {data, loading, error} = useGetAllPlanningsByGroupQuery({variables: {groupId: Number(group?.id)}})

    if(user && isAuthenticated && isStaff && group) {

        const groupPlannings = data?.getAllPlanningsByGroup || null; // tableau de planning

        return(
                <Layout pageTitle="Staff - plannings">
                    <div className="max-w-full mx-auto md:max-w-[600px]">
                        <div className="w-[90%] p-4 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold text-center border-3 border-[#FFD771] mx-auto">
                            <h1 className="m-2 mb-5">Plannings - {group.name}</h1>
                                <div className="flex w-full flex-wrap justify-start gap-0">
                                    { groupPlannings && groupPlannings?.length > 0 ? 
                                    groupPlannings.map((planning) => (
                                            <div key={planning.id} className="w-[35%] mx-2 px-4 bg-[#FEF9F6]  text-xs rounded-2xl border-2 border-[#FFD771] hover:bg-[#FEE8B6]">
                                                <Link href={`/staff/planning/${planning.id}`} className="flex flex-col items-center">
                                                <p>{new Date(planning.date).toLocaleDateString("FR-fr", {weekday: "long"})}</p>
                                                <p>{new Date(planning.date).toLocaleDateString("FR-fr", {day: "numeric", month:"long"})}</p>
                                                <p>{new Date(planning.date).toLocaleDateString("FR-fr", {year:"numeric"})}</p>
                                                </Link>
                                            </div>
                                       
                                    ))
                                 :
                                    <p>Aucun planning pour ce groupe</p>
                            }
                                </div>
                        </div>
                    </div>
                </Layout>
            ); 
    }
}
