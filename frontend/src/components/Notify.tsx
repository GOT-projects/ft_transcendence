import {Snackbar} from "@material-ui/core"
import {Alert} from "@material-ui/lab"
import {NotifyInterUse} from "./interfaces"
import React from "react";
import { useNavigate } from "react-router-dom";
import { accountService } from "../services/account.service";

export const Notification:React.FC<NotifyInterUse>= (props: NotifyInterUse) => {
   const {notify, setNotify} = props;
   const navigate = useNavigate();

   const handleClose = () =>{
        const params = (new URL(window.location.href));
        console.log(params);
        let regex:RegExp = /^User with login (.*[a-z]) send you a private message/
        if (regex.test(notify.message)){
            const tab = notify.message.split(" ");
            navigate(`/chat?code=Priv&name=${tab[3]}`);
        }
        let regexChan:RegExp = /^Error: Channel (.*[a-z])/
        if (regexChan.test(notify.message)){
            const tab = notify.message.split(" ");
            navigate(`/chat?code=Chan=${tab[3]}`)
        }
        let regexNotif:RegExp = /^Info: User with login (.*[a-z]) invite you to be friend/
        if (regexNotif.test(notify.message)){
            if (params.search === ""){
                navigate(`${params.pathname}&notify=true`)
            }else{
                const param = accountService.replaceParamsTo("notif", "true");
                navigate(`${params.pathname}${param}`)
            }
        }
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
