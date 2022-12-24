import axios from "axios";
import { InfoServer } from "../components/interfaces";
import { accountService } from "./account.service";

const Axios = axios.create({
	baseURL: InfoServer.HttpServer,
	withCredentials: false,
	headers: { Authorization: `Bearer`},
})


Axios.interceptors.request.use(
	request => {
		let token = accountService.getToken();
		if (request.headers){
			request.headers.Authorization = `Bearer ${token}`
		}
		return (request);
	}, (e) => {
		return Promise.reject(e);
})


export default Axios
