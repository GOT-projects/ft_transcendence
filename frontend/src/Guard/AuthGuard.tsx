import { Navigate } from "react-router-dom";
import { accountService } from "../services/account.service";

const AuthGuard = ({children}:any) => {
    let access = accountService.isLogged();
    console.log("AuthGuard: ", access);
    if (access === false){
        return <Navigate to="/"/>
    }
    return children;
};

