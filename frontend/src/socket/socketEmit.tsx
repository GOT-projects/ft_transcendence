import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { accountService } from "../services/account.service";
import { GOT } from "../shared/types";

let emitProfil = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) =>{
	socket.emit('server_profil', {Authorization: accountService.getToken()});
}

let emitProfilHisto = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, username: string) =>{
	socket.emit('server_profil_login', {Authorization: accountService.getToken(), login: username});
}

let emitFriends = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) =>{
	socket.emit('server_friends', {Authorization: accountService.getToken()});
}

let emitDemandFriend = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, username: string) => {
	socket.emit('server_demand_friend', {Authorization: accountService.getToken(), login: username})
}

let emitCreateChan = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, channel: GOT.Channel) => {
	socket.emit('server_chan_create', {Authorization: accountService.getToken(), chan: channel})
}

let emitChangeUsername = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, username: string) => {
	socket.emit('server_change_username', {Authorization: accountService.getToken(), username: username})
}

let emitLeaderboard = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
	socket.emit('server_leaderboard', {Authorization: accountService.getToken()})
}

let emitPrivmsg = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, login:string) => {
	socket.emit('server_privmsg', {Authorization: accountService.getToken(), login: login})
}

let emitSendPrivmsg = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, login:string, msg: string) => {
	socket.emit('server_privmsg_send', {Authorization: accountService.getToken(), login: login, msg: msg})
}

let emitUsers = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
	socket.emit('server_users', {Authorization: accountService.getToken()})
}

let emitBlockUser = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, login:string) => {
	socket.emit('server_block_somebody', {Authorization: accountService.getToken(), login:login})
}

let emitChannels = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
	socket.emit('server_channels', {Authorization: accountService.getToken()})
}

let emitChannelJoin = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, chanName: string, password: string | undefined) => {
	socket.emit('server_chan_join', {Authorization: accountService.getToken(), chanName:chanName, password:password})
}

let emitChannelsIn = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
	socket.emit('server_channels_in', {Authorization: accountService.getToken()})
}

let emitChannelMsg = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, channelName: string) => {
	socket.emit('server_chanmsg', {Authorization: accountService.getToken(), chanName: channelName})
}

let emitChannelMsg_send = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, chanName: string, msg:string) => {
	socket.emit('server_chanmsg_send', {Authorization: accountService.getToken(), chanName: chanName, msg:msg})
}

let emitChanUserNotBan = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, chanName: string) => {
	socket.emit('server_chan_users', {Authorization: accountService.getToken(), chanName: chanName})
}

let emitUnBlockUser = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, login:string) => {
	socket.emit('server_unblock_somebody', {Authorization: accountService.getToken(), login:login})
}

let emitPrivmsgUsers = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
	socket.emit('server_privmsg_users', {Authorization: accountService.getToken()})
}

let emitReplyNotif = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, reply: GOT.NotifChoice) => {
	socket.emit('server_reply_notification', {Authorization: accountService.getToken(), reply :  reply})
}

let emitLeaveChan = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, chanName:string, login:string | undefined) => {
	socket.emit('server_chan_leave', {Authorization: accountService.getToken(), chanName: chanName, loginWhoLeave:login})
}

let emitInviteSomebody = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, chanName:string, loginInvite:string) => {
	socket.emit('server_chanmsg_invite', {Authorization: accountService.getToken(), chanName: chanName, loginInvite:loginInvite})
}

let emitChanUnBlock = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, chanName:string, loginUnblock:string) => {
	socket.emit('server_chan_unban_somebody', {Authorization: accountService.getToken(), chanName: chanName, loginToUnban:loginUnblock})
}

let emitChanBlock = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, chanName:string, loginBlock:string) => {
	socket.emit('server_chan_ban_somebody', {Authorization: accountService.getToken(), chanName: chanName, loginToBan:loginBlock})
}

let emitChanChangeName = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, chanName:string, newName:string) => {
	socket.emit('server_chan_edit_name', {Authorization: accountService.getToken(), chanName: chanName, newChanName:newName})
}
let emitChanChangeStatus = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, chan:GOT.Channel) => {
	socket.emit('server_chan_edit_status', {Authorization: accountService.getToken(), chan:chan})
}
let emitChanPassAdmin = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, chanName: string, loginToPassAdmin:string) => {
	socket.emit('server_chan_pass_admin', {Authorization: accountService.getToken(), chanName:chanName, loginToPassAdmin: loginToPassAdmin})
}
let emitChanPassMember = async (socket:Socket<DefaultEventsMap, DefaultEventsMap>, chanName: string, loginToPassMember:string) => {
	socket.emit('server_chan_pass_member', {Authorization: accountService.getToken(), chanName:chanName, loginToPassMember: loginToPassMember})
}
export const emitSocket ={
	emitProfil, emitProfilHisto, emitFriends, emitDemandFriend, emitChangeUsername, emitLeaderboard,
	emitPrivmsg, emitSendPrivmsg, emitUsers, emitBlockUser, emitPrivmsgUsers, emitReplyNotif, emitUnBlockUser, emitCreateChan,
	emitChannels, emitChannelsIn, emitChannelMsg_send, emitChannelMsg, emitChannelJoin, emitChanUserNotBan,
	emitLeaveChan, emitInviteSomebody, emitChanBlock, emitChanUnBlock, emitChanChangeName, emitChanChangeStatus,
	emitChanPassMember, emitChanPassAdmin
}
