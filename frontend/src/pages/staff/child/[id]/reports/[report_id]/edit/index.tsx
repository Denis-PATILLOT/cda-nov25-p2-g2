import Layout from "@/components/Layout";
import {
    useReportByIdQuery,
    useUpdateReportMutation,
} from "@/graphql/generated/schema";
import Image from "next/image";
import { useRouter } from "next/router";
import { SubmitEvent, useEffect, useState } from "react";

const EditReport = () => {
    const router = useRouter();
    const { id, report_id } = router.query; // on récupère les données voulues de l'url : valeur report_id pour le compte-rendu visualisé

    const { data, error, refetch } = useReportByIdQuery({
        variables: { reportId: Number(report_id) },
    });

    // gestion du hook pour la mutation d'un report
    const [updateProfile, { loading }] = useUpdateReportMutation();

    // gestion d'erreurs validation en édition d'un report
    const [errorEdit, setErrorEdit] = useState<string | null>(null);

    const report = data?.report || null;
    console.log("report : ", report);
    const [isPresent, setIsPresent] = useState(false);
    console.log("is present : ", isPresent);

    useEffect(() => {
        setIsPresent(report?.isPresent as boolean); // mise à jour state après récupération report
    }, [report]);

    // soumission formulaire pour édition report
    const handleSubmitForm = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("formulaire 'update report' soumis!");
        const formData = new FormData(e.currentTarget as unknown as any);
        const reportData = Object.fromEntries(formData) as unknown as any;
        reportData.isPresent = reportData.isPresent === "on" ? true : false;
        reportData.staff_comment = reportData.isPresent
            ? reportData.staff_comment.length !== 0
                ? reportData.staff_comment
                : null
            : null;
        reportData.date = report!.date;
        reportData.child = { id: Number(id) };
        reportData.picture = reportData.isPresent
            ? reportData.picture.length !== 0
                ? reportData.picture
                : null
            : null; // pour gérer le cas où on ne met pas de donnée dans l'url
        reportData.baby_mood = reportData.isPresent
            ? reportData.baby_mood
            : "na"; // si pas présent, on met une valeur à baby_mood à "na"

        console.log(reportData);

        if (
            reportData.picture &&
            !reportData.picture.match(
                /https:\/\/(www.)?[a-zA-Z0-9-]+(\.[a-zA-Z]+)+(\/(\w|[-_%.#?=&+])+)+/,
            )
        ) {
            setErrorEdit(
                "L'url de l'image doit commencer par https:// et être une url valide",
            );
            return;
        }

        if (reportData.isPresent && !reportData.staff_comment) {
            setErrorEdit("Veuiller remplir le champ commentaire journée");
            return;
        }

        if (reportData.isPresent && !reportData.baby_mood) {
            setErrorEdit("Veuiller indiquer l'humeur du jour");
            return;
        }

        await updateProfile({
            variables: {
                updateReportId: Number(report_id),
                data: reportData,
            },
        });
        await refetch(); // mise à jour du report avant redirection
        router.push(`/staff/child/${id}/reports/${report_id}`);
    };

    return (
        <Layout pageTitle={`Staff - planning ${id}`}>
            <div className="max-w-full mx-auto md:max-w-[1000px]">
                {report && report.child && (
                    <div className="w-full flex justify-start items-center mt-5 mb-8 text-[#1b3c79]">
                        {/* img car Image ne passe pas avec l'url de notre enfant */}
                        <img
                            src={report.child.picture}
                            alt={`picture of ${report.child.firstName} ${report.child.lastName}`}
                            className="h-[130px] ml-5 object-contain rounded-[50%] border-3 border-[#ffdd23] absolute"
                            loading="lazy"
                        />
                        <p className="w-[67%] h-[100px] rounded-4xl bg-[#FEF9F6] border-3 border-[#FFD771] ml-25 text-center pt-3 pl-5 flex justify-end md:w-[85%]">
                            <span className="inline-block w-[90%] text-left pl-5 md:text-center md:pl-0 md:pr-25">
                                {report.child.firstName} {report.child.lastName}
                                <br />
                                {report.child.group.name}
                                <br />
                                {new Date(
                                    report.child.birthDate,
                                ).toLocaleDateString("fr-FR", {})}
                            </span>
                        </p>
                    </div>
                )}

                {/* erreurs de validation */}
                {errorEdit && (
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
                )}

                <div className="w-[90%] px-4 py-1 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold mx-auto border-3 border-[#FFD771]">
                    {error && <p>{error.message}</p>}

                    {!report && <p>pas de compte-rendu existant</p>}

                    {report && (
                        <>
                            <div className="flex justify-end items-center">
                                <p className="text-sm">
                                    {report!.child.group.name}
                                </p>
                            </div>
                            <h1 className="">
                                <Image
                                    src="/boutons/calendrier.webp"
                                    alt=""
                                    width={35}
                                    height={25}
                                    className="inline-block m-2"
                                />
                                {new Date(report!.date).toLocaleDateString(
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
                                <p className="text-xs underline text-center my-3">
                                    {" "}
                                    modification Compte-rendu
                                </p>
                                <form onSubmit={handleSubmitForm}>
                                    <label
                                        htmlFor="isPresent"
                                        className="mr-3 mb-3"
                                    >
                                        Présent
                                    </label>
                                    <input
                                        type="checkbox"
                                        id="isPresent"
                                        name="isPresent"
                                        defaultChecked={report.isPresent}
                                        onChange={() =>
                                            setIsPresent(!isPresent)
                                        }
                                    />
                                    <label
                                        htmlFor="staff_comment"
                                        className="w-[70%] block mt-3"
                                    >
                                        Commentaire journée
                                    </label>
                                    <textarea
                                        id="staff_comment"
                                        name="staff_comment"
                                        defaultValue={report.staff_comment!}
                                        disabled={!isPresent}
                                        rows={4}
                                        className={`border-2 border-amber-300 p-2 rounded-lg w-full inline-block mt-1 mb-3 ${isPresent ? "bg-[#FEE8B6]" : "bg-gray-400 cursor-not-allowed"} `}
                                    />
                                    {report.picture && (
                                        <img
                                            src={report.picture}
                                            alt=""
                                            className="border-2 border-amber-300 bg-[#FEE8B6] rounded-lg w-full inline-block mt-3"
                                            loading="lazy"
                                        />
                                    )}
                                    <input
                                        type="text"
                                        name="picture"
                                        aria-label="url photo"
                                        title="url photo"
                                        placeholder="url photo (https://...)"
                                        disabled={!isPresent}
                                        pattern="https://.+"
                                        className={`border-2 border-amber-300 p-2 rounded-lg w-full inline-block my-3 ${isPresent ? "bg-[#FEE8B6]" : "bg-gray-400 cursor-not-allowed"} `}
                                        defaultValue={
                                            report.picture ? report.picture : ""
                                        }
                                    />
                                    {/* <img src={`/babymood/${report.baby_mood}.png`} alt={report.baby_mood} /> */}
                                    <div className="flex justify-between md:justify-center md:gap-4">
                                        <input
                                            type="radio"
                                            name="baby_mood"
                                            id="baby_mood_good"
                                            value="good"
                                            disabled={!isPresent}
                                            defaultChecked={
                                                report.baby_mood === "good"
                                            }
                                        />
                                        <label htmlFor="baby_mood_good">
                                            bonne
                                        </label>
                                        <input
                                            type="radio"
                                            name="baby_mood"
                                            id="baby_mood_average"
                                            value="neutral"
                                            disabled={!isPresent}
                                            defaultChecked={
                                                report.baby_mood === "neutral"
                                            }
                                        />
                                        <label htmlFor="baby_mood_average">
                                            moyen
                                        </label>
                                        <input
                                            type="radio"
                                            name="baby_mood"
                                            id="baby_mood_bad"
                                            value="bad"
                                            disabled={!isPresent}
                                            defaultChecked={
                                                report.baby_mood === "bad"
                                            }
                                        />
                                        <label htmlFor="baby_mood_bad">
                                            difficile
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="text-center mx-auto block border-2 border-amber-300 bg-[#FEE8B6] px-5 py-2 rounded-2xl my-3 text-xl cursor-pointer hover:bg-[#FFF999]"
                                    >
                                        {loading
                                            ? "Modification..."
                                            : "Valider"}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default EditReport;
