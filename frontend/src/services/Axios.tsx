import axios, { AxiosHeaders } from "axios";
import { InfoServer } from "../components/interfaces";
import { accountService } from "./account.service";

const Axios = axios.create({
	baseURL: InfoServer.HttpServer,
	withCredentials: false,
	headers: { Authorization: `Bearer`},
})


Axios.interceptors.request.use(
	config => {
		let token = accountService.getToken();
		if (config.headers){
            (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
		}
		return (config);
	}, (e) => {
		return Promise.reject(e);
})


export default Axios
