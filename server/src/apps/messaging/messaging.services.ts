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
        .select("*, profiles ( username)")
        .single()

        if(messageError) throw messageError
        return messageData
    },

    async getMessageOfLobby(lobbyId:string, page:number = 0):Promise<Messages> {
        
        const from = page * 20
        const to = from + 20 - 1;
        const {data, error} = await supabase
        .from("messages")
        .select("content, created_at, profiles(username)")
        .eq("lobby_id", lobbyId)
        .order("created_at", {ascending: false})
        .range(from, to)

        
        if(error) throw error
        return data as any
    }
    
}