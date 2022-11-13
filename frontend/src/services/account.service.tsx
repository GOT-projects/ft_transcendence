import Axios from "axios"
import {InfoServer } from "../components/interfaces"

let saveToken = (token: string) => {
    localStorage.setItem('token', token)
}

let saveAccess = (token: string) => {
    localStorage.setItem('access', token)
}

let removeAccess= () => {
    localStorage.removeItem('access')
}


let removeToken= () => {
    localStorage.removeItem('token')
    window.location.href = '/';
}

let isLogged = () => {
    var access = false;
    Axios.defaults.withCredentials = false;
    let token = localStorage.getItem('token')
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
