import Layout from "@/components/Layout";
import { UpdatePlanningInput, useGetPlanningByIdQuery, useUpdatePlanningMutation } from "@/graphql/generated/schema";
import Image from "next/image";
import { useRouter } from "next/router";

const EditPlanningPage = () => {
  const router = useRouter();
    const {id} = router.query;
  
    const { data, refetch, error} = useGetPlanningByIdQuery({variables: {getPlanningById: Number(id)}})

    // gestion du hook pour la mutation d'un planning
    const [updatePlanning, loading] = useUpdatePlanningMutation({ variables: {data: data as UpdatePlanningInput, updatePlanningId: Number(id) }});
  
    const planning = data?.getPlanningById || null;
  
    if(error) {
      return error;
    }
  
    if(planning) {

        const handleSubmit = async(e: React.FormEvent) => {
            e.preventDefault();
            console.log("formulaire 'update planning' soumis!");
            const formData = new FormData(e.currentTarget as unknown as any);
            const data = Object.fromEntries(formData);
            console.log(data);
            await updatePlanning({variables: {
                updatePlanningId: Number(id),
                data: data
            }});
            await refetch(); // mise à jour du planning avant redirection
            router.push(`/staff/planning/${id}`);
        }

        return(
          <Layout pageTitle={`Staff - planning ${id} (edit)`}>
              <div className="max-w-full mx-auto md:max-w-[600px]">
                  <div className="w-[90%] px-4 py-1 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold mx-auto border-3 border-[#FFD771]">
                    <form onSubmit={handleSubmit}>
                      <p className="text-right text-sm">{planning.group.name}</p>
                      <h1 className="m-2 mb-3">
                          <Image src="/boutons/calendrier.png" alt="" width={35} height={25} className="inline-block m-2"/>
                          {new Date(planning.date).toLocaleDateString("FR-fr", {weekday:"long", day:"2-digit", month:"long", year:"numeric"}) }
                          <span className="text-xs underline"> modification planning </span>
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
          </Layout>
      );
    }
  };

export default EditPlanningPage;
