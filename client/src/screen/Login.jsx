import LoginForm from "../component/Login/LoginForm";

const Login = () => {


    return (
        <div className="flex items-center justify-center w-full flex-grow p-10  ">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border 
            border-gray-200 dark:border-gray-700 mb-8 text-huddle-text-light dark:text-huddle-text-dark
            flex flex-col lg:flex-row gap-8 max-w-4xl">
                {/* Form design ehe*/}
                <div className="w-1/2">
                    <h1 className="text-2xl font-semibold mb-3">Welcome Back!</h1>
                    <LoginForm />   
                </div>
                {/* Image Section */}
                <div className="w-1/2 justify-center items-center">
                    <img 
                    src="/Login.jpg" 
                    alt="Huddle login graphic" 
                    className="w-full h-auto object-contain rounded-md" 
                />
                </div>
                
            </div>
            
        </div>

    );
}

export default Login;