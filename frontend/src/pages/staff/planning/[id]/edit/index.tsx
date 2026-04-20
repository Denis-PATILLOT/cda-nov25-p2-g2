import Layout from "@/components/Layout";
import { PlanningInput, UpdatePlanningInput, useGetPlanningByIdQuery, useUpdatePlanningMutation } from "@/graphql/generated/schema";
import { CombinedGraphQLErrors } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const EditPlanningPage = () => {
  const router = useRouter();
    const {id} = router.query;
  
    const { data, refetch, error} = useGetPlanningByIdQuery({variables: {getPlanningById: Number(id)}})

    // gestion du hook pour la mutation d'un planning
    const [updatePlanning, loading] = useUpdatePlanningMutation({ variables: {data: data as UpdatePlanningInput, updatePlanningId: Number(id) }});

    // gestion d'erreurs validation en édition d'un planning
    const [errorEdit, setErrorEdit] = useState<string|null>(null);
  
    const planning = data?.getPlanningById || null;
  
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        console.log("formulaire 'update planning' soumis!");
        const formData = new FormData(e.currentTarget as unknown as any);
        const data = Object.fromEntries(formData) as unknown as PlanningInput;
        console.log(data);

        if(!data.morning_activities)  {
            setErrorEdit("Veuillez renseigner les activités du matin");
            return;
        }

        if(!data.morning_nap)  {
            setErrorEdit("Veuillez renseigner les horaires de la sieste du matin");
            return;
        }

        if(!data.meal)  {
            setErrorEdit("Veuillez renseigner le repas de midi");
            return;
        }

        if(!data.afternoon_activities)  {
            setErrorEdit("Veuillez renseigner les activités de l'après-midi");
            return;
        }

        if(!data.afternoon_nap)  {
            setErrorEdit("Veuillez renseigner les horaires de la sieste de l'après-midi");
            return;
        }

        if(!data.snack)  {
            setErrorEdit("Veuillez renseigner le goûter");
            return;
        }

        await updatePlanning({variables: {
            updatePlanningId: Number(id),
            data: data
        }});
        await refetch(); // mise à jour du planning avant redirection
        router.push(`/staff/planning/${id}`);
    }

    return(
        <Layout pageTitle={`Staff - planning ${id} (edit)`}>
            {error && 
            <p className="text-center text-red-500 bg-[#FEF9F6] alert m-2">
                { error instanceof CombinedGraphQLErrors && error.message.startsWith("you can't access this planning") && "Vous ne pouvez accéder à ce planning" }
                { error instanceof CombinedGraphQLErrors && error.errors[0].extensions?.code === "NOT_FOUND" && "Planning introuvable" }
            </p>
            }

            {/* erreurs de validation */}
            {errorEdit && 
                <p className="text-red-500 text-center px-5 mx-5 my-3 alert bg-red-100 border relative border-red-500 md:text-xl md:mx-52">
                    {errorEdit}
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg
                            className="h-6 w-6 cursor-pointer fill-current text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            onClick={() => setErrorEdit(null)}
                        >
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </span>
                </p>
            }
            
            {planning &&
            <div className="max-w-full mx-auto md:max-w-[1000px]">
                <div className="w-[90%] px-4 py-1 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold mx-auto border-3 border-[#FFD771]">
                <form onSubmit={handleSubmit}>
                    <p className="text-right text-sm">{planning.group.name}</p>
                    <h1 className="m-2 mb-3">
                        <Image src="/boutons/calendrier.png" alt="" width={35} height={25} className="inline-block m-2"/>
                        {new Date(planning.date).toLocaleDateString("FR-fr", {weekday:"long", day:"2-digit", month:"long", year:"numeric"}) }
                        <span className="text-xs underline block text-center"> modification planning </span>
                    </h1>
                    
                    <div className="w-[90%] mx-auto">
                        <label htmlFor="morning_activities" className="w-[70%]inline-block">
                            <Image src="/boutons/star.png" alt="" width={20} height={20} className="inline-block" />Activité matin
                        </label>
                        <input type="text" id="morning_activities" name="morning_activities" defaultValue={planning.morning_activities!} className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                    </div>

                    <div className="w-[90%] mx-auto">
                        <label htmlFor="morning_nap" className="w-[70%]inline-block">
                            <Image src="/boutons/dormir.png" alt="" width={20} height={20} className="inline-block" />Sieste matin
                        </label>
                        <input type="text" id="morning_nap" name="morning_nap" defaultValue={planning.morning_nap!} className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                    </div>

                    <div className="w-[90%] mx-auto">
                        <label htmlFor="meal" className="w-[70%]inline-block">
                            <Image src="/boutons/repas.png" alt="" width={20} height={20} className="inline-block" />Repas midi
                        </label>
                        <textarea id="meal" name="meal" defaultValue={planning.meal!} className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3 resize-none" />
                    </div>

                    <div className="w-[90%] mx-auto">
                        <label htmlFor="afternoon_activities" className="w-[70%]inline-block">
                            <Image src="/boutons/star.png" alt="" width={20} height={20} className="inline-block" />Activité après-midi
                        </label>
                        <input id="afternoon_activities" name="afternoon_activities" type="text" defaultValue={planning.afternoon_activities!} className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                    </div>

                    <div className="w-[90%] mx-auto">
                        <label htmlFor="afternoon_nap" className="w-[70%]inline-block">
                            <Image src="/boutons/dormir.png" alt="" width={20} height={20} className="inline-block" />Sieste après-midi
                        </label>
                        <input type="text" id="afternoon_nap" name="afternoon_nap" defaultValue={planning.afternoon_nap!} className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                    </div>

                    <div className="w-[90%] mx-auto">
                        <label htmlFor="snack" className="w-[70%]inline-block">
                            <Image src="/boutons/gouter.png" alt="" width={20} height={20} className="inline-block" />Goûter
                        </label>
                        <input type="text" id="snack" name="snack" defaultValue={planning.snack!} className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                    </div>
                    <button type="submit" className="text-center mx-auto block border-2 border-amber-300 bg-[#FEE8B6] px-5 py-2 rounded-2xl my-3 text-xl cursor-pointer hover:bg-[#FFF999]">Valider</button>
                </form>
                </div>
            </div>
            }
        </Layout>
    );
}

export default EditPlanningPage;
