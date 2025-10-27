import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({children}) => {
    const {isAuthenticated} = useAuthStore();

    if(isAuthenticated){
        return <Navigate to="/" replace />;
    }
    return children? children : <Outlet />;
}

export default PublicRoute;