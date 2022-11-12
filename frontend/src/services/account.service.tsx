import Axios from "axios"
import {InfoServer } from "../components/interfaces"

let saveToken = (token: string) => {
    localStorage.setItem('token', token)
}

let saveAccess = (token: string) => {
    localStorage.setItem('access', token)
}

let removeToken= () => {
    localStorage.removeItem('token')
}

let isLogged = () => {
    var access = false;
    Axios.defaults.withCredentials = false;
    let token = localStorage.getItem('token')
    if (!!token){
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
        }
        let auth = localStorage.getItem('access');
        if (!!auth){
            if (auth === "true")
                access = true;
            localStorage.removeItem('access')
        }
    }
    return access;
}


export const accountService = {
    saveToken, removeToken, isLogged
}
