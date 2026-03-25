import Layout from "@/components/Layout";
import { NewReportInput, useChildByIdQuery, useChildWithGroupAndPlanningsQuery, useCreateReportMutation } from "@/graphql/generated/schema";
import { CombinedGraphQLErrors } from "@apollo/client";
import { GraphQLError } from "graphql/error";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CreateReportPage = () => {
    const router = useRouter();
    const { id } = router.query; // on récupère les données voulues de l'url : id de l'enfant

    // récupération des reports de l'enfant en fin de traitement
    const { refetch } = useChildWithGroupAndPlanningsQuery({variables: {childId: Number(id)}});

    const {data: dataChild, error} = useChildByIdQuery({variables : {id : Number(id)}});

    const child = dataChild?.child || null;

    const [createReport, {error: errorReport } ] = useCreateReportMutation();

    const [isPresent, setIsPresent] = useState(false);
    const [errorSubmit, setErrorSubmit] = useState(false);
    
    // react hook form
    const { register, handleSubmit, formState: { errors } } = useForm<NewReportInput>();

    // soumission formulaire pour création report
    const handleSubmitForm = async (data: NewReportInput) => {
        try {
            console.log("formulaire création report soumis!");
            
            data.date = new Date(data.date);
            if(data.picture?.length === 0) data.picture = null;
            if(!data.baby_mood) data.baby_mood = "na";
            data.child = {id: Number(id)};
            console.log(data);
    
            const createdReport = await createReport({variables: {
                 data
            }});
            
            await refetch();
            if(createdReport) {
                await refetch();
                router.push(`/staff/child/${id}/reports/${createdReport.data?.createReport.id}?created=true`, `/staff/child/${id}/reports/${createdReport.data?.createReport.id}`);
            } 
        } 
        catch(err) {
                setErrorSubmit(true); // permet affichage erreur et sa disparition
                // console.log("Erreur captée dans le catch : " , err);
                // console.dir(err);
        }
    }

    useEffect(() => {
        window.scroll({top: 0}); // remonte en haut de page à chaque modif de "errorSubmit"
    },[errorSubmit]);
    
    console.dir(errorReport);

    return(
        <Layout pageTitle={`Staff - nouveau compte-rendu`}>
            <div className="max-w-full mx-auto md:max-w-[1000px]">
                {errorSubmit && errorReport && (
                    <p className="text-red-500 px-5 mx-5 my-2 alert bg-red-100 border relative border-red-500 md:text-xl md:mx-52">
                    {/* message spécifique si on a une erreur de planning inexistant pour ce comptet-rendu : on offre un lien pour créer un planning avec cette date */}
                    {errorReport.message.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/) && <span>Planning inexistant pour cette date<br /> Pour créer un planning à cette date, cliquer sur ce <Link href={`http://localhost:3000/staff/planning/create?date=${errorReport.message.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)![0]}`} as={"http://localhost:3000/staff/planning/create"} className="text-[#1b3c79] hover:underline">lien</Link></span>}
                    { (errorReport as unknown as any).errors[0].extensions.code === "REPORT ALREADY EXISTED" && "Compte-rendu déjà créé pour l'enfant à cette date !"}
                    
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg
                        className="fill-current h-6 w-6 text-red-500 cursor-pointer"
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        onClick={() => setErrorSubmit(false)}
                        >
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </span>
                    </p>
                )}
                <div className="w-full flex justify-start items-center mt-5 mb-8 text-[#1b3c79]">
                    {/* img car Image ne passe pas avec l'url de notre enfant */}
                    <img src={child?.picture} alt={`picture of ${child?.firstName} ${child?.lastName}`} className="h-[130px] ml-5 object-contain rounded-[50%] border-3 border-[#ffdd23] absolute" /> 
                                <p className="w-[67%] h-[100px] rounded-4xl bg-[#FEF9F6] border-3 border-[#FFD771] ml-25 text-center pt-3 pl-5 flex justify-end md:w-[85%]">
                                    <span className="inline-block w-[90%] text-left pl-5 md:text-center md:pl-0 md:pr-25">
                                    {child?.firstName} {child?.lastName}
                                    <br />
                                    {child?.group.name}
                                    <br />
                                    {new Date(child?.birthDate).toLocaleDateString("fr-FR", {})}
                                    </span>
                                </p>
                            </div>
                <div className="w-[90%] px-4 py-1 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold mx-auto border-3 border-[#FFD771]">
                    {error && <p>{error.message}</p>}
                    {!child && <p>pas d'enfant correspondant</p>}
                    
                    {child &&  
                    <>
                        <div className="flex justify-end items-center">
                            <p className="text-sm">{child.group.name}</p>
                        </div>
                        <h1>
                            <Image src="/boutons/calendrier.png" alt="" width={35} height={25} className="inline-block m-2"/> Choix date compte-rendu
                            <input 
                            {...register("date", {    // register : nécessaire pour inscription du champ dans l'objet data soumis
                            required: "date à indiquer",
                            validate: (val) => [1,2,3,4,5].includes(new Date(val).getDay())
                            })}                         
                            type="date" id="date" name="date" className={`border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3 ${errors.date ? "focus-visible:outline-2 focus-visible:outline-red-500" : ""}`} />
                            <p className="text-red-500 mb-1 text-xs">{errors.date?.message as string}</p>
                            <p className="text-red-500 mb-1 text-xs">{errors.date?.type === "validate" && "choisir un jour de semaine valide"}</p>
                        </h1>
                        <div className="w-[90%] mx-auto">
                            <p className="text-xs underline text-center my-3"> création Compte-rendu</p>
                            <form onSubmit={handleSubmit(handleSubmitForm)}>
                                <label htmlFor="isPresent" className="mr-3 mb-3">Présent</label>
                                <input
                                {...register("isPresent")}
                                type="checkbox" id="isPresent" name="isPresent" onChange={() => setIsPresent(!isPresent)} />
                                <label htmlFor="staff_comment" className="w-[70%] block mt-3">
                                    Commentaire journée
                                </label>

                                <textarea 
                                {...register("staff_comment", {
                                required: isPresent,
                                })}   
                                id="staff_comment" name="staff_comment" disabled={!isPresent} placeholder={`saisir le commentaire du jour pour ${child.firstName} ${child.lastName}...`} rows={4} className={`border-2 border-amber-300 p-2 rounded-lg w-full inline-block mt-1 mb-3 ${isPresent ? "bg-[#FEE8B6]" : "bg-gray-400 cursor-not-allowed"} `} />
                                <p className="text-red-500 mb-1 text-xs">{errors.staff_comment?.type === "required" && "commentaire requis"}</p>
                                <input 
                                {...register("picture", {
                                pattern: /(^https:\/\/)|(null)/
                                })}
                                type="text" name="picture" placeholder="url photo à indiquer" className={`border-2 border-amber-300 p-2 rounded-lg w-full inline-block my-3 ${isPresent ? "bg-[#FEE8B6]" : "bg-gray-400 cursor-not-allowed"} `} />
                                <p className="text-red-500 mb-1 text-xs">{errors.picture?.type === "pattern" && "choisir une url valide"}</p>
                                {/* <img src={`/babymood/${report.baby_mood}.png`} alt={report.baby_mood} /> */}
                                <div className="flex justify-between">
                                    <input 
                                    {...register("baby_mood", {
                                    required: isPresent,
                                    })}  
                                    type="radio" name="baby_mood" id="baby_mood_good" value="good" disabled={!isPresent} />
                                    <label htmlFor="baby_mood_good" className={`${!isPresent ? "text-gray-400" : "" }`}>bonne</label>
                                    <input 
                                    {...register("baby_mood", {
                                    required: isPresent,
                                    })}  
                                    type="radio" name="baby_mood" id="baby_mood_average" value="neutral" disabled={!isPresent} />
                                    <label htmlFor="baby_mood_average" className={`${!isPresent ? "text-gray-400" : "" }`}>moyen</label>
                                    <input 
                                    {...register("baby_mood", {
                                    required: isPresent,
                                    })}  
                                    type="radio" name="baby_mood" id="baby_mood_bad" value="bad" disabled={!isPresent} />
                                    <label htmlFor="baby_mood_bad" className={`${!isPresent ? "text-gray-400" : "" }`}>difficile</label>
                                    <p className="text-red-500 mb-1 text-xs">{errors.baby_mood?.type === "required" && "humeur du jour requise"}</p>
                                </div>
                                <button type="submit" className="text-center mx-auto block border-2 border-amber-300 bg-[#FEE8B6] px-5 py-2 rounded-2xl my-3 text-xl cursor-pointer hover:bg-[#FFF999]">Valider</button>
                            </form>
                        </div>
                    </>
                    }
                </div>
            </div>
        </Layout>
    );
}

export default CreateReportPage;