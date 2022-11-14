import Axios from "axios"
import {InfoServer } from "../components/interfaces"
import { useCookies } from 'react-cookie'


let saveToken = (token: string) => {
    document.cookie = `token_access: ${token}; expires= ; path=/`;
    localStorage.setItem('token_access', token)
}

let saveAccess = (token: string) => {
    localStorage.setItem('access', token)
}

let removeAccess= () => {
    localStorage.removeItem('access')
}


let removeToken= () => {
    document.cookie = `toekn_access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    localStorage.removeItem('token_access')
    window.location.href = '/';
}

let isLogged = () => {
    var access = false;
    Axios.defaults.withCredentials = false;
    let token = localStorage.getItem('token_access')
    console.log(document.cookie);
    if (!!token){
        console.log("Check access token")
        try {
	        Axios.get(InfoServer.server + '/auth/access', {
                headers: { Authorization: "Bearer " + token }}).then((response: any) => {
                        if (response.status === 200){
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
        console.log("clear access token")
    }
    return access;
}


export const accountService = {
    saveToken, removeToken, isLogged
}
