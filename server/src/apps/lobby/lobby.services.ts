import supabase from "../../supabase/supabase";

interface createLobbyResult {
    lobby: object;
}


export const LobbyService = {

    async createLobby(name: string, description: string, ownerId: string): Promise<createLobbyResult> {
        
        const { data: lobbyData, error} = await supabase
            .from('lobbies')
            .insert({
                name,
                description,
                owner_id: ownerId,
            })
            .select()
            .single();
        
            if (error) {
                console.error('lobby.services: Supabase create lobby error:', error.message);
                throw error;
            }

            return { lobby: lobbyData }
    }
}