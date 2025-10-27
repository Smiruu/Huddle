
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./util/ProtectedRoute";
import PublicRoute from "./util/PublicRoute";
import Header from "./component/Header"
import Dashboard from "./screen/Dashboard";
import Login from "./screen/Login";
import { useAuthStore } from "./store/authStore";
import Register from "./screen/Register";

const App = () => {

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingSession = useAuthStore((state) => state.isCheckingSession);

  useEffect(() => {
    if (checkAuth) {
      checkAuth();
    }
  }, [checkAuth])


  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <h1 className="text-2xl text-gray-900 dark:text-gray-100">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Router>
        {isAuthenticated && <Header />}
        <main className="flex-grow">
          <Routes>
            <Route element = {<PublicRoute/>}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />}/>
            </Route>

            <Route element = {<ProtectedRoute/>}>
             <Route path="/" element={<Dashboard />} />
            </Route>

            
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;