import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import { useCurrentUserConversationsQuery } from "@/graphql/generated/schema";
import { useAuth } from "@/hooks/CurrentProfile";
import Link from "next/link";
import { useRouter } from "next/router";

const ConversationPage = () => {
  
  const router = useRouter();
  const { user, group, isAuthenticated, isStaff } = useAuth();

  const {data, loading, error} = useCurrentUserConversationsQuery();
  
  if(data) {
    return(
      <Layout pageTitle="Staff - plannings">
        <div className="max-w-full mx-auto md:max-w-[600px]">
          
          <div className="w-[90%] p-4 bg-[#FEF9F6] rounded-2xl text-[#1b3c79] font-semibold text-center border-3 min-h-[600px] border-[#FFD771] mx-auto">
              <h1 className="text-start">
                <img src={"/boutons/chat.png"} width={100} className="inline"/>Conversations
                </h1>
              <Link href="/staff/conversation/create" className="opacity-70 hover:opacity-100 hover:underline" title="créer une conversation">
                <p className="text-xs text-start ">
                  <img src="/boutons/plus.png" alt="" width={40} className="inline-block opacity-75"/>Créer une conversation  
                </p>  
              </Link>
              <div className="flex w-full flex-wrap justify-start gap-3 mt-5">
                {loading && Loader()}
                {error && <p>{error.message}</p>}
                {data?.myConversations?.length === 0 && <p>Aucune conversation existante</p>}
                {user && data!.myConversations!.length > 0 && data!.myConversations!.map(conversation => 
                <Link href={`/staff/conversation/${conversation.id}`} className="w-[90%] bg-[#FEF9F6] border-[#FFD771] border-2 mx-auto rounded-2xl p-1 cursor-pointer hover:bg-[#FFD888]">
                    <div>
                      {/* affiche le nom avec qui a lieu la conversation */}
                      <p>{conversation.initiator.id === user.id ? `${conversation.participant.first_name} ${conversation.participant.last_name }`  : `${conversation.initiator.first_name} ${conversation.initiator.first_name} `}</p>
                      <p className="text-sm">{conversation.initiator.id === user.id ? `(${conversation.participant.children?.filter(c => c.group.id === user.group?.id).map(c =>  c.firstName + " " + c.lastName) })`  : `(${conversation.initiator.children?.filter(c => c.group.id === user.group?.id).map(c =>  c.firstName + " " + c.lastName) })` }</p>
                    </div>
                  </Link>
                )}
              </div>
          </div>
        </div>
      </Layout>
    ); 
  };
}

export default ConversationPage;
