import supabase from "../../supabase/supabase";
import { Session, User } from "@supabase/supabase-js";

interface LoginResult {
    session: Session;
    user: User,
    profile: any;
}

interface RegisterResult {
    user: User;
}

interface RefreshResult {
    session: Session | null;
    user: User | null;
    profile: any;
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
            email_confirm: true,
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
    },

    // Login Function
    async login(email: string, password: string): Promise<LoginResult> {
        console.log("auth.services: Attempting login for email:", email);

        const { data: authData, error:authError} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if(authError) {
            console.error("auth.services: Supabase login error:", authError.message);
            throw authError;
        }

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user?.id)
            .maybeSingle();
        
        if(profileError) {
            console.error("auth.services: Supabase profile fetch error:", profileError.message);
            throw profileError;
        }

        if (!authData.session || !authData.user) {
            console.error("auth.services: No session or user data returned after login");
        }
        console.log(`auth.services: User logged in successfully: ${email}`);
        return { session: authData.session, user: authData.user, profile: profileData };
    },

    async refresh( refresh_token: string): Promise<RefreshResult> {

        console.log("auth.services: Attempting token refresh");

        const {data:refreshData, error} = await supabase.auth.refreshSession({
            refresh_token: refresh_token,
        })

        if(error) {
            console.error("auth.services: Supabase token refresh error:", error.message);
            throw error;
        }
        console.log(refreshData.user?.id)
         const { data: profileData, } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', refreshData.user?.id)
            .single();
        
        console.log("auth.services: Token refreshed successfully");
        return { session: refreshData.session, user: refreshData.user, profile: profileData  };
    },
}