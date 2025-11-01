import supabase from "../../supabase/supabase";

// ... (Your Lobby, LobbyDisplay, and JoinLobby interfaces are fine) ...
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

interface LobbyDisplay extends Lobby{
participant_count: number;
owner_username: string | null;
lobby_participants: any[];
profiles: {username: string} | null;
}

interface JoinLobby {
participant: any[]; 
newParticipant: {userId: string, profiles:{username:string}},
count: number;
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

 
  async joinLobby(
    userId: string,
    lobbyId: string,
    username: string 
  ): Promise<JoinLobby> { // Correct return type

    // 1. Handle the join/rejoin logic
    const { data: existingParticipant, error: checkError } = await supabase
      .from("lobbies_participants")
      .select("id, is_active")
      .eq("user_id", userId) 
      .eq("lobby_id", lobbyId) 
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (existingParticipant) {
      //handle rejoining
      if (!existingParticipant.is_active) {
        const { error: updateError } = await supabase
          .from("lobbies_participants")
          .update({ is_active: true, left_at: null })
          .eq("id", existingParticipant.id);
        if (updateError) throw updateError;
      }
    } else {
      
      const { error: insertError } = await supabase
        .from("lobbies_participants")
        .insert({
          user_id: userId, 
          lobby_id: lobbyId,
          is_active: true,
        });
      
      if (insertError && insertError.code !== '23505') {
        throw insertError;
      }
    }

    const { data: participantsList, error: listError } = await supabase
      .from("lobbies_participants")
      .select(`user_id, profiles ( username )`)
      .eq("lobby_id", lobbyId)
      .eq("is_active", true);

    if (listError) throw listError;

    const { count, error: countError } = await supabase
      .from('lobbies_participants')
      .select('*', { count: 'exact', head: true })
      .eq('lobby_id', lobbyId)
      .eq('is_active', true);
    
    if (countError) throw countError;


    return {
      participant: participantsList || [],
      newParticipant: { userId, profiles: { username } },
      count: count ?? 0
    };
  },
  
  async leaveLobby(userId: string, lobbyId: string): Promise<{count:number}> {
     const { error: updateError } = await supabase
      .from('lobbies_participants')
      .update({ 
        is_active: false, 
        left_at: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .eq('lobby_id', lobbyId)
      .eq('is_active', true);
    
      if (updateError) throw updateError;
      const {count, error} = await supabase
    .from('lobbies_participants')
    .select('*', {count: 'exact', head:true})
    .eq('lobby_id', lobbyId)
    .eq('is_active', true);

    if(error) throw error

    return { count: count ?? 0 };
  }

};