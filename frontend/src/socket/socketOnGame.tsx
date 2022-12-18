import React from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { InfoServer } from "../components/interfaces";
import { accountService } from "../services/account.service";
import { GOT } from "../shared/types";
import { emitSocket } from "./socketEmit";

let error_client = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setNotify:any) => {
    socket.on('error_client', (rep:any) => {
        console.log('error_client', rep);
        if (typeof rep === "string")
            setNotify({isOpen: true, message: `Error: ${rep}`, type:'error'});
    })
}

let warning_client = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setNotify:any) => {
    socket.on('warning_client', (rep:any) => {
        console.log('warning_client', rep);
        if (typeof rep === "string")
            setNotify({isOpen: true, message: `Warning: ${rep}`, type:'warning'});
    })
}

let info_client = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setNotify:any) => {
    socket.on('info_client', (rep:any) => {
        console.log('info_client', rep);
        if (typeof rep === "string"){
            let regex:RegExp = /^User with login (.*[a-z]) send you a private message/
            if (regex.test(rep)){
                setNotify({isOpen: true, message: `${rep}`, type:'info'});
            }else{
                setNotify({isOpen: true, message: `Info: ${rep}`, type:'info'});
            }
        }
    })
}

let client_jwt = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    socket.on('client_jwt', (rep:string) => {
        console.log("new jwt")
        if (rep){
            accountService.saveToken(rep);
        } 
    })
}
export const onSocketGame = {
    info_client, warning_client, error_client, client_jwt
}
