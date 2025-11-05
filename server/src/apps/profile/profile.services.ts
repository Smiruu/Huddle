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

       
        if (error) {
            console.error("profile.services.ts: Error updating username:", error);
            throw new Error(error.message);
        }

        return data;
    },

    async editProfilePicture(fileBuffer: Buffer, userId: string, mimeType: string): Promise<string | null> {

        const pictureName = `avatar - ${userId}`;
        const bucketName = "Profile"

        const { error: uploadError} = await supabase.storage
        .from(bucketName)
        .upload(pictureName, fileBuffer, {
            contentType: mimeType,
            upsert:true
        })

        if(uploadError) {
            console.log("profile.services.ts: Upload error:", uploadError)
            throw new Error(uploadError.message)
        }

        //get image link
        const {data:urlData} = await supabase.storage
        .from(bucketName)
        .getPublicUrl(pictureName);

        const {error: dbError} = await supabase
        .from("profiles")
        .update({avatar_url: urlData.publicUrl})
        .eq('id', userId)

        if (dbError){
            console.log("profile.services.ts: Database error:", dbError)
            throw new Error(dbError.message)
        }

        return urlData.publicUrl;
    }
}
