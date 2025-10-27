import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";


const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const loginUser = useAuthStore((state) => state.loginUser);
    const authLoading = useAuthStore((state) => state.authLoading);
    const authError = useAuthStore((state) => state.authError);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (authLoading) return;
        
        await loginUser(email, password);
    }
    return (
        <>
        <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=" bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2 focus:ring-huddle-blue focus:border-huddle-blue dark:focus:ring-huddle-orange dark:focus:border-huddle-orange"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2 focus:ring-huddle-blue focus:border-huddle-blue dark:focus:ring-huddle-orange dark:focus:border-huddle-orange"
                required
            />
            <button
                type="submit"
                className="w-full bg-huddle-orange text-white font-semibold py-2 px-4 rounded-lg shadow
                       hover:bg-huddle-blue transition-colors duration-200"
                disabled={authLoading}

            > {authLoading ? "Submitting" : "Submit"} </button>
            {authError && (<p className="text-red-500 text-sm text-center">{authError}</p>)}
        </form>
        <div>
            <div className='px-8 py-4 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Don't have an account?{" "}
					<Link to='/register' className='text-huddle-orange hover:underline'>
						Sign up
					</Link>
				</p>
			</div>
        </div>
        </>
    )
}

export default LoginForm;