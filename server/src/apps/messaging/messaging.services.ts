import supabase from "../../supabase/supabase";

interface Messages{
    content: string;
    senderId: string;
    lobbyId: string;
}

export const MessagingServices = {

    async sendMessage(content: string, senderId:string, lobbyId: string ): Promise<Messages> {

        const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
            content,
            sender_id: senderId,
            lobby_id: lobbyId
        })
        .select()
        .single()

        if(messageError) throw messageError
        return messageData

    }
    
}