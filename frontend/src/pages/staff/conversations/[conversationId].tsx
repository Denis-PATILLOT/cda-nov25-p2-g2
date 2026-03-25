import Footer from "@/components/Footer";
import Layout from "@/components/Layout";
import { useCreateMessageMutation, useGetConversationQuery } from "@/graphql/generated/schema";
import { useAuth } from "@/hooks/CurrentProfile";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";


const ConversationId = () => {
    const router = useRouter();
    const { conversationId } = router.query;

    const {user, isAuthenticated, group, } = useAuth();

    const {data, loading, error, refetch} = useGetConversationQuery({variables: {conversationId: Number(conversationId)}, pollInterval: 5000, fetchPolicy:"cache-and-network"}); // pour avoir les bonnes données de messages (ordre respecté)

    // création d'un message pour l'utilisateur connecté
    const [createMessage, {error: errorMessageCreation}] = useCreateMessageMutation();

    const [messageToSend, setMessageToSend] = useState<string>("");

    const handleSubmitForm = async(e:any) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("formulaire message soumis");
        
        createMessage({variables: {
            data: {
                content: messageToSend.trim(),
                conversationId: Number(conversationId)
            }
        }});
        await refetch();
        textareaMessage.current!.style.height = "40px"; // hauteur par défaut
        setMessageToSend("");
        
    }
  
    // hauteur du textarea en fonction du contenu
    const textareaMessage = useRef<HTMLTextAreaElement|null>(null);
    
    const handleInput = () => {
        textareaMessage.current!.style.height = "40px";
        textareaMessage.current!.style.height = textareaMessage.current!.scrollHeight + "px";
    }

    useEffect(() => { // scroll en bas à l'ouverture de la conversation après chargement données
        window.scrollTo({ top: window.document.documentElement.offsetHeight, behavior: "smooth" })
    },[data]); 

    if(user && isAuthenticated) {
        return( 
            <Layout pageTitle={`Staff - conversation ${conversationId}`} >
                <div className="max-w-full mx-auto md:max-w-[1000px]">
                    <h1 className="w-[90%] mx-auto text-center text-lg text-[#1b3c79] font-bold">Conversation  - {data && data.conversation!.initiator.id === user.id ? data.conversation?.participant.first_name + " " + data.conversation?.participant.last_name  : data && data.conversation?.initiator.first_name + " " + data.conversation?.initiator.last_name }</h1>
                    <p className="text-sm text-center mb-2 text-[#1b3c79]">{data?.conversation?.initiator.id === user.id ? `parent de ${data.conversation.participant.children?.filter(c => c.group.id === user.group?.id).map(c =>  c.firstName + " " + c.lastName) }`  : `parent de ${data?.conversation?.initiator.children?.filter(c => c.group.id === user.group?.id).map(c =>  c.firstName + " " + c.lastName) }` }</p>
                    <div className="w-[90%] p-4 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold text-center border-3 min-h-[500px] border-[#FFD771] mx-auto">
                    
                    {/* {loading && <p>Chargement de la conversation...</p>}  à enlever sinon ça fait sauter l'affichage tous les refetch*/} 
                    
                    {error && <p>{error.message}</p>}
                    
                    {data?.conversation &&
                    <p className="text-left text-[0.7em]">créée le {new Date(data?.conversation?.creationDate).toLocaleDateString()} par {data.conversation.initiator.first_name}</p>
                    }
                    <div className="flex flex-col min-h-[420px] my-2 md:min-h-[580px]">
                    {data?.conversation?.messages?.length && data?.conversation?.messages?.length > 0 ?
                                data.conversation.messages.map(m => 
                                    <Fragment key={m.author+m.date}>
                                        <span className={`${m.author.id === user.id ? "text-end mr-1" : "text-start ml-1"} text-[0.6em] mt-3`}>{new Date(m.date).toLocaleDateString("FR-fr", {hour:"2-digit", minute:"2-digit"})}</span>
                                        <div className={`w-fit text-start  border-[#FFD771] border-2 px-2 py-1 rounded-xl mb-5 md:text-xl md:p-3 ${ m.author.id === user.id ? "bg-amber-200 self-end" : "bg-yellow-100 self-start"}`}>{m.content}
                                        </div>
                                    </Fragment>
                                    
                                ) : 
                                <div className="text-end min-h-[410px] italic mt-3">aucun message actuellement</div>
                    }
                    </div>
                    <div className="border-2 border-[#FFD771] rounded-2xl">
                        <form className="flex px-2" onSubmit={handleSubmitForm}>
                            <textarea name="message" placeholder="tapez votre message..." title="message" ref={textareaMessage} className="w-full h-10 outline-0 pt-2 resize-none" value={messageToSend} onChange={e => setMessageToSend(e.target.value)} onInput={handleInput} />
                            <button type="submit" disabled={!messageToSend}>
                                <img src="/boutons/fleche.png" width={30} className={`opacity-60 ${!messageToSend ? "cursor-not-allowed" : "cursor-pointer hover:opacity-100"}`}  title="envoyer message" />
                            </button>
                        </form>
                    </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default ConversationId;
