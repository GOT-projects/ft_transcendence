import Axios from "axios"
import {InfoServer} from "../components/interfaces"

const PostConnectIntra = async (code:string ) => {
	Axios.defaults.withCredentials = false;
	return await (Axios.post(InfoServer.HttpServer + '/auth/connect_intra', { code: code}))
}

export const apiPost = {
	PostConnectIntra,
}
