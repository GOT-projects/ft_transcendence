import React from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { InfoServer } from "../components/interfaces";
import { accountService } from "../services/account.service";
import { GOT } from "../shared/types";
import { emitSocket } from "./socketEmit";

function transformUrlUsers(url: string) {
    if (url.split('')[0] === '/')
        return `${InfoServer.HttpServer}${url}`;
    return url;
}

let profil_login = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setHisto:React.Dispatch<React.SetStateAction<GOT.HistoryParties | undefined>>) => {
    socket.on("client_profil_login", (e: GOT.HistoryParties) => { 
        console.log('client_profil_login', e);
        if (e){
            e.userInfos.urlImg = transformUrlUsers(e.userInfos.urlImg);
            for (const party of e.parties) {
                party.user1.urlImg = transformUrlUsers(party.user1.urlImg);
                party.user2.urlImg = transformUrlUsers(party.user2.urlImg);
            }
            setHisto(e);
        }
    })
}

let client_privmsg_users = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setFriends:React.Dispatch<React.SetStateAction<GOT.User[] | undefined>>) => {
    socket.on('client_privmsg_users', (rep:GOT.User[]) => {
        if (rep){
            for (const user of rep) {
                user.urlImg = transformUrlUsers(user.urlImg);
            }
            setFriends(rep);
        } 
    })
}

let client_channels = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setChannel:React.Dispatch<React.SetStateAction<GOT.Channel[] | undefined>>) => {
    socket.on('client_channels', (rep:GOT.Channel[]) => {
        if (rep){
            setChannel(rep);
        } 
    })
}

let client_channelMsg = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setMsgChannel:React.Dispatch<React.SetStateAction<GOT.MsgChannel[] | undefined>>) => {
    socket.on('client_chanmsg', (rep:GOT.MsgChannel[]) => {
        if (rep){
            for (const msg of rep) {
                msg.userFrom.urlImg = transformUrlUsers(msg.userFrom.urlImg);
            }
            setMsgChannel(rep);
        } 
    })
}

let client_chanmsg_users_not_ban = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setUser:React.Dispatch<React.SetStateAction<GOT.ChannelUsers | undefined>>) => {
    socket.on('client_chan_users', (rep:GOT.ChannelUsers) => {
        if (rep){
            for (const user of rep.users) {
                user.urlImg = transformUrlUsers(user.urlImg);
            }
            setUser(rep);
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
}/*
let client_channel_send = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setChannelMsg:React.Dispatch<React.SetStateAction<GOT.MsgChannel | undefined>>) => {
    socket.on('client_channels', (rep:GOT.MsgChannel) => {
        console.log('client_channels', rep);
        if (rep){
            setChannelMsg(rep);
        } 
    })// TODO BIG PB client_channels return GOT.Channel[] list des channels visible (incoherent nom)
}*/

let client_channels_in = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setChannel:React.Dispatch<React.SetStateAction<GOT.Channel[] | undefined>>) => {
    socket.on('client_channels_in', (rep:GOT.Channel[]) => {
        if (rep){
            setChannel(rep);
        }
    })
}
/*
let client_friends = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setLstFriends:React.Dispatch<React.SetStateAction<GOT.Friend[] | undefined>>) => {
    socket.on('client_friends', (rep:GOT.Friend[]) => {
        if (rep){
            for (const user of rep) {
                user.urlImg = transformUrlUsers(user.urlImg);
            }
            setLstFriends(rep);
        } 
    })
}

let client_privmsg_send = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, selectUser:GOT.User | undefined) => {
        socket.on('client_privmsg_send', (rep:GOT.msg) => {
            if (selectUser?.login === rep.userFrom.login){
                emitSocket.emitPrivmsg(socket, rep.userFrom.login);
            }
        })
}
*/
let client_profil = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setProfil:React.Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined) => {
    socket.on('client_profil', (rep:GOT.Profile) =>{
        console.warn('client_profil', rep);
        if (rep && setProfil){
            rep.userInfos.urlImg = transformUrlUsers(rep.userInfos.urlImg);
            for (const friend of rep.friends) {
                friend.urlImg = transformUrlUsers(friend.urlImg);
            }
            for (const block of rep.blocks) {
                block.urlImg = transformUrlUsers(block.urlImg);
            }
            for (const notif of rep.notif) {
                notif.urlImg = transformUrlUsers(notif.urlImg);
            }
            setProfil(rep);
        }
    })
}

let client_users = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setUsersList:React.Dispatch<React.SetStateAction<GOT.User[] | undefined>>) => {
    socket.on('client_users', (rep:GOT.User[]) => {
        if (rep){
            for (const user of rep) {
                user.urlImg = transformUrlUsers(user.urlImg);
            }
            setUsersList(rep);
        }
    })
}

let client_privmsg = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, setSelectUserMsg:React.Dispatch<React.SetStateAction<GOT.msg[] | undefined>>) => {
    socket.on('client_privmsg', (rep:GOT.msg[]) => {
        if (rep){
            for (const msg of rep) {
                msg.userFrom.urlImg = transformUrlUsers(msg.userFrom.urlImg);
                msg.userTo.urlImg = transformUrlUsers(msg.userTo.urlImg);
            }
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
            let regex:RegExp = /^User with login (.*[a-z]) send you a private message/
            if (regex.test(rep)){
                setNotify({isOpen: true, message: `${rep}`, type:'info'});
            }else{
                setNotify({isOpen: true, message: `Info: ${rep}`, type:'info'});
            }
        }
    })
}

export const onSocket = {
    profil_login, client_privmsg_users, /*client_friends, client_privmsg_send,*/ error_client, /*client_channel_send, */
    info_client, warning_client, client_profil ,client_users, client_privmsg, client_channels, client_channels_in,
    client_channelMsg, client_chanmsg_users_not_ban, client_jwt

}
