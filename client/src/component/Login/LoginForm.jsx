import { useState } from "react";
const LoginForm = () => {
    const {inputValue, setInputValue} = useState("");
    const {password, setPassword} = useState("");
    return (
        <form className="flex flex-col space-y-5">
            <input
                type="text"
                placeholder="Email or Username"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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
            > Submit </button>
        </form>
    )
}

export default LoginForm;