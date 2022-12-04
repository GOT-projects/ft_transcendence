import Axios from "../services/Axios"

const PostConnectIntra = async (code:string) => {
	return await (Axios.post('/auth/connect_intra', {code: code}))
}

const PostUpload = async (file:File|File[]) => {
	return await (Axios.put('/upload', {file: file}))
}

export const apiPost = {
	PostConnectIntra, PostUpload
}
