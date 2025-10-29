import supabase from "../../supabase/supabase";

interface Lobby {
  name: string;
  description: string;
  created_at: string;
  game: string;
  skill_level: string;
}

export const LobbyService = {

    async createLobby(name: string, description: string, ownerId: string, game:string, skillLevel:string, ): Promise<Lobby> {
        
        const { data, error} = await supabase
        .from('lobbies')
        .insert({
            name,
            description,
            owner_id: ownerId,
            game,
            skill_level: skillLevel
        })
        .select()
        .single();
        
            if (error) {
                console.error('lobby.services: Supabase create lobby error:', error.message);
                throw error;
            }

            return data as Lobby
    }
}