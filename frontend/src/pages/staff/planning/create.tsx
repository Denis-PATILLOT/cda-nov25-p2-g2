import Layout from "@/components/Layout";
import { PlanningInput, useCreatePlanningMutation } from "@/graphql/generated/schema";
import { useAuth } from "@/hooks/CurrentProfile";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CreatePlanningPage = () => {
    const router = useRouter();

    const { user } = useAuth();
    const [errorSubmit, setErrorSubmit] = useState(false);

      // react hook form
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<PlanningInput>();
    
    // gestion du hook pour la création d'un planning
    const [createPlanning, {error}] = useCreatePlanningMutation();
    
            const handleSubmitForm = async(data: PlanningInput) => {
            try {
                console.log("formulaire création planning soumis");

                data.date = new Date(data.date);
                data.groupId = Number(user?.group?.id);

                const result = await createPlanning({ variables: { data } });

                if(result) { 
                    const id = result.data!.createPlanning.id 
                    router.push(`/staff/planning/${id}?created=true`, `/staff/planning/${id}`);    
                }
            } catch(err) {
                setErrorSubmit(true); // permet affichage erreur et sa disparition
                console.error(err);
            }
        }

        useEffect(() => {
            window.scroll({top: 0}); // remonte en haut de page à chaque modif de "errorSubmit"
        },[errorSubmit]);
       
        if(user) {
            return(
          <Layout pageTitle={`Staff - new planning`}>
              <div className="max-w-full mx-auto md:max-w-[600px]">
                {errorSubmit && error && (
                    <p className="text-red-500 text-center px-5 mx-5 my-2 alert bg-red-100 border relative border-red-500 md:text-xl md:mx-52">
                    {error.message || "Une erreur est survenue..."}
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
                    
                  <div className="w-[90%] px-4 py-1 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold mx-auto border-3 border-[#FFD771]">
                    <form onSubmit={handleSubmit(handleSubmitForm)}>
                      <p className="text-right text-sm">{user!.group!.name}</p>
                      <h1 className="m-2 mb-3">
                          <Image src="/boutons/calendrier.png" alt="" width={35} height={25} className="inline-block m-2"/>Nouveau planning
                          <input 
                          {...register("date", {
                            required: "date à indiquer",
                            validate: (val) => [1,2,3,4,5].includes(new Date(val).getDay())
                            
                          })}                         
                          type="date" id="date" name="date" className={`border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3 ${errors.date ? "focus-visible:outline-2 focus-visible:outline-red-500" : ""}`} />
                          <p className="text-red-500 mb-1 text-xs">{errors.date?.message as string}</p>
                          <p className="text-red-500 mb-1 text-xs">{errors.date?.type === "validate" && "choisir un jour de semaine valide"}</p>
                      </h1>
                      
                      
                      <div className="w-[90%] mx-auto">
                          <label htmlFor="morning_activities" className="w-[70%]inline-block">
                              <Image src="/boutons/star.png" alt="" width={20} height={20} className="inline-block" />Activité matin
                          </label>
                          <input 
                          {...register("morning_activities", {
                            required: "saisir les activités du matin",
                            setValueAs: (value) => value.trim() 
                            },
                          )}                         
                          type="text" id="morning_activities" name="morning_activities" className={`border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3 ${errors.morning_activities ? "focus-visible:outline-2 focus-visible:outline-red-500" : ""}`} />
                          <p className="text-red-500 mb-1 text-xs">{errors.morning_activities?.message}</p>
                      </div>
  
                      <div className="w-[90%] mx-auto">
                          <label htmlFor="morning_nap" className="w-[70%]inline-block">
                              <Image src="/boutons/dormir.png" alt="" width={20} height={20} className="inline-block" />Sieste matin
                          </label>
                          <input 
                          {...register("morning_nap", {
                            required: "saisir la période de sieste du matin",
                            setValueAs: (value) => value.trim() 
                          })}
                          type="text" id="morning_nap" name="morning_nap" className={`border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3  ${errors.morning_nap ? "focus-visible:outline-2 focus-visible:outline-red-500" : ""}`}/>
                          <p className="text-red-500 mb-1 text-xs">{errors.morning_nap?.message}</p>
                      </div>
  
                      <div className="w-[90%] mx-auto">
                          <label htmlFor="meal" className="w-[70%]inline-block">
                              <Image src="/boutons/repas.png" alt="" width={20} height={20} className="inline-block" />Repas midi
                          </label>
                          <textarea
                          {...register("meal", {
                            required: "saisir le repas de midi",
                            setValueAs: (value) => value.trim() 
                          })}
                          id="meal" name="meal" className={`border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3 resize-none ${errors.morning_nap ? "focus-visible:outline-2 focus-visible:outline-red-500" : ""}`} />
                          <p className="text-red-500 mb-1 text-xs">{errors.meal?.message}</p>
                      </div>
  
                      <div className="w-[90%] mx-auto">
                          <label htmlFor="afternoon_activities" className="w-[70%]inline-block">
                              <Image src="/boutons/star.png" alt="" width={20} height={20} className="inline-block" />Activité après-midi
                          </label>
                          <input 
                          {...register("afternoon_activities", {
                            required: "saisir les activités de l'après-midi",
                            setValueAs: (value) => value.trim() 
                          })}
                          id="afternoon_activities" name="afternoon_activities" type="text" className={`border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3 ${errors.afternoon_activities ? "focus-visible:outline-2 focus-visible:outline-red-500" : ""}`} />
                          <p className="text-red-500 mb-1 text-xs">{errors.afternoon_activities?.message}</p>
                      </div>
  
                      <div className="w-[90%] mx-auto">
                          <label htmlFor="afternoon_nap" className="w-[70%]inline-block">
                              <Image src="/boutons/dormir.png" alt="" width={20} height={20} className="inline-block" />Sieste après-midi
                          </label>
                          <input 
                          {...register("afternoon_nap", {
                            required: "saisir la sieste de l'après-midi",
                            setValueAs: (value) => value.trim() 
                            
                          })}
                          type="text" id="afternoon_nap" name="afternoon_nap" className={`border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3 ${errors.afternoon_nap ? "focus-visible:outline-2 focus-visible:outline-red-500" : ""}`} />
                          <p className="text-red-500 mb-1 text-xs">{errors.afternoon_nap?.message}</p>
                      </div>
  
                      <div className="w-[90%] mx-auto">
                          <label htmlFor="snack" className="w-[70%]inline-block">
                              <Image src="/boutons/gouter.png" alt="" width={20} height={20} className="inline-block" />Goûter
                          </label>
                          <input 
                          {...register("snack", {
                            required: "saisir le goûter",
                            setValueAs: (value) => value.trim() 
                          })}
                          type="text" id="snack" name="snack" className={`border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3 ${errors.snack ? "focus-visible:outline-2 focus-visible:outline-red-500" : ""}`} />
                          <p className="text-red-500 mb-1 text-xs">{errors.snack?.message}</p>
                      </div>
                      <button type="submit" className="text-center mx-auto block border-2 border-amber-300 bg-[#FEE8B6] px-5 py-2 rounded-2xl my-3 text-xl cursor-pointer hover:bg-[#FFF999]">Valider</button>
                    </form>
                  </div>
              </div>
          </Layout>
    );
        }
        
}

export default CreatePlanningPage;
