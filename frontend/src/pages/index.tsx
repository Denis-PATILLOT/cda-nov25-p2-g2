import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import { type LoginInput, useLoginMutation } from "@/graphql/generated/schema";
import { useAuth } from "@/hooks/CurrentProfile";

export default function Home() {
  const router = useRouter();

  const { user, isAuthenticated, isAdmin, isStaff, isParent, refetch } = useAuth();

  // redirection selon le rôle
  useEffect(() => {
    if (user && isAuthenticated) {
      if (isAdmin) router.push("/admin");
      if (isStaff) router.push("/staff");
      if (isParent) router.push("/parent");
    }
  }, [user, isAuthenticated, isAdmin, isStaff, isParent, router]);

  const [login, { loading: isSubmitting, error }] = useLoginMutation();

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();

  const onSubmit = async (data: LoginInput) => {
    try {
      console.log("loginform is submitting");
      await login({ variables: { data } });
      await refetch();
    } catch (err) {
      setErrorSubmit(true);
      console.error(err);
    }
  };

  const handleClickEye = () => {
    setVisiblePassword((prev) => !prev);
  };

  return (
    <Layout pageTitle="Accueil">
      <img src="/babyboardlogo.png" alt="logo" className="md:w-[40%] md:m-auto md:max-w-[600px]" />

      {errorSubmit && error && (
        <p className="text-red-500 text-center px-5 mx-5 alert bg-red-100 border border-red-500 absolute top-5 left-0 right-0 md:top-5 md:text-xl md:mx-52">
          {error.message || "Une erreur est survenue..."}
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              className="h-6 w-6 cursor-pointer fill-current text-red-500"
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

      <div className="mx-auto mt-15 max-w-[400px] p-4 md:mt-0 md:max-w-[600px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center text-[#1b3c79] md:relative md:bottom-10"
        >
          {/* EMAIL */}
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
            className={`mb-2 w-[75%] rounded-4xl bg-[#d4efff] px-2 py-3 text-center text-xl md:mb-6 md:rounded-[50] md:py-6 md:text-4xl ${
              errors.email ? "focus-visible:outline-2 focus-visible:outline-red-500" : ""
            }`}
          />

          <p className="mb-1 text-red-500">{errors.email?.message}</p>

          {/* PASSWORD */}
          <div className="relative flex w-full flex-col items-center">
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
                    "Le mot de passe doit contenir minuscule, majuscule, chiffre et caractère spécial",
                },
              })}
              type={visiblePassword ? "text" : "password"}
              placeholder="Mot de passe"
              title="Mot de passe"
              className="w-[75%] rounded-4xl bg-[#d4efff] px-2 py-3 text-center text-xl md:rounded-[50] md:py-6 md:text-4xl"
            />

            <img
              src={visiblePassword ? "/closeeye.png" : "/openeye.png"}
              alt="Afficher mot de passe"
              className="absolute right-15 top-1 w-[30px] cursor-pointer md:right-25 md:w-[48px]"
              onClick={handleClickEye}
            />

            <p className="my-2 w-[70%] text-center text-red-500">{errors.password?.message}</p>

            <Link href="/" className="hover:underline">
              <p className="text-[16px] md:text-2xl">mot de passe oublié ?</p>
            </Link>
          </div>

          {/* BOUTON LOGIN */}
          <input
            type="submit"
            value={isSubmitting ? "Connexion..." : "Se connecter"}
            disabled={isSubmitting}
            className="mt-18 mb-2 w-[65%] rounded-4xl border-2 border-transparent bg-[#d4efff] px-2 py-3 text-center text-xl hover:cursor-pointer hover:border-[#88D3FF] md:w-[75%] md:rounded-[50] md:py-5 md:text-4xl"
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
