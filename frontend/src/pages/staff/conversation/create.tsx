import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import { useChildrenByGroupQuery, useCreateConversationMutation, useCurrentUserConversationsQuery } from "@/graphql/generated/schema";
import { useAuth } from "@/hooks/CurrentProfile";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const CreateConversationPage = () => {
  
  const router = useRouter();
  const { user, group } = useAuth();

  const { data, loading, error} = useChildrenByGroupQuery({variables: { groupId: Number(group?.id)}});

  const [createConversation ] = useCreateConversationMutation();

  const [errorMessage, setErrorMessage] = useState<any|undefined>();
  
  const handleClickButton = async(e:any, parentId: number) => {
    if(user)
    try {
      e.preventDefault();
      console.log("user courant : ", user?.id);
      console.log("parent id : ", parentId);
      const {data } = await createConversation({
        variables: {
          initiatorId: Number(user.id),
          participantId: Number(parentId)
        }
      });

      if(data?.createConversation.id) router.push(`/staff/conversation/${data.createConversation.id}`);

    } catch(err:any) {
      setErrorMessage(err)
    }
    
  }

  // useEffect(() =>
  //   setErrorMessage(errorConversation?.message) // on passe la valeur de l'erreur en création de la conversation pour l'afficher
  // ,[errorConversation])

  if(data && group) {
    return(
      <Layout pageTitle="Staff - plannings">
        <div className="max-w-full mx-auto md:max-w-[600px]">
          {errorMessage && 
            <p className="text-red-500 text-center px-5 mx-5 my-3 alert bg-red-100 border border-red-500 relative md:top-5 md:text-xl md:mx-52">
              {errorMessage.errors[0].extensions.code === "FORBIDDEN" && errorMessage.message.includes("conversation already exists") && "Cette conversaiton existe déjà"}
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg
                className="h-6 w-6 cursor-pointer fill-current text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                onClick={() => setErrorMessage(undefined)}
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
            </p>
          }
          
          <div className="w-[90%] p-4 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold text-center border-3 min-h-[600px] border-[#FFD771] mx-auto">
              <h1 className="text-start">
                <img src={"/boutons/chat.png"} width={100} className="inline"/>Parents {group.name}
                </h1>
              
              <div className="w-full text-start">
                {loading && Loader()}
                {error && <p>{error.message}</p>}
                {data.childrenByGroup.length === 0 && <p>Aucun enfant pour ce groupe</p>}
                
                {data.childrenByGroup.length > 0 && data.childrenByGroup.map(child => 
                    <div className="bg-[#fdf4e6]  border-[#FFD771] border-2" key={child.firstName + child.lastName}>
                      <div className="bg-amber-50 px-15 py-2 border-b-2 border-[#FFD771] text-center">{child.firstName} {child.lastName}</div>
                        <ul>
                        {child.parents.map(parent =>
                            <Link key={parent.id} href="#" className="cursor-pointer" onClick={(e) => handleClickButton(e, parent.id)}>
                                <li className="text-start ml-3 my-2 block">
                                    <img src={"/admin/flechedroite.png"} width={30} className="inline-block" /> 
                                    <span className="p-1.5 rounded-2xl hover:text-white hover:bg-[#FFD771]">
                                      {parent.first_name} {/* */} {parent.last_name}
                                    </span>
                                </li>
                            </Link>
                        )}
                        </ul>
                    </div>
                    
                )}
                </div>
              </div>
          </div>
      </Layout>
    ); 
  };
}

export default CreateConversationPage;
