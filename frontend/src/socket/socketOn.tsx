import React from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { InfoServer } from "../components/interfaces";
import { accountService } from "../services/account.service";
import { GOT } from "../shared/types";
import { emitSocket } from "./socketEmit";

let profil_login = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setHisto:React.Dispatch<React.SetStateAction<GOT.HistoryParties | undefined>>) => {
    socket.on("client_profil_login", (e: GOT.HistoryParties) => { 
        console.log('client_profil_login', e);
        if (e){
            setHisto(e);
        }
    })
}

let client_privmsg_users = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setFriends:React.Dispatch<React.SetStateAction<GOT.User[] | undefined>>) => {
    socket.on('client_privmsg_users', (rep:GOT.User[]) => {
        console.log('client_privmsg_users', rep);
        if (rep){
            setFriends(rep);
        } 
    })
}

let client_friends = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setLstFriends:React.Dispatch<React.SetStateAction<GOT.Friend[] | undefined>>) => {
    socket.on('client_friends', (rep:GOT.Friend[]) => {
        console.log('client_friends', rep);
        if (rep){
            setLstFriends(rep);
        } 
    })
}

let client_privmsg_send = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, selectUser:GOT.User | undefined) => {
        socket.on('client_privmsg_send', (rep:GOT.msg) => {
            console.log('client_privmsg_send', rep);
            if (selectUser?.login === rep.userFrom.login){
                emitSocket.emitPrivmsg(socket, rep.userFrom.login);
            }
        })
}

let client_profil = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setProfil:React.Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined) => {
    socket.on('client_profil', (rep:GOT.Profile) =>{
        console.warn('client_profil', rep);
        if (rep && setProfil){
            if (rep.userInfos.urlImg.split('')[0] === '/'){
                rep.userInfos.urlImg = `${InfoServer.HttpServer}${rep.userInfos.urlImg}`;
                setProfil(rep);
            }else{
                setProfil(rep);
            }
        }
    })
}

let client_users = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setUsersList:React.Dispatch<React.SetStateAction<GOT.User[] | undefined>>) => {
    socket.on('client_users', (rep:GOT.User[]) => {
        console.log('client_users', rep);
        if (rep){
            setUsersList(rep);
        }
    })
}

let client_privmsg = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setSelectUserMsg:React.Dispatch<React.SetStateAction<GOT.msg[] | undefined>>) => {
    socket.on('client_privmsg', (rep:GOT.msg[]) => {
        console.log('client_privmsg', rep);
        if (rep){
            setSelectUserMsg(rep);
        }
    })
}

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
            let regex:RegExp = /^You received a message send by*/
            if (regex.test(rep)){
                setNotify({isOpen: true, message: `${rep}`, type:'info'});
            }else{
                setNotify({isOpen: true, message: `Info: ${rep}`, type:'info'});
            }
        }
    })
}

export const onSocket = {
    profil_login, client_privmsg_users, client_friends, client_privmsg_send, error_client, info_client, warning_client, client_profil ,client_users, client_privmsg

}