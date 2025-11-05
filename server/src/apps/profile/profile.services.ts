import supabase from "../../supabase/supabase";

interface EditUsernameResult {
    username: string;
}

export const ProfileServices = {

    async editUsername(username: string, userId: string): Promise<EditUsernameResult> {

        const { data, error } = await supabase
            .from("profiles")
            .update({ username: username }) 
            .eq("id", userId)               
            .select("username")             
            .single();                      

        // 5. Always handle potential errors
        if (error) {
            console.error("Error updating username:", error);
            throw new Error(error.message);
        }

        // 6. 'data' will be { username: "new_username" } which matches your interface
        return data;
    }
}
