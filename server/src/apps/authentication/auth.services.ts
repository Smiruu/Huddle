import supabase from "../../supabase/supabase";
import { AuthError, User } from "@supabase/supabase-js";

interface RegisterResult {
    user: User;
}

export const AuthService = {
    // Register Function
    async register(email: string, password: string, username: string): Promise<RegisterResult> {
        console.log("Registering user with email:", email);

        const { data: existingUser} = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .maybeSingle();

        if(existingUser) {
            throw new Error('Username already taken');
        }

        const { data: authData, error: authError} = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: false,
        });

        if(authError) {
            console.error('auth.services: Supabase registration error:', authError.message);
            throw authError;
        }

        if(!authData.user){
            console.error('auth.services: No user data returned after registration');
        }

        const newUser = authData.user;

        const {error: profError} = await supabase
            .from('profiles')
            .insert({
                id: newUser.id,
                username: username,
            });

        if(profError) {
            console.error('auth.services: Supabase profile creation error:', profError.message);
            await supabase.auth.admin.deleteUser(authData.user.id);
            console.error(`auth.services: Rolled back user creation of ${newUser.id} due to profile error`);
            throw new Error('Failed to create user profile');
        }

        console.log("auth.services: User registered successfully:", newUser.id);
        return {user: newUser};
        
    }
}