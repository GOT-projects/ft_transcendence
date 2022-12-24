import {Snackbar} from "@material-ui/core"
import {Alert} from "@material-ui/lab"
import {NotifyInterUse} from "./interfaces"
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { accountService } from "../services/account.service";
import { emitSocket } from "../socket/socketEmit";
import { SocketContext } from "../socket/socketPovider";
import { v4 as uuid } from "uuid";

export const Notification:React.FC<NotifyInterUse>= (props: NotifyInterUse) => {
   const {notify, setNotify} = props;
   const navigate = useNavigate();
    const socket = useContext(SocketContext);

   const handleClose = () =>{
        let regex:RegExp = /^Info: User with login (.*[^ ]) send you a private message/
        if (regex.test(notify.message)){
            const tab = notify.message.split(" ");
            navigate(`/chat?code=Private&name=${tab[3]}`);
        }
        let regexChan:RegExp = /^Info: Channel (.*[^ ]) received a message/
        console.log( "testttttttttt", regexChan.test(notify.message));
        if (regexChan.test(notify.message)){
            const tab = notify.message.split(" ");
            navigate(`/chat?code=Channel&name=${tab[2]}`);
        }
        setNotify({...notify, isOpen: false})
   }
   const handleViewPopup = () =>{
        const params = (new URL(window.location.href));
        const code = params.searchParams.get("code");
        const name = params.searchParams.get("name");
        let regexPrivMsg:RegExp = /^Info: User with login (.*[^ ]) send you a private message/
        if (regexPrivMsg.test(notify.message)){
            const tab = notify.message.split(" ");
            if (code === "Private"){
                const name = params.searchParams.get("name");
                if (name === tab[3]){
                    return false;
                }
                
            }
        }
        let regexChannel:RegExp = /^Info: Channel (.*[^ ]) have a new member/
        if (regexChannel.test(notify.message)){
            const tab = notify.message.split(" ");
            if (code === "Channel"){
                const name = params.searchParams.get("name");
                if (tab && tab[2] === name){
                    emitSocket.emitChanUserNotBan(socket, tab[2]);
                }
            }
        }
        let regexJwt:RegExp = /^Error: jwt expired/
        if (regexJwt.test(notify.message)){
            accountService.removeToken();
            navigate("/");
        }
        let regexChannelMsg:RegExp = /^Info: Channel (.*[^ ]) received a message/
        if (regexChannelMsg.test(notify.message)){
            const tab = notify.message.split(" ");
            if (tab && tab[2] === name){
                return false;
            }
        }
        return true;
   }
   return(
      <Snackbar
         open={notify.isOpen}
         autoHideDuration={5000}
         anchorOrigin={{vertical: 'top', horizontal: 'right'}}
         onClose={handleClose}
         style={{position: 'absolute',   
                 top: ' 4rem',
                 right: '0',
                 zIndex: '100',   
                 opacity: '0.9',
				 transition: '0.6s'
                 }}
        key={uuid()}
         >
         {handleViewPopup() ?
         <Alert severity={notify.type} onClose={handleClose} onClick={handleClose} 
                style={{transform: 'translateX(0)', borderRadius: '16px', transition: '0.6s'}}>
            {notify.message}
         </Alert> : <Alert style={{opacity:"0",}}></Alert>}
      </Snackbar>
   )
}
