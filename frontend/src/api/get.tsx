import Axios from "axios"
import {InfoServer} from "../components/interfaces"

const getIntraUrl = async () => {
	Axios.defaults.withCredentials = false;
	return (Axios.get(InfoServer.HttpServer + '/auth/get_intra_url'))
}

const getAccess = async (token: string) => {
	Axios.defaults.withCredentials = false;
	return Axios.get(InfoServer.HttpServer + '/auth/access', {
        headers: { Authorization: "Bearer " + token }})
}


export const apiGet = {
	getIntraUrl, getAccess
}
