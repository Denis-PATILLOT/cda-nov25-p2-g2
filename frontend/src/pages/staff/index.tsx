// biome-ignore assist/source/organizeImports: <explanation>
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/CurrentProfile";
import { useRouter } from "next/router";
import { useEffect } from "react";
import getUserInitial from "@/utils/getUserInitial";
import Link from "next/link";

// accueil d'un staff
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
                <div className="max-w-full md:max-w-[1200px] md:mx-auto">
                    <h2 className="p-4 text-right text-[#1b3c79] font-light md:text-xl">
                        {date.toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </h2>
                    <div className="w-[85%] py-8 bg-[#FEF9F6] rounded-4xl border-5 border-[#FFD771] mx-auto mb-10 flex items-center justify-evenly md:max-w-[70%]">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden border-4 border-[#FFD771] md:w-24 md:h-24">
                            {user.avatar ? (
                                // biome-ignore lint/performance/noImgElement: <explanation>
                                <img
                                    src={user.avatar}
                                    alt={`${user.first_name} ${user.last_name}`}
                                    title={`${user.first_name} ${user.last_name}`}
                                    loading="lazy"
                                />
                            ) : (
                                getUserInitial(user.last_name)
                            )}
                        </div>
                        <div className="text-[#1b3c79]">
                            <h1 className="font-semibold text-2xl">
                                {user.first_name}
                            </h1>
                            <p>{user.group && user.group.name}</p>
                            <p>
                                {user.group &&
                                    user.group.children &&
                                    user.group.children.length > 0 &&
                                    user.group.children?.length > 1
                                    ? `${user.group.children.length} enfants`
                                    : "1 enfant"}
                            </p>
                        </div>
                    </div>
                    <div className="w-[85%] flex flex-wrap justify-start gap-6 mx-auto">
                        {(user.group?.children?.length as number) > 0 &&
                            user?.group?.children?.map((child) => (
                                <div
                                    key={child.id}
                                    className="w-[45%] pt-3 px-2 bg-[#FEF9F6] rounded-4xl border-3 border-[#FFD771] flex flex-col items-center justify-evenly hover:border-[#FFE771] md:w-[33%]"
                                >
                                    <div className="overflow-hidden h-[100px] rounded-2xl md:h-[300px]">
                                        {/** biome-ignore lint/performance/noImgElement: <explanation> */}
                                        <Link
                                            href={`/staff/child/${child.id}/reports`}
                                        >
                                            <img
                                                src={child.picture}
                                                alt={`${child.firstName} ${child.lastName} reports`}
                                                title={`${child.firstName} ${child.lastName}`}
                                                className="h-[100px] object-cover w-[100px] shadow-gray-300 shadow-xl rounded-2xl cursor-pointer  ease-in-out duration-300 hover:scale-110 md:h-[300px] md:w-[300px] "
                                                loading="lazy"
                                            />
                                        </Link>
                                    </div>
                                    <p className="md:text-xl md:my-3">
                                        {child.firstName}{" "}
                                        {child.lastName[0].toUpperCase()}.
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            </Layout>
        );
}
