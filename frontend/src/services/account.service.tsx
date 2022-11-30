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

let isLogged = () => {
    var access = false;
    Axios.defaults.withCredentials = false;
    let token = localStorage.getItem('token_access')
    if (!!token){
        try {
			const response = apiGet.getAccess();
			response.then((rep:any) => {
                if (rep.status === 200){
                    saveAccess("true");
                }else{
                    saveAccess("false");
                }  
			})
        } catch (e) {
            console.log(e);
            return access;
        }
        let auth = localStorage.getItem('access');
        if (!!auth){
            if (auth === "true")
                access = true;
            removeAccess();
        }
    }
    return access;
}

let getToken = () => {
    let token= localStorage.getItem('token_access');
    if (token === null)
        return ("");
    return (token);

}

export const accountService = {
    saveToken, removeToken, isLogged, getToken
}
