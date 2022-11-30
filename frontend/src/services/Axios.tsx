import axios from "axios";
import { InfoServer } from "../components/interfaces";
import { accountService } from "./account.service";

const Axios = axios.create({
    baseURL: InfoServer.HttpServer,
    withCredentials: false,
})

Axios.interceptors.request.use(request => {
    if (accountService.isLogged()){
        let token = accountService.getToken();
        if (request.headers !== undefined && typeof token === "string")
            request.headers.Authorization = `Bearer ${token}`
    }
    return (request);
})

export default Axios
