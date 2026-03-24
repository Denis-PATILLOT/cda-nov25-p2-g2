import Layout from "@/components/Layout";
import { useCreateConversationMutation, useCreateMessageMutation, useCurrentUserConversationsQuery, useGetAdminUserQuery, useGetMessagesFromConversationQuery, useGetStaffUserQuery } from "@/graphql/generated/schema";
import { useAuth } from "@/hooks/CurrentProfile";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

    type Child = {
            __typename?: "Child" | undefined;
            id: number;
            firstName: string;
            lastName: string;
            birthDate: any;
            picture: string;
            group: {
                __typename?: "Group" | undefined;
                id: string;
                name: string;
            };
        } | null | undefined;


const MessagingPage = () => {

    const router = useRouter();

    const {data: adminData} = useGetAdminUserQuery();

    const { user } = useAuth();

    const children: any = user?.children! || null;

    const [selectedChild, setSelectedChild] = useState<Child|null>(null);

    const {data: staffData} = useGetStaffUserQuery({variables : { groupId: Number(selectedChild?.group.id)}});

    const [selectedRole, setSelectedRole] = useState("staff");

    const [messageToSend, setMessageToSend] = useState<string>("");

    const {data, error, refetch: refetchMyConversations} = useCurrentUserConversationsQuery({fetchPolicy:"cache-and-network"}); // on veut éviter le cache à ce niveau afin d'avoir les bonnes conversations du parent connecté

    // création conversation pour une concversation non créée de base avec un staff ou directrice
    const [createConversation, {error: errorCreateConversation}] = useCreateConversationMutation();

    const conversationsList = data?.myConversations || [];

    // conversation chargée selon le rôle choisie entre l'assistante et la directrice
    const conversationFiltered = conversationsList.find(selectedRole === "admin" ? 
        conversation => conversation.initiator.role === selectedRole || conversation.participant.role === selectedRole
        :
        conversation => ((conversation.initiator.role === selectedRole && conversation.initiator.group?.id === selectedChild?.group.id) || (conversation.participant.role === selectedRole && conversation.participant.group?.id === selectedChild?.group.id)));
    
    
    const {data: messagesData, error: messagesError, refetch} = useGetMessagesFromConversationQuery({variables: {conversationId: Number(conversationFiltered?.id)}, pollInterval: 5000, fetchPolicy:"cache-and-network"});

    const messages = messagesData?.messagesFromConversation;

    const handleChildChange = () => {
        const currentIndex = children.findIndex((child:any) => child.id === selectedChild?.id);
        currentIndex + 1 === children.length ? setSelectedChild(children[0]) : setSelectedChild(children[currentIndex+1]);
    };

    // hauteur du textarea en fonction du contenu
    const textareaMessage = useRef<HTMLTextAreaElement|null>(null);
    
    const handleInput = () => {
        textareaMessage.current!.style.height = "40px";
        textareaMessage.current!.style.height = textareaMessage.current!.scrollHeight + "px";
    }

    // création d'un message pour l'utilisateur connecté
    const [createMessage, {error: errorMessageCreation}] = useCreateMessageMutation();
    
    // soumission d'un message envoyé
    const handleSubmitForm = async(e:any) => {
        e.preventDefault();
        console.log("formulaire d'envoi message soumis");

        if(!conversationFiltered) {
            console.log("conversation non créée !");
            if (selectedRole === "admin") {
                const result = await createConversation({variables: {
                    initiatorId: Number(user?.id),
                    participantId: Number(adminData?.getAdminUser.id)
                }});
                if(result.data?.createConversation?.id) {
                    createMessage({variables: {
                        data: {
                            content: messageToSend.trim(),
                            conversationId: Number(result.data.createConversation.id)
                        }
                    }});
                    await refetchMyConversations();
                    setMessageToSend("");
                }
            }
            else if (selectedRole === "staff") {
                const result = await createConversation({variables: {
                    initiatorId: Number(user?.id),
                    participantId: Number(staffData?.getStaffUser.id)
                }});
                if(result.data?.createConversation?.id) {
                    createMessage({variables: {
                        data: {
                            content: messageToSend.trim(),
                            conversationId: Number(result.data.createConversation.id)
                        }
                    }});
                    await refetchMyConversations();
                    setMessageToSend("");
                } 
            }
        } else {
            createMessage({variables: {
            data: {
                content: messageToSend.trim(),
                conversationId: Number(conversationFiltered?.id)
            }
            }});
            await refetch();
            textareaMessage.current!.style.height = "40px"; // hauteur par défaut
            setMessageToSend("");
        }
    }
    
    // sélection de l'enfant lors chargement page après récupération de l'utilisateur courant
    useEffect(() => {
        setSelectedChild(Array.isArray(children) ? children[0] : null);
    },[user]);

    // scroll auto en bas de la conversation lors du chargement des messages de celle-ci
    useEffect(() => {
        window.scrollTo({ top: window.document.documentElement.offsetHeight, left: 0, behavior: "smooth" })
    },[messagesData]);

    return (
        <Layout pageTitle="Parent - messages">
    
        {selectedChild && 
            <div className="w-full flex justify-start items-center mt-5 mb-8 text-[#1b3c79]">
                <img src={selectedChild.picture} alt={`picture of ${selectedChild.firstName} ${selectedChild.lastName}`} className="h-[130px] w-[130px] ml-5 object-cover rounded-[50%] border-3 border-[#D58FFF] absolute" /> 
                <p className="w-[67%] h-[100px] rounded-4xl bg-[#FEF9F6] border-3 border-[#D58FFF] ml-25 text-center pt-3 pl-5 flex justify-end">
                    <span className="inline-block w-[90%] text-left pl-5 relative">
                        {selectedChild.firstName} {selectedChild.lastName}
                        <br />
                        {selectedChild.group.name}
                        <br />
                        {new Date(selectedChild.birthDate).toLocaleDateString("fr-FR", {})}
                        {children && children.length > 1 && <img src="/admin/flechedroite.png" alt="" width={40} title="enfant suivant" className="inline-block ml-10 absolute bottom-[-10] right-3 cursor-pointer" onClick={handleChildChange} /> }
                    </span>
                </p>
            </div>
        }

        <div className="bg-[#FEF9F6] mx-2 rounded-[30px] border-3 border-[#D58FFF] flex flex-col shadow-2xl">
            <div className="flex justify-evenly gap-3 mt-5">
            <button className={`${selectedRole === "staff" ? "text-[#1B3C79] px-4 py-3 bg-[#EFD4FF] rounded-full text-[14px] border-2 border-[#D58FFF] text-nowrap" : "text-[#1B3C79] px-3 rounded-full text-[12px] h-8 border border-[#D58FFF] text-nowrap self-center"} cursor-pointer`}
                onClick={() => setSelectedRole("staff")}
            >
                Assistante maternelle
            </button>
            <button className={`${selectedRole === "admin" ? "text-[#1B3C79] px-4 py-3 bg-[#EFD4FF] rounded-full text-[14px] border-2 border-[#D58FFF] text-nowrap" : "text-[#1B3C79] px-3 rounded-full text-[12px] h-8 border border-[#D58FFF] text-nowrap self-center"} cursor-pointer`}
                onClick={() => setSelectedRole("admin")}
            >
                Directrice
            </button>
            </div>

            {/* Liste des messages typée par author */}
            <div className="flex flex-col p-6 min-h-[275px]">
            {!conversationFiltered && <p>aucune conversation existante</p>}
            {conversationFiltered && conversationFiltered.messages.length === 0 && <p>pas de message actuellement</p>}
            {conversationFiltered && messages && messages.map(m => 
                <>
                    <span className={`${m.author.id === user?.id ? "text-end mr-1" : "text-start ml-1"} text-[0.6em] text-[#1B3C79] mt-3`}>{new Date(m.date).toLocaleDateString("FR-fr", {hour:"2-digit", minute:"2-digit"})}</span>
                    <div className={`w-fit text-start text-[#1B3C79] text[1em] border-2 px-2 py-1 rounded-xl mb-1 ${ m.author.id === user?.id ? "bg-[#EFD4FF] border-[#D58FFF] self-end" : "bg-[rgba(239,212,255,0.28)] border-[#d68fff33] self-start"}`}>{m.content}
                    </div>
                </>
            )}
            </div>

            {/* Barre de saisie */}
            <form onSubmit={handleSubmitForm} className="relative flex items-center text-[#1B3C79] bg-[#FEF9F6] rounded-[35px] border-3 border-[#D58FFF] px-6 py-2 mx-2 my-3" >
                <textarea name="message" placeholder="tapez votre message..." title="message" ref={textareaMessage} className="w-full h-10 outline-0 pt-2 resize-none" value={messageToSend} onChange={e => setMessageToSend(e.target.value)} onInput={handleInput} />
                <button type="submit" disabled={!messageToSend}>
                    <img src="/boutons/fleche.png" width={40} className={`opacity-70 ${!messageToSend ? "cursor-not-allowed" : "cursor-pointer hover:opacity-100"}`}  title="envoyer message" />
                </button>
            </form>
        </div>
        </Layout>
    );
};

export default MessagingPage;