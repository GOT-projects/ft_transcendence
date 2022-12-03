import Axios from "../services/Axios"
import {InfoServer} from "../components/interfaces"
import { GOT } from "../shared/types";

const getIntraUrl = async () => {
	return (Axios.get('/auth/get_intra_url'))
}

const getAccess = async () => {
	return await Axios.get('/auth/access');
}

const getProfil = async () => {
	return Axios.get('/profil')
}

const getHistoric = async (user:string) => {
	return Axios.get('/profil/' + user)
}

export const apiGet = {
	getIntraUrl, getAccess, getProfil, getHistoric
}
