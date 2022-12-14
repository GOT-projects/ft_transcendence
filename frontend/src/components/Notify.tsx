import {Snackbar} from "@material-ui/core"
import {Alert} from "@material-ui/lab"
import {NotifyInterUse} from "./interfaces"
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { accountService } from "../services/account.service";
import { emitSocket } from "../socket/socketEmit";
import { SocketContext } from "../socket/socketPovider";

export const Notification:React.FC<NotifyInterUse>= (props: NotifyInterUse) => {
   const {notify, setNotify} = props;
   const navigate = useNavigate();
    const socket = useContext(SocketContext);

   const handleClose = () =>{
        const params = (new URL(window.location.href));
        console.log(params);
        let regex:RegExp = /^User with login (.*[a-z]) send you a private message/
        if (regex.test(notify.message)){
            const tab = notify.message.split(" ");
            navigate(`/chat?code=Private&name=${tab[3]}`);
        }
        let regexChan:RegExp = /^Error: Channel (.*[a-z])/
        if (regexChan.test(notify.message)){
            const tab = notify.message.split(" ");
            navigate(`/chat?code=Chan=${tab[3]}`)
        }
        emitSocket.emitProfil(socket);
        setNotify({...notify, isOpen: false})
   }
   const handleViewPopup = () =>{
        const params = (new URL(window.location.href));
        let regexPrivMsg:RegExp = /^User with login (.*[a-z]) send you a private message/
        if (regexPrivMsg.test(notify.message)){
            const tab = notify.message.split(" ");
            const code = params.searchParams.get("code");
            if (code === "Priv"){
                const name = params.searchParams.get("name");
                console.log(name, tab)
                if (name === tab[3]){
                    return false;
                }
                
            }
        }
        let regexChannel:RegExp = /^Info: Channel (.*[a-z]) have a new member (.*[a-z])/
        console.debug(regexChannel)
        if (regexChannel.test(notify.message)){
            const tab = notify.message.split(" ");
            const code = params.searchParams.get("code");
            if (code === "Channel"){
                const name = params.searchParams.get("name");
                if (tab && tab[2] === name){
                    emitSocket.emitChanUserNotBan(socket, tab[2]);
                }
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
         >
         {handleViewPopup() ?
         <Alert severity={notify.type} onClose={handleClose} onClick={handleClose} 
                style={{transform: 'translateX(0)', borderRadius: '16px', transition: '0.6s'}}>
            {notify.message}
         </Alert> : <Alert style={{opacity:"0",}}></Alert>}
      </Snackbar>
   )
}
