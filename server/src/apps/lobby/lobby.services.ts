import supabase from "../../supabase/supabase";

interface Lobby {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  created_at: string;
  game: string;
  skill_level: string;
  max_participants: number;
  tags: string[];
}

export interface LobbyDisplay extends Lobby{
  participant_count: number;
  owner_username: string | null;
  lobby_participants: any[];
  profiles: {username: string} | null;
}

export const LobbyService = {
  async createLobby(
    name: string,
    description: string,
    ownerId: string,
    game: string,
    skillLevel: string,
    maxParticipants: number,
    tags: string[]
  ): Promise<Lobby> {
    const { data, error } = await supabase
      .from("lobbies")
      .insert({
        name,
        description,
        owner_id: ownerId,
        game,
        skill_level: skillLevel,
        max_participants: maxParticipants,
        tags
      })
      .select()
      .single();

    if (error) {
      console.error(
        "lobby.services: Supabase create lobby error:",
        error.message
      );
      throw error;
    }

    return data as Lobby;
  },

  async getLobbies(): Promise<LobbyDisplay[]> {
    const { data, error } = await supabase.rpc('get_lobbies_with_counts');

    if (error) {
      console.error(
        "lobby.services: Supabase get lobbies error:",
        error.message
      );
      throw error;
    }

    return (data as any) || [];
  },
};
