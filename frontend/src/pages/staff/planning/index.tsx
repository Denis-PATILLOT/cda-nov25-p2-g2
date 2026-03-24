import Layout from "@/components/Layout";
import { useGetAllPlanningsByGroupQuery } from "@/graphql/generated/schema";
import { useAuth } from "@/hooks/CurrentProfile";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function StaffPlanning() {
    
    const router = useRouter();
    const { user, group, isAuthenticated, isStaff } = useAuth();
    
    const {data, loading, refetch } = useGetAllPlanningsByGroupQuery({variables: {groupId: Number(group?.id)}})

    // state pour mois sélectionnable afin d'avoir les plannings du mois choisi (par défaut, mois en cours)
    const [planningMonth, setPlanningMonth] = useState<number>(Number(new Date().getMonth()));
    console.log(planningMonth)

    // state par année sélectionnable afin d'avoir les plannings de l'année choisi (par défaut, année en cours)
    const [planningYear, setPlanningYear] = useState<number>(Number(new Date().getFullYear()));
    console.log(planningYear);

    const handleChangeMonthSelect = (e:any) => {
        setPlanningMonth(Number(e.target.value)) // on met bien en number pour comparer avec le mois des dates de chaque planning
    }

    const handleChangeYearSelect = (e:any) => {
        setPlanningYear(Number(e.target.value));
    }
    
    if(user && isAuthenticated && isStaff && group) {
        const groupPlannings = data?.getAllPlanningsByGroup || null; // tableau de planning
        
        // tableau des années (année distincte possible parmi tous les plannings)
        const years = new Set(groupPlannings?.map(planning => new Date(planning.date).getFullYear()));

        const groupPlanningsFiltered = 
            groupPlannings?.filter(planning => new Date(planning.date).getMonth() === planningMonth)
            .filter(planning => new Date(planning.date).getFullYear() === planningYear);
        console.log(groupPlanningsFiltered)

        return(
                <Layout pageTitle="Staff - plannings">
                    <div className="max-w-full mx-auto md:max-w-[600px]">
                        <div className="w-[90%] p-4 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold text-center border-3 min-h-[600px] border-[#FFD771] mx-auto">
                            <h1 className="m-2 mb-2">
                                <img src={"/calendrier.png"} width={50} className="inline-block" /> Plannings - {group.name}
                            </h1>
                            <Link href={"/staff/planning/create"}>
                                <button className="bg-[#ffdd23] p-2 rounded-xl text-xs text-white hover:bg-[#ffbb25] cursor-pointer mb-2 text-right">Créer planning</button>
                            </Link>
                            <div className="flex gap-5 justify-evenly">
                                <div className="my-3">
                                    <select name="month" id="month" className="border-2 border-[#FFD771] py-1 px-2" value={planningMonth} onChange={handleChangeMonthSelect} >
                                        <option value="0">Janvier</option>
                                        <option value="1">Février</option>
                                        <option value="2">Mars</option>
                                        <option value="3">Avril</option>
                                        <option value="4">Mai</option>
                                        <option value="5">Juin</option>
                                        <option value="6">Juillet</option>
                                        <option value="7">Août</option>
                                        <option value="8">Septembre</option>
                                        <option value="9">Octobre</option>
                                        <option value="10">Novembre</option>
                                        <option value="11">Décembre</option>
                                    </select>
                                </div>
                                <div className="my-3">
                                    <select name="year" id="year" className="border-2 border-[#FFD771] py-1 px-2" value={planningYear} onChange={handleChangeYearSelect} >
                                        {Array.from(years).map(y => 
                                            <option key={y} value={y}>{y}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="flex w-full flex-wrap justify-start gap-3 mt-5">
                                
                                    { groupPlannings && 
                                    
                                    groupPlannings.length > 0 ? 
                                    groupPlanningsFiltered && groupPlanningsFiltered.length > 0 ?
                                        groupPlanningsFiltered.map( planning => (
                                            <div key={planning.id} className="w-[30%] px-4 bg-[#FEF9F6]  text-xs rounded-2xl border-2 border-[#FFD771] hover:bg-[#FEE8B6]">
                                                <Link href={`/staff/planning/${planning.id}`} className="flex flex-col items-center">
                                                <p>{new Date(planning.date).toLocaleDateString("FR-fr", {weekday: "long"})}</p>
                                                <p className="text-nowrap">{new Date(planning.date).toLocaleDateString("FR-fr", {day: "numeric", month:"long"})}</p>
                                                <p>{new Date(planning.date).toLocaleDateString("FR-fr", {year:"numeric"})}</p>
                                                </Link>
                                            </div>
                                    ))
                                    :
                                        <p>aucun planning pour cette période</p>

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

