// biome-ignore assist/source/organizeImports: <explanation>
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/CurrentProfile";
import { useRouter } from "next/router";
import { useEffect } from "react";
import getUserInitial from "@/utils/getUserInitial";

export default function StaffDashboard() {
  const router = useRouter();
  const { user, loading, isStaff } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/");
    else if (!isStaff) router.replace("/403");
  }, [loading, user, isStaff, router]);

  if (loading) return null;
  if (!user || !isStaff) return null;

  // date du jour
  const date = new Date();

  if (user)
    return (
      <Layout pageTitle="Staff">
        <div className="max-w-full md:max-w-[600px]">
          <h2 className="p-4 text-right text-[#1b3c79] font-light">{date.toLocaleDateString("fr-FR", {weekday:"long", day:"2-digit",  month: "long", year:"numeric"})}</h2>
          <div className="w-[85%] py-8 bg-[#FEF9F6] rounded-4xl border-5 border-[#FFD771] mx-auto mb-10 flex items-center justify-evenly">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden border-4 border-[#FFD771] md:w-24 md:h-24">
              {user.avatar ? (
                // biome-ignore lint/performance/noImgElement: <explanation>
                <img src={user.avatar} alt="" title={`${user.first_name} ${user.last_name}`} />
              ) : (
                getUserInitial(user.last_name)
              )}
            </div>
            <div className="text-[#1b3c79]">
              <p className="font-semibold text-2xl">{user.first_name}</p>
              <p>
                {user.group?.name} ({user.group?.children?.length})
              </p>
            </div>
          </div>
          <div className="flex w-full flex-wrap justify-start gap-3">
              {(user.group?.children?.length as number) > 0 &&
            user?.group?.children?.map((child) => (
              <div
                key={child.id}
                className="w-[45%] pt-4 pb-2 mx-5 bg-[#FEF9F6] rounded-4xl border-5 border-[#FFD771] flex flex-col items-center justify-evenly"
              >
                <div className="overflow-hidden h-[100px]">
                  {/** biome-ignore lint/performance/noImgElement: <explanation> */}
                  <img
                    src={child.picture}
                    alt=""
                    className="h-[100px] object-contain shadow-gray-300 shadow-xl cursor-pointer  ease-in-out duration-300 hover:scale-110 "
                  />
                </div>
                <p className="mt-1  text-[#1b3c79]">{child.firstName}</p>
              </div>


            ))}
          </div>
          
        </div>
      </Layout>
    );
}
