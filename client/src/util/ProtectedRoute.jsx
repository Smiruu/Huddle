import { useAuthStore } from "../store/authStore"
import {Navigate, Outlet} from "react-router-dom";
const ProtectedRoute = ({ children }) => {
    const {isAuthenticated, user} = useAuthStore();

    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }

    return children? children : <Outlet />;

}

export default ProtectedRoute;