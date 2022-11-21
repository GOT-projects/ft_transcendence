import Axios from "axios"
import {InfoServer} from "../components/interfaces"
import { GOT } from "../shared/types";

const getIntraUrl = async () => {
	Axios.defaults.withCredentials = false;
	return (Axios.get(InfoServer.HttpServer + '/auth/get_intra_url'))
}

const getAccess = async (token: string) => {
	Axios.defaults.withCredentials = false;
	return Axios.get(InfoServer.HttpServer + '/auth/access', {
        headers: { Authorization: "Bearer " + token }})
}

const getProfil = async () => {
    const token = localStorage.getItem("token_access")
	Axios.defaults.withCredentials = false;
	return Axios.get(InfoServer.HttpServer + '/profil', {
        headers: { Authorization: "Bearer " + token }})
}

const setProfil = (profile: GOT.Profile | undefined, setProfile:any) =>{
    if (profile === undefined){
        const response = apiGet.getProfil();
        response.then((rep) => {
            if (rep.data){
                setProfile(rep.data);
                localStorage.setItem("urlImg", rep.data.userInfos.urlImg);
            }
        }).catch((e) => {
            console.log(e);
        }) 
    }else if (profile !== undefined){
        let tmp = localStorage.getItem("urlImg");
        if (!!tmp && profile.userInfos.urlImg !== tmp){
            localStorage.setItem("urlImg", profile.userInfos.urlImg);
        }
    }
}


export const apiGet = {
	getIntraUrl, getAccess, getProfil
}
export const apiSet = {
	setProfil
}
