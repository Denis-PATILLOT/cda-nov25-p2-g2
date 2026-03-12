import { useRouter } from "next/router";
// import { useAuth } from "@/hooks/CurrentProfile";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/CurrentProfile";
import Layout from "@/components/Layout";
import { useChildWithGroupAndPlanningsQuery } from "@/graphql/generated/schema";

const ChildReports = () => {
    const router = useRouter();
    const {id} = router.query;
    
    const { user, group, isAuthenticated, isStaff } = useAuth();
    
    // récupération des reports de l'enfant
    const {data, loading, error} = useChildWithGroupAndPlanningsQuery({variables: {childId: Number(id)}});

    // state pour mois sélectionnable afin d'avoir les reports du mois choisi (par défaut, mois en cours)
    const [reportMonth, setReportMonth] = useState<number>(Number(new Date().getMonth()));
    console.log(reportMonth)

    // state par année sélectionnable afin d'avoir les reports de l'année choisie (par défaut, année en cours)
    const [reportYear, setReportYear] = useState<number>(Number(new Date().getFullYear()));
    console.log(reportYear);

    const handleChangeMonthSelect = (e:any) => {
        setReportMonth(Number(e.target.value)) // on met bien en number pour comparer avec le mois des dates de chaque planning
    }

    const handleChangeYearSelect = (e:any) => {
        setReportYear(Number(e.target.value));
    }
    
    if(user && isAuthenticated && isStaff && group) {
        const child = data?.child || null;
        const childReports = child?.reports || null; // tableau de reports de l'enfant
        
        // tableau des années (année distincte possible parmi les reports)
        const years = new Set(childReports?.map(report => new Date(report.date).getFullYear()));

        const childReportsFiltered = 
            childReports?.filter(report => new Date(report.date).getMonth() === reportMonth)
            .filter(report => new Date(report.date).getFullYear() === reportYear);
        console.log(childReportsFiltered);

        return(
                <Layout pageTitle="Staff - comptes-rendus">
                    <div className="max-w-full mx-auto md:max-w-[600px]">
                        {child && 
                            <div className="w-[full] flex justify-start items-center mt-5 mb-8 text-[#1b3c79] ">
                                {/* img car Image ne passe pas avec l'url de notre enfant */}
                                <img src={child.picture} alt={`picture of ${child.firstName} ${child.lastName}`} className="h-[130px] ml-5 object-contain rounded-[50%] border-3 border-[#ffdd23] absolute" /> 
                                <p className="w-[67%] h-[100px] rounded-4xl bg-[#FEF9F6] border-3 border-[#FFD771] ml-25 text-center pt-3 pl-5 flex justify-end">
                                    <span className="inline-block w-[90%] text-left pl-5">
                                    {child.firstName} {child.lastName}
                                    <br />
                                    {child.group.name}
                                    <br />
                                    {new Date(child.birthDate).toLocaleDateString("fr-FR", {})}
                                    </span>
                                </p>
                            </div>
                        }
                        <div className="w-[90%] p-4 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold text-center border-3 border-[#FFD771] mx-auto">
                            <h1 className="m-2">Comptes-rendus</h1>
                            <Link href={`/staff/child/${id}/reports/create`}>
                                <button className="bg-[#ffdd23] p-2 rounded-xl text-xs text-white hover:bg-[#ffbb25] cursor-pointer mb-2 text-right">Créer compte-rendu</button>
                            </Link>
                            {loading && <p>Chargement des données</p>}
                            {error && <p className="text-red-500">Erreur : {error.message}</p>}
                            {child && 
                            <>
                            <div className="flex gap-5 justify-evenly">
                                <div className="my-3">
                                    <select name="month" id="month" className="border-2 border-[#FFD771] py-1 px-2" value={reportMonth} onChange={handleChangeMonthSelect} >
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
                                    <select name="year" id="year" className="border-2 border-[#FFD771] py-1 px-2" value={reportYear} onChange={handleChangeYearSelect} >
                                        {Array.from(years).map(y => 
                                            <option key={y} value={y}>{y}</option>
                                        )}
                                    </select>
                                </div>
                            </div> 
                            <div className="flex w-full flex-wrap justify-start gap-3">
                                
                                    { childReports && 
                                    
                                    childReports.length > 0 ? 
                                    childReportsFiltered && childReportsFiltered.length > 0 ?
                                        childReportsFiltered.map(report => (
                                            <div key={report.id} className="w-[30%] px-4 bg-[#FEF9F6]  text-xs rounded-2xl border-2 border-[#FFD771] hover:bg-[#FEE8B6]">
                                                <Link href={`/staff/child/${child.id}/reports/${report.id}`} className="flex flex-col items-center">
                                                <p>{new Date(report.date).toLocaleDateString("FR-fr", {weekday: "long"})}</p>
                                                <p className="text-nowrap">{new Date(report.date).toLocaleDateString("FR-fr", {day: "numeric", month:"long"})}</p>
                                                <p>{new Date(report.date).toLocaleDateString("FR-fr", {year:"numeric"})}</p>
                                                </Link>
                                            </div>
                                    ))
                                    :
                                        <p>aucun compte-rendu pour cette période</p>

                                    :
                                        <p>Aucun compte-rendu pour cet enfant</p>
                            }
                            
                            </div> 
                            
                            </>
                            }
                        </div>
                    </div>
                </Layout>
            ); 
    }
}

export default ChildReports;
