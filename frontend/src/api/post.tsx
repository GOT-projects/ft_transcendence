import { InfoServer } from "../components/interfaces";
import Axios from "../services/Axios"

const PostConnectIntra = async (code:string) => {
	return await (Axios.post('/auth/connect_intra', {code: code}))
}

const PostUpload = async (file:File) => {
    let formData = new FormData();

    formData.append("file", file);
    formData.append("url", InfoServer.HttpServer);
	return await (Axios.put('/upload', formData))
}

const Post2FAGenerate = async () => {
    return await (Axios.post('/auth/2fa/generate'));
}


export const apiPost = {
	PostConnectIntra, PostUpload, Post2FAGenerate 
}
