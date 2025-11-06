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
newParticipant: any,
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
    // Note: The 'username' parameter is removed,
    // as we will fetch the full, fresh profile from the database.
  ): Promise<JoinLobby> {
    const {error: JoiningError} = await await supabase
      .from("lobbies_participants")
      .upsert({
        user_id: userId,
        lobby_id: lobbyId,
        is_active: true,   // This will update on re-join
        left_at: null     // This will update on re-join
      },{
        onConflict: 'user_id, lobby_id', // The constraint you just added
        ignoreDuplicates: false // This forces the UPDATE on re-join
      })

      if(JoiningError) {
        console.error("Lobby upsert error:", JoiningError);
        throw JoiningError}

      const { data: newParticipantProfile, error: profileError } = await supabase
      .from("profiles")
      .select(`*`) // Get all profile info
      .eq("id", userId) // Use 'user_id' as fixed before
      .single();

    if (profileError) {
      console.error("Could not fetch new participant profile:", profileError);
      throw profileError;
    }
    
    const newParticipant = {
      user_id: userId,
      profiles: newParticipantProfile
    };

    // 3. Get the full list of all active participants for the new joiner
    const { data: participantsList, count, error: listError } = await supabase
      .from("lobbies_participants")
      // Get all profile columns AND the count
      .select(`user_id, profiles ( * )`, { count: 'exact' }) 
      .eq("lobby_id", lobbyId)
      .eq("is_active", true);

    if (listError) {
       console.error("Get participant list error:", listError);
       throw listError;
    }
    return {
      participant: participantsList || [], 
      newParticipant: newParticipant,     
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