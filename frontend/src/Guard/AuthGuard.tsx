import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { accountService } from "../services/account.service";

let access:boolean;

const getAccess = async () => {
    let data = await accountService.isLogged();
    if (data === true)
        access = true;
    else
        access = false;
}

const AuthGuard = ({children}:any) => {
    const [auth, setAuth] = useState<boolean>();
    useEffect(() => {
        (async () => {
            await getAccess();
            if (!access){
                setAuth(access);
            }
        })();
    },[])
    if (auth === false){
        return <Navigate to="/"/>
    }
    return children;
};

export default AuthGuard;

