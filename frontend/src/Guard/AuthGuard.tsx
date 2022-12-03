import { Navigate } from "react-router-dom";
import { accountService } from "../services/account.service";

let access:boolean;

const getAcces = async () => {
    let data = await accountService.isLogged();
    if (data === true)
        access = true;
    else
        access = false;
}

const AuthGuard = ({children}:any) => {
    (async () => await getAcces())()
    if (access === false){
        return <Navigate to="/"/>
    }
    return children;
};

export default AuthGuard;

