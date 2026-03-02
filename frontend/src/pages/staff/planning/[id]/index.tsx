import Layout from "@/components/Layout";
import { useGetPlanningByIdQuery } from "@/graphql/generated/schema";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const planningDetails = () => {
  const router = useRouter();
  const {id} = router.query;

  const { data, error} = useGetPlanningByIdQuery({variables: {getPlanningById: Number(id)}})

  const planning = data?.getPlanningById || null;

  if(error) {
    return error;
  }

  if(planning) {
    return(
        <Layout pageTitle={`Staff - planning ${id}`}>
            <div className="max-w-full mx-auto md:max-w-[600px]">
                <div className="w-[90%] px-4 py-1 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold mx-auto border-3 border-[#FFD771]">
                    <div className="flex justify-between items-center">
                        <Link href={`/staff/planning/${id}/edit`} title="Modifier planning" >
                            <Image src="/boutons/modifier.png" alt="" width={50} height={20} className="inline-block"/>
                        </Link>
                        <p className="text-sm">{planning.group.name}</p>
                    </div>
                    <h1 className="m-2 mb-3">
                        <Image src="/boutons/calendrier.png" alt="" width={35} height={25} className="inline-block m-2"/>
                        {new Date(planning.date).toLocaleDateString("FR-fr", {weekday:"long", day:"2-digit", month:"long", year:"numeric"})}
                    </h1>
                    
                    <div className="w-[90%] mx-auto">
                        <label className="w-[70%]inline-block">
                            <Image src="/boutons/star.png" alt="" width={20} height={20} className="inline-block" />Activité matin
                        </label>
                        <input type="text" value={planning.morning_activities!} readOnly disabled className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                    </div>

                    <div className="w-[90%] mx-auto">
                        <label className="w-[70%]inline-block">
                            <Image src="/boutons/dormir.png" alt="" width={20} height={20} className="inline-block" />Sieste matin
                        </label>
                        <input type="text" value={planning.morning_nap!} readOnly disabled className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                    </div>

                    <div className="w-[90%] mx-auto">
                        <label className="w-[70%]inline-block">
                            <Image src="/boutons/repas.png" alt="" width={20} height={20} className="inline-block" />Repas midi
                        </label>
                        <textarea value={planning.meal!} readOnly disabled className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3 resize-none" />
                    </div>

                    <div className="w-[90%] mx-auto">
                        <label className="w-[70%]inline-block">
                            <Image src="/boutons/star.png" alt="" width={20} height={20} className="inline-block" />Activité après-midi
                        </label>
                        <input type="text" value={planning.afternoon_activities!} readOnly disabled className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                    </div>

                    <div className="w-[90%] mx-auto">
                        <label className="w-[70%]inline-block">
                            <Image src="/boutons/dormir.png" alt="" width={20} height={20} className="inline-block" />Sieste après-midi
                        </label>
                        <input type="text" value={planning.afternoon_nap!} readOnly disabled className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                    </div>

                    <div className="w-[90%] mx-auto">
                        <label className="w-[70%]inline-block">
                            <Image src="/boutons/gouter.png" alt="" width={20} height={20} className="inline-block" />Goûter
                        </label>
                        <input type="text" value={planning.snack!} readOnly disabled className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3" />
                    </div>
                </div>
            </div>
        </Layout>
    );
  }
};

export default planningDetails;
