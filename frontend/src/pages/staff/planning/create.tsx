import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/CurrentProfile";
import Image from "next/image";
import { useRouter } from "next/router";

const CreatePlanningPage = () => {
    const router = useRouter();

    const { user } = useAuth();

    if(!user) {
        router.push("/");
    }
  
    // gestion du hook pour la création d'un planning
    //const [updatePlanning, loading] = useUpdatePlanningMutation({ variables: {data: data as UpdatePlanningInput, updatePlanningId: Number(id) }});
  
    //const planning = data?.getPlanningById || null;
  
    /*
    if(error) {
      return error;
    }
    */

        const handleSubmit = async(e: React.FormEvent) => {
            e.preventDefault();
            console.log("formulaire 'update planning' soumis!");
            const formData = new FormData(e.currentTarget as unknown as any);
            const data = Object.fromEntries(formData);
            console.log(data);
            await createPlanning({variables: {
                data: data
            }});
            await refetch(); // mise à jour du planning avant redirection
            router.push(`/staff/planning}`); // redirection sur liste des plannings
        }

        return(
          <Layout pageTitle={`Staff - new planning`}>
              <div className="max-w-full mx-auto md:max-w-[600px]">
                  <div className="w-[90%] px-4 py-1 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold mx-auto border-3 border-[#FFD771]">
                    <form onSubmit={handleSubmit}>
                      <p className="text-right text-sm">{user!.group!.name}</p>
                      <h1 className="m-2 mb-3">
                          <Image src="/boutons/calendrier.png" alt="" width={35} height={25} className="inline-block m-2"/>Nouveau planning
                          <input type="date" className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3"  />
                          {/* {new Date(planning.date).toLocaleDateString("FR-fr", {weekday:"long", day:"2-digit", month:"long", year:"numeric"}) } */}
                      </h1>
                      
                      <div className="w-[90%] mx-auto">
                          <label htmlFor="morning_activities" className="w-[70%]inline-block">
                              <Image src="/boutons/star.png" alt="" width={20} height={20} className="inline-block" />Activité matin
                          </label>
                          <input type="text" id="morning_activities" name="morning_activities" className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                      </div>
  
                      <div className="w-[90%] mx-auto">
                          <label htmlFor="morning_nap" className="w-[70%]inline-block">
                              <Image src="/boutons/dormir.png" alt="" width={20} height={20} className="inline-block" />Sieste matin
                          </label>
                          <input type="text" id="morning_nap" name="morning_nap" className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                      </div>
  
                      <div className="w-[90%] mx-auto">
                          <label htmlFor="meal" className="w-[70%]inline-block">
                              <Image src="/boutons/repas.png" alt="" width={20} height={20} className="inline-block" />Repas midi
                          </label>
                          <textarea id="meal" name="meal" className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3 resize-none" />
                      </div>
  
                      <div className="w-[90%] mx-auto">
                          <label htmlFor="afternoon_activities" className="w-[70%]inline-block">
                              <Image src="/boutons/star.png" alt="" width={20} height={20} className="inline-block" />Activité après-midi
                          </label>
                          <input id="afternoon_activities" name="afternoon_activities" type="text" className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                      </div>
  
                      <div className="w-[90%] mx-auto">
                          <label htmlFor="afternoon_nap" className="w-[70%]inline-block">
                              <Image src="/boutons/dormir.png" alt="" width={20} height={20} className="inline-block" />Sieste après-midi
                          </label>
                          <input type="text" id="afternoon_nap" name="afternoon_nap" className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                      </div>
  
                      <div className="w-[90%] mx-auto">
                          <label htmlFor="snack" className="w-[70%]inline-block">
                              <Image src="/boutons/gouter.png" alt="" width={20} height={20} className="inline-block" />Goûter
                          </label>
                          <input type="text" id="snack" name="snack" className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                      </div>
                      <button type="submit" className="text-center mx-auto block border-2 border-amber-300 bg-[#FEE8B6] px-5 py-2 rounded-2xl my-3 text-xl cursor-pointer hover:bg-[#FFF999]">Valider</button>
                    </form>
                  </div>
              </div>
          </Layout>
    );
}

export default CreatePlanningPage;
