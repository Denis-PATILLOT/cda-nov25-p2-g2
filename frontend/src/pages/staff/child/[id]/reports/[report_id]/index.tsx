import Layout from "@/components/Layout";
import { useGetPlanningByGroupIdAndDateQuery, useReportByIdQuery } from "@/graphql/generated/schema";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ReportDetails = () => {
    const router = useRouter();
    const {id, report_id, created } = router.query; // on récupère les données voulues de l'url : valeur report_id pour le compte-rendu visualisé

    console.log("id :", id, " reportId :", report_id);

    const [createdReport, setCreatedReport] = useState(false); 
  
    // pour gérer le message de création de compte-rendu
    useEffect(() => {
       created === "true" ? setCreatedReport(true) : null
    }, [created]);
  
    const { data, error } = useReportByIdQuery({variables: {reportId: Number(report_id)}})
    const report = data?.report || null;
    
    
    const { data: planning} = useGetPlanningByGroupIdAndDateQuery({variables: { groupId: Number(report?.child.group.id), date: report?.date  } })
    
    return(
        <Layout pageTitle={`Staff - planning ${id}`}>
            <div className="max-w-full mx-auto md:max-w-[600px]">
                {createdReport && 
                    <p className="text-green-500 text-center px-3 mx-2 mt-3 alert bg-green-200 border border-green-500 relative md:text-xl md:w-full">
                        Compte-rendu créé avec succès
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg
                                className="fill-current h-6 w-6 text-green-500 cursor-pointer"
                                role="button"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                onClick={() => setCreatedReport(false)}
                            >
                                <title>Close</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </span>
                    </p>
                }

                {report && report.child && 
                            <div className="w-full flex justify-start items-center mt-5 mb-8 text-[#1b3c79]">
                                {/* img car Image ne passe pas avec l'url de notre enfant */}
                                <img src={report.child.picture} alt={`picture of ${report.child.firstName} ${report.child.lastName}`} className="h-[130px] ml-5 object-contain rounded-[50%] border-3 border-[#ffdd23] absolute" /> 
                                <p className="w-[67%] h-[100px] rounded-4xl bg-[#FEF9F6] border-3 border-[#FFD771] ml-25 text-center pt-3 pl-5 flex justify-end">
                                    <span className="inline-block w-[90%] text-left pl-5">
                                    {report.child.firstName} {report.child.lastName}
                                    <br />
                                    {report.child.group.name}
                                    <br />
                                    {new Date(report.child.birthDate).toLocaleDateString("fr-FR", {})}
                                    </span>
                                </p>
                            </div>
                }
                <div className="w-[90%] px-4 py-1 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold mx-auto border-3 border-[#FFD771]">
                    {error && <p>{error.message}</p>}
                    {!planning && <p>pas de planning correspondant à cette date</p>}

                    {report && planning &&
                    <>
                        <div className="flex justify-end items-center">
                            
                            <p className="text-sm">{report!.child.group.name}</p>
                        </div>
                        <h1 className="">
                            <Image src="/boutons/calendrier.png" alt="" width={35} height={25} className="inline-block m-2"/>
                            {new Date(report!.date).toLocaleDateString("FR-fr", {weekday:"long", day:"2-digit", month:"long", year:"numeric"})}
                        </h1>
                        
                        <p className="text-xs underline text-center">Résumé planning
                            <Link href={`/staff/planning/${planning.getPlanningByGroupIdAndDate.id}/edit`} title="Modifier planning" className="inline" >
                                <img src="/boutons/modifier.png" className="inline w-10 opacity-70 hover:opacity-100"/>
                            </Link>
                        </p>
                        
                        <div className="w-[90%] mx-auto">
                            <label className="w-[70%]inline-block">
                                <Image src="/boutons/star.png" alt="" width={20} height={20} className="inline-block" />Activités
                            </label>
                            <textarea value={planning!.getPlanningByGroupIdAndDate.morning_activities! + "\n"  + planning!.getPlanningByGroupIdAndDate.afternoon_activities!} readOnly disabled className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                        </div>

                        <div className="w-[90%] mx-auto">
                            <label className="w-[70%]inline-block">
                                <Image src="/boutons/repas.png" alt="" width={20} height={20} className="inline-block" />Repas
                            </label>
                            <textarea value={planning!.getPlanningByGroupIdAndDate.meal! + "\n" + planning.getPlanningByGroupIdAndDate.snack} rows={3} readOnly disabled className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                        </div>

                        <div className="w-[90%] mx-auto">
                            <label className="w-[70%]inline-block">
                                <Image src="/boutons/dormir.png" alt="" width={20} height={20} className="inline-block" />Siestes
                            </label>
                            <textarea value={planning!.getPlanningByGroupIdAndDate.morning_nap! + "\n" + planning!.getPlanningByGroupIdAndDate.afternoon_nap} readOnly disabled className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                        </div>

                        <div className="w-[90%] mx-auto">
                            <p className="text-xs underline text-center my-2">Compte-rendu
                                <Link href={`/staff/child/${report.child.id}/reports/${report_id}/edit`} title="Modifier compte-rendu" className="inline" >
                                    <img src="/boutons/modifier.png" className="inline w-10 opacity-70 hover:opacity-100"/>
                                </Link>
                            </p>

                            {report.baby_mood !== "na" && 
                                <>
                                    <label htmlFor="isPresent" className="mr-3 mb-3">Présent</label><input type="checkbox" id="isPresent" checked={report.isPresent} readOnly disabled />
                                    <label className="w-[70%] block mt-3">
                                        Commentaire journée
                                    </label>
                                    <textarea value={report.staff_comment!} readOnly disabled rows={4} className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                                </>
                            }
                            {report.picture && <img src={report.picture} alt="" className="border-2 border-amber-300 bg-[#FEE8B6] rounded-lg w-full inline-block mt-3"/>}
                            {report.baby_mood === "na" ? <p className="text-center">non présent ce jour</p> : <img src={`/babymood/${report.baby_mood}.png`} alt={report.baby_mood} />}
                        </div>
                    </>
                    }
                </div>
                </div>
        </Layout>
    );
}

export default ReportDetails;
