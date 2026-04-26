import Layout from "@/components/Layout";
import { useGetPlanningByIdQuery } from "@/graphql/generated/schema";
import { CombinedGraphQLErrors } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PlanningDetails = () => {
    const router = useRouter();
    const { id, created } = router.query; // on récupère les données voulues de l'url : valeur id et valeur toto dans planningCreated

    const [createdPlanning, setCreatedPlanning] = useState(false);
    // pour gérer le message de création de planning
    useEffect(() => {
        created === "true" ? setCreatedPlanning(true) : null;
    }, [created]);

    const { data, error } = useGetPlanningByIdQuery({
        variables: { getPlanningById: Number(id) },
    });

    const planning = data?.getPlanningById || null;

    return (
        <Layout pageTitle={`Staff - planning ${id}`}>
            <div className="max-w-full mx-auto md:max-w-[1000px]">
                {error && (
                    <p className="text-red-500 px-5 mx-5 alert border-red-500">
                        {error instanceof TypeError &&
                            error?.message.includes("Network") && (
                                <>
                                    Erreur de connexion rencontrée.
                                    <br /> Merci de réessayer utlérieurement
                                </>
                            )}
                        {error instanceof CombinedGraphQLErrors &&
                            error.message.startsWith(
                                "you can't access this planning",
                            ) &&
                            "Vous ne pouvez accéder à ce planning"}
                        {error instanceof CombinedGraphQLErrors &&
                            error.errors[0].extensions?.code === "NOT_FOUND" &&
                            "Planning introuvable"}
                    </p>
                )}

                {planning && !error && (
                    <div className="w-[90%] px-4 py-1 pb-8 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold mx-auto border-3 border-[#FFD771]">
                        {createdPlanning && (
                            <p
                                data-testid="planning-created"
                                className="text-green-500 text-center px-3 mx-2 mt-3 alert bg-green-200 border border-green-500 relative md:text-xl md:w-full"
                            >
                                Planning créé avec succès
                                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                    <svg
                                        className="fill-current h-6 w-6 text-green-500 cursor-pointer"
                                        role="button"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        onClick={() =>
                                            setCreatedPlanning(false)
                                        }
                                    >
                                        <title>Close</title>
                                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                    </svg>
                                </span>
                            </p>
                        )}

                        <div className="flex justify-between items-center">
                            <Link
                                href={`/staff/planning/${id}/edit`}
                                title="Modifier planning"
                            >
                                <Image
                                    src="/boutons/modifier.webp"
                                    alt="modifier planning"
                                    width={50}
                                    height={20}
                                    className="inline-block opacity-70 hover:opacity-100"
                                />
                            </Link>
                            <p className="text-sm">{planning.group.name}</p>
                        </div>
                        <h1 className="m-2 mb-3">
                            <Image
                                src="/boutons/calendrier.webp"
                                alt=""
                                width={35}
                                height={25}
                                className="inline-block m-2"
                            />
                            {new Date(planning.date).toLocaleDateString(
                                "FR-fr",
                                {
                                    weekday: "long",
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                },
                            )}
                        </h1>

                        <div className="w-[90%] mx-auto">
                            <label
                                htmlFor="activite_matin"
                                className="w-[70%]inline-block"
                            >
                                <Image
                                    src="/boutons/star.webp"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="inline-block"
                                />
                                Activité matin
                            </label>
                            <input
                                type="text"
                                value={planning.morning_activities!}
                                readOnly
                                disabled
                                id="activite_matin"
                                className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3"
                            />
                        </div>

                        <div className="w-[90%] mx-auto">
                            <label
                                htmlFor="sieste_matin"
                                className="w-[70%]inline-block"
                            >
                                <Image
                                    src="/boutons/dormir.webp"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="inline-block"
                                />
                                Sieste matin
                            </label>
                            <input
                                type="text"
                                value={planning.morning_nap!}
                                readOnly
                                disabled
                                id="sieste_matin"
                                className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3"
                            />
                        </div>

                        <div className="w-[90%] mx-auto">
                            <label
                                htmlFor="repas_midi"
                                className="w-[70%]inline-block"
                            >
                                <Image
                                    src="/boutons/repas.webp"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="inline-block"
                                />
                                Repas midi
                            </label>
                            <textarea
                                value={planning.meal!}
                                readOnly
                                disabled
                                id="repas_midi"
                                className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3 resize-none"
                            />
                        </div>

                        <div className="w-[90%] mx-auto">
                            <label
                                htmlFor="activite_apresmidi"
                                className="w-[70%]inline-block"
                            >
                                <Image
                                    src="/boutons/star.webp"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="inline-block"
                                />
                                Activité après-midi
                            </label>
                            <input
                                type="text"
                                value={planning.afternoon_activities!}
                                readOnly
                                disabled
                                id="activite_apresmidi"
                                className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3"
                            />
                        </div>

                        <div className="w-[90%] mx-auto">
                            <label
                                htmlFor="sieste_apresmidi"
                                className="w-[70%]inline-block"
                            >
                                <Image
                                    src="/boutons/dormir.webp"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="inline-block"
                                />
                                Sieste après-midi
                            </label>
                            <input
                                type="text"
                                value={planning.afternoon_nap!}
                                readOnly
                                disabled
                                id="sieste_apresmidi"
                                className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3"
                            />
                        </div>

                        <div className="w-[90%] mx-auto">
                            <label
                                htmlFor="gouter"
                                className="w-[70%]inline-block"
                            >
                                <Image
                                    src="/boutons/gouter.webp"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="inline-block"
                                />
                                Goûter
                            </label>
                            <input
                                type="text"
                                value={planning.snack!}
                                readOnly
                                disabled
                                id="gouter"
                                className="border-2 border-amber-300 bg-[#FEE8B6] p-2 rounded-lg w-full inline-block mt-1 mb-3"
                            />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PlanningDetails;
