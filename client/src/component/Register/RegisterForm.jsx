import { useState } from "react";
// 1. Import useNavigate
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // 2. Get the navigate function
  const navigate = useNavigate();

  const registerUser = useAuthStore((state) => state.registerUser);
  const authLoading = useAuthStore((state) => state.authLoading);
  const authError = useAuthStore((state) => state.authError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authLoading) return;

    // 3. Check the result of registerUser
    // (This assumes registerUser in your store returns 'true' on success)
    const success = await registerUser(email, password, username);
    
    // 4. If successful, navigate to the login page
    if (success) {
      // You could also add a success toast message here
      navigate("/login");
    }
    // If it fails, the authError will automatically appear
  };
  return (
    <>
      <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className=" bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2 focus:ring-huddle-blue focus:border-huddle-blue dark:focus:ring-huddle-orange dark:focus:border-huddle-orange"
          required
        />
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
        >
          {" "}
          {authLoading ? "Submitting" : "Submit"}{" "}
        </button>
        {authError && (
          <p className="text-red-500 text-sm text-center">{authError}</p>
        )}
      </form>
      <div>
        <div className="px-8 py-4 flex justify-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            {/* 5. Fixed link to point to /login */}
            <Link
              to="/login"
              className="text-huddle-orange hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
