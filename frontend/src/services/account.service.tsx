import Axios from "axios"
import { apiGet } from "../api/get";
import { UsersId } from "../components/interfaces";


let saveToken = (token: string) => {
    document.cookie = `token_access= ${token}; expires= ; path=/`;
    localStorage.setItem('token_access', token)
}

let saveAccess = (token: string) => {
    localStorage.setItem('access', token)
}

let removeAccess= () => {
    localStorage.removeItem('access')
}

let removeUser= () => {
    localStorage.removeItem('access')
}

let removeToken= () => {
    document.cookie = `token_access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    localStorage.removeItem('token_access')
    removeUser();
    window.location.href = '/';
}

let getParamsPriv = () => {
    const params = (new URL(window.location.href)).searchParams;
    let code: Map<string, string> = new Map();
    let tmp = params.get("code");
    if (tmp){
        code.set("code", tmp);
        tmp = params.get("name");
        if (tmp){
            code.set("name", tmp);
        }
    }
    return (code);
}

let getParamsCode = () => {
    const params = (new URL(window.location.href)).searchParams;
    let code: Map<string, string> = new Map();
    let tmp = params.get("code");
    if (tmp){
        code.set("code", tmp);
    }
    return (code);
}

let isLogged = async() => {
    let token = localStorage.getItem('token_access')
    if (!!token){
        try {
			const response = await apiGet.getAccess();
            if (response.status === 200)
                return (true);
            else{
                return (false);
            }
        } catch (e) {
            console.log(e);
        }
    }
    return false;
}

let getToken = () => {
    let token= localStorage.getItem('token_access');
    if (token === null)
        return ("");
    return (token);

}

export const accountService = {
    saveToken, removeToken, isLogged, getToken, getParamsPriv, getParamsCode
}
