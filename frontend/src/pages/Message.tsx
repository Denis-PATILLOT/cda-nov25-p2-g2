import { ArrowUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
// Assurez-vous que ce chemin correspond à l'emplacement réel de votre fichier généré
import { useCreateMessageMutation, useGetConversationQuery } from "../graphql/generated/schema";

const MY_USER_ID = 1;

const MessagingPage = ({ conversationId = 1 }: { conversationId?: number }) => {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Utilise la query 'conversation' de votre ConversationResolver
  const { data, loading, refetch } = useGetConversationQuery({
    variables: { id: conversationId },
    pollInterval: 3000,
  });

  // Utilise la mutation 'createMessage' de votre MessageResolver
  const [sendMessage, { loading: isSending }] = useCreateMessageMutation({
    onCompleted: () => {
      setInputValue("");
      refetch();
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const onSendAction = async () => {
    if (!inputValue.trim() || isSending) return;
    await sendMessage({
      variables: {
        data: {
          content: inputValue,
          conversationId: conversationId,
        },
      },
    });
  };

  if (loading && !data) return null;

  // Accès aux messages via la relation OneToMany définie dans Conversation.ts
  const messagesList = data?.conversation?.messages || [];

  return (
    <div
      className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden font-sans"
      style={{ background: "linear-gradient(180deg, #D4EFFF 0%, #EAD6FF 50%, #F3E8FF 100%)" }}
    >
      {/* Header - Logo BabyBoard */}
      <div className="pt-10 px-6 flex flex-col items-center">
        <div className="flex justify-between w-full items-center mb-6">
          <div className="text-3xl font-black italic tracking-tighter">
            <span className="text-[#89D4F1]">Baby</span>
            <span className="text-[#FBAFC1]">Board</span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white">
            <img src="/avatarfille.png" alt="Profil" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Card Enfant */}
        <div className="bg-white/60 backdrop-blur-md rounded-full p-2 pr-12 flex items-center gap-4 border border-white shadow-sm mb-8 w-fit self-start ml-2">
          <div className="w-24 h-24 rounded-full border-[6px] border-[#D1B3FF] overflow-hidden bg-white shadow-inner">
            <img src="/baby_photo.png" alt="Ichem" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[#4B3080] font-bold text-xl leading-tight">Ichem BATTOUR</h2>
            <span className="text-[#4B3080]/60 font-semibold italic text-sm">9 mois</span>
          </div>
        </div>
      </div>

      {/* Conteneur de Chat */}
      <div className="bg-white/95 mx-4 mb-24 rounded-[50px] border-[6px] border-[#F0E6FF] flex-1 flex flex-col overflow-hidden shadow-2xl">
        {/* Filtres Destinataires */}
        <div className="flex gap-3 p-6 pb-2">
          {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button className="bg-[#E6D8FF] text-[#6A5ACD] px-6 py-2 rounded-full text-xs font-black border border-[#D1BFFF]">
            Assistante maternelle
          </button>
          {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button className="bg-white text-gray-300 px-6 py-2 rounded-full text-xs font-black border border-gray-100">
            Directrice
          </button>
        </div>

        {/* Liste des messages typée par author */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messagesList.map((m) => {
            const isMe = m.author.id === MY_USER_ID;
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-5 py-3 rounded-[25px] text-[15px] font-medium leading-snug shadow-sm ${
                    isMe
                      ? "bg-[#EBDDFF] text-[#5D4794] rounded-tr-none"
                      : "bg-[#F9F7FF] text-[#7A7A7A] border border-[#F0EBFF] rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Barre de saisie */}
        <div className="p-5">
          <div className="relative flex items-center bg-[#FDFBFF] rounded-[35px] border-[3px] border-[#F3EFFF] px-6 py-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSendAction()}
              placeholder="Tapez votre message"
              className="bg-transparent w-full py-4 outline-none text-gray-500 placeholder-[#D1C4E9] font-bold text-sm"
            />
            {/** biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              onClick={onSendAction}
              className="bg-[#FFF8BC] p-2.5 rounded-2xl shadow-md active:scale-90 transition-all ml-2"
            >
              <ArrowUp size={24} className="text-[#FFD700] stroke-[4px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Basse */}
      <div className="absolute bottom-0 w-full h-20 bg-white/20 backdrop-blur-xl flex justify-around items-center px-10 border-t border-white/20">
        <img src="/home.png" className="w-8 h-8 opacity-40" alt="Home" />
        <div className="relative">
          <img src="/calendrier.png" className="w-8 h-8" alt="Calendrier" />
          <div className="absolute -top-1 -right-1 bg-[#4ADE80] w-4 h-4 rounded-full border-[3px] border-white shadow-sm" />
        </div>
        <div className="bg-white/80 p-3 rounded-[20px] shadow-sm border border-white">
          <img src="/chat.png" className="w-10 h-10" alt="Chat" />
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
