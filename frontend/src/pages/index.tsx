import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/CurrentProfile";
import { type LoginInput, useLoginMutation } from "@/graphql/generated/schema";

export default function Home() {
  const router = useRouter();
  // hook 'useAuth' pour récupération infos user connecté
  const { user, isAuthenticated, isAdmin, isStaff, isParent, refetch } = useAuth();

  // redirection en fn du role si logué
  if (user && isAuthenticated) {
    isAdmin && router.push("/admin");
    isStaff && router.push("/staff");
    isParent && router.push("/parent");
  }

  // hook pour login
  const [login, { loading: isSubmitting, error }] = useLoginMutation();

  // gestion visibilité input password
  const [visiblePassword, setVisiblePassword] = useState(false);
  // gestion du message d'erreur en retour de login
  const [errorSubmit, setErrorSubmit] = useState(false);

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();

  // soumission formulaire de login
  const onSubmit = async (data: LoginInput) => {
    try {
      console.log("loginform is submitting");
      await login({ variables: { data } });
      await refetch(); // récupération des données user après connection, pour avoir ensuite la redirection
    } catch (err) {
      setErrorSubmit(true); // permet affichage erreur et sa disparition
      console.error(err);
    }
  };

  const handleClickEye = () => {
    setVisiblePassword((prev) => !prev);
  };

  return (
    <Layout pageTitle="Accueil">
      <img src="/babyboardlogo.png" className="md:w-[40%] md:m-auto md:max-w-[600px]" />
      {errorSubmit && error && (
        <p className="text-red-500 text-center px-5 mx-5 alert bg-red-100 border border-red-500 absolute top-5 left-0 right-0 md:top-5 md:text-xl md:mx-52">
          {error.message || "Une erreur est survenue lors de la connexion"}
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
      <div className="p-4 max-w-[400px] mx-auto mt-15 md:max-w-[600px] md:mt-0">
        {/* erreur de récupération de données ou echec login */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center text-[#1b3c79] md:relative md:bottom-10"
        >
          {/* 1er champ email */}
          <input
            {...register("email", {
              required: "email requis",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "email non valide",
              },
            })}
            placeholder="Email"
            title="Email"
            className={`text-xl text-center bg-[#d4efff] rounded-4xl px-2 py-3 w-[75%] mb-2 md:text-4xl ${errors.email ? "focus-visible:outline-2 focus-visible:outline-red-500" : ""} md:rounded-[50] md:py-6 md:mb-6`}
          />
          <p className="text-red-500 mb-1">{errors.email?.message}</p>

          {/* 2eme champ password */}
          <div className="flex flex-col m-auto items-center relative rounded-4xl w-full  mb-0">
            <input
              {...register("password", {
                required: "mot de passe requis",
                minLength: {
                  value: 8,
                  message: "Le mot de passe doit contenir au moins 8 caractères",
                },
                maxLength: {
                  value: 128,
                  message: "Le mot de passe ne peut pas dépasser 128 caractères",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial",
                },
              })}
              type={visiblePassword ? "text" : "password"}
              placeholder="Mot de passe"
              title="Mot de passe"
              className={`text-xl text-center bg-[#d4efff] rounded-4xl px-2 py-3 w-[75%]  mb-0 ${errors.email ? "focus-visible:outline-2 focus-visible:outline-red-500" : ""} md:text-4xl md:rounded-[50] md:py-6`}
            />
            {visiblePassword ? (
              <img
                src="/closeeye.png"
                alt=""
                className="w-[30px] absolute right-15 top-1 md:right-25 md:top-1 md:w-[48px] cursor-pointer"
                onClick={handleClickEye}
              />
            ) : (
              <img
                src="/openeye.png"
                alt=""
                className="w-[30px] absolute right-15 top-1 md:right-25 md:top-1 md:w-[48px] cursor-pointer"
                onClick={handleClickEye}
              />
            )}
            <p className="text-red-500 my-2 w-[70%] text-center">{errors.password?.message}</p>

            <Link href="/" className="hover:underline">
              <p className="text-[16px] md:text-2xl">mot de passe oublié ?</p>
            </Link>
          </div>

          <input
            type="submit"
            value={isSubmitting ? "Connexion..." : "Se connecter"}
            disabled={isSubmitting}
            className="text-xl text-center bg-[#d4efff] rounded-4xl px-2 py-3 w-[65%] mt-18 mb-2 border-2 border-transparent hover:cursor-pointer hover:border-2 hover:border-[#88D3FF] md:text-4xl md:rounded-[50] md:py-5 md:w-[75%]"
          />
          <p className="text-[16px] md:text-2xl">
            Besoin d'aide ?{" "}
            <Link href="/" className="hover:underline">
              Contact crèche
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
}
