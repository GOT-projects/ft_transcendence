import { Navigate } from "react-router-dom";
import { accountService } from "../services/account.service";

const AuthGuard = ({children}:any) => {
    let access = accountService.isLogged();
    if (access === false){
        console.log("false authGuard")
        return <Navigate to="/"/>
    }
        console.log("truee authGuard")
    return children;
};

export default AuthGuard;
