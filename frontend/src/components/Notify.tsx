import {Snackbar} from "@material-ui/core"
import {Alert} from "@material-ui/lab"
import {NotifyInterUse} from "./interfaces"
import React from "react";
import { useNavigate } from "react-router-dom";

export const Notification:React.FC<NotifyInterUse>= (props: NotifyInterUse) => {
   const {notify, setNotify} = props;
   const navigate = useNavigate();

   const handleClose = () =>{
        let regex:RegExp = /^User with login (.*[a-z]) send you a private message/
        if (regex.test(notify.message)){
            const tab = notify.message.split(" ");
            console.log(tab);
            navigate(`/chat?code=Priv&name=${tab[3]}`);
        }
        setNotify({...notify, isOpen: false})
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
         <Alert severity={notify.type} onClose={handleClose} onClick={handleClose} 
                style={{transform: 'translateX(0)', borderRadius: '16px', transition: '0.6s'}}>
            {notify.message}
         </Alert>
      </Snackbar>
   )
}
