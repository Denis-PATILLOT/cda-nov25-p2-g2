import Layout from "@/components/Layout";
import { useCreateMessageMutation, useGetConversationQuery } from "@/graphql/generated/schema";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Conversation = () => {
  const router = useRouter();
  const {conversationId} = router.query;

  const { user, isAdmin } = useAdminGuard();

  const {data, error} = useGetConversationQuery({variables : {conversationId: Number(conversationId)}, pollInterval: 5000, fetchPolicy:"cache-and-network"})

  const parent = data?.conversation?.initiator.id !== user?.id ? data?.conversation?.initiator : data?.conversation?.participant;
  const conversation =  data?.conversation || null;

  // state de message à saisir - admin
  const [messageToSend, setMessageToSend] = useState<string>("");

  // hauteur du textarea en fonction du contenu
  const textareaMessage = useRef<HTMLTextAreaElement|null>(null);
  
  const handleInput = () => {
      textareaMessage.current!.style.height = "40px";
      textareaMessage.current!.style.height = textareaMessage.current!.scrollHeight + "px";
  }

  // création d'un message pour l'admin
  const [createMessage, {error: errorMessageCreation}] = useCreateMessageMutation();
  
  // soumission d'un message envoyé
  const handleSubmitForm = async (e:any) => {
    e.preventDefault();
    console.log("formulaire d'envoi message soumis");
  
    createMessage({variables: {
      data: {
        content: messageToSend.trim(),
        conversationId: Number(conversationId)
      }
    }});
    textareaMessage.current!.style.height = "40px"; // hauteur par défaut
    setMessageToSend("");
  };
  
  
  // scroll auto en bas de la conversation lors du chargement des messages de celle-ci
  useEffect(() => {
      window.scrollTo({ top: window.document.documentElement.offsetHeight, left: 0, behavior: "smooth" })
  },[data]);


  if(user && isAdmin)
  return <Layout pageTitle="Conversation - Admin">
      <div className="mx-auto w-full max-w-[420px] px-4 pt-2 pb-1 md:max-w-none md:px-16 md:pt-0 lg:px-24">
        <div className="relative flex items-center justify-between md:mt-20">
       
          <button type="button" onClick={() => router.push("/admin/parents/conversations")} className="p-0">
            <div className="h-10 w-10 overflow-hidden flex items-center justify-center md:h-20 md:w-20">
              <img
                src="/admin/flechegauche.png"
                alt="Retour"
                className="h-16 w-16 md:h-28 md:w-28"
              />
            </div>
          </button>
          
          <h1 className="text-[16px] font-semibold md:absolute md:left-1/2 md:-translate-x-1/2 md:text-[28px]">
            {parent &&  `Conversation ${parent.first_name} ${parent.last_name}`}
          </h1>
          
        </div>

        {error && (
          <p className="mt-6 text-center text-[13px] text-red-600 md:text-[18px]">
            {error.message || "Erreur lors du chargement..."}
          </p>
        )}

        { !error && parent && (
          <div className="mt-4 flex flex-col gap-3 mb-8 md:gap-6 md:mt-8">
            <div key={parent?.id} className="relative rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-3 py-3 shadow-md md:px-6 md:py-5 md:rounded-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-5">
                  <img src={parent.avatar ?? "/admin/parentavatar.png"} alt={`${parent.first_name} ${parent.last_name}`} className="h-12 w-12 rounded-full object-cover border-2 border-(--color-primary) shrink-0 md:h-20 md:w-20" />
                  <span className="text-[14px] font-semibold md:text-[20px]">
                    {parent.first_name} {parent.last_name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 min-h-[320px] flex flex-col gap-5 md:gap-6 md:mt-8">
        {conversation && conversation.messages.map(m => 
          m.author.id === user.id ?
            <div key={m.id} className="self-end rounded-2xl bg-white/80 border-2 border-(--color-secondary) px-3 py-3 pl-10 shadow-md md:px-6 md:py-5 md:rounded-3xl md:w-[50%]">
                {m.content}
                <span className="block text-right text-xs italic">{new Date(m.date).toLocaleDateString("FR-fr", {hour:"2-digit", minute:"2-digit"})}</span>
            </div>
            :
            <div key={m.id} className="self-start rounded-2xl bg-white/80 border-2 border-(--color-primary) px-3 py-3 pr-10 shadow-md md:px-6 md:py-5 md:rounded-3xl md:w-[50%]">
                {m.content}
                <span className="block text-right text-xs italic">{new Date(m.date).toLocaleDateString("FR-fr", {hour:"2-digit", minute:"2-digit"})}</span>
            </div>
          )
        }
        </div>

        {/* Barre de saisie */}
        <form onSubmit={handleSubmitForm} className="w-full flex items-center text-[#1B3C79] bg-white/80 border-2 border-(--color-secondary) rounded-[35px] px-6 py-2 mt-5 mb-2" >
            <textarea name="message" placeholder="tapez votre message..." title="message" ref={textareaMessage} className="w-full h-10 outline-0 pt-2 resize-none" value={messageToSend} onChange={e => setMessageToSend(e.target.value)} onInput={handleInput} />
            <button type="submit" disabled={!messageToSend}>
                <img src="/boutons/fleche.png" width={40} className={`opacity-70 ${!messageToSend ? "cursor-not-allowed" : "cursor-pointer hover:opacity-100"}`}  title="envoyer message" />
            </button>
        </form>
      </div>
  </Layout>
};

export default Conversation;
