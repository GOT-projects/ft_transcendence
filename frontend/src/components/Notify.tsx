import {Snackbar} from "@material-ui/core"
import {Alert} from "@material-ui/lab"
import {NotifyInterUse} from "./interfaces"
import React from "react";

export const Notification:React.FC<NotifyInterUse>= (props: NotifyInterUse) => {
   const {notify, setNotify} = props;

   const handleClose = () =>{
      setNotify({...notify, isOpen: false})
   }
   return(
      <Snackbar
         open={notify.isOpen}
         autoHideDuration={3000}
         anchorOrigin={{vertical: 'top', horizontal: 'right'}}
         onClose={handleClose}
         style={{position: 'absolute',   
                 zIndex: '99',   
                 opacity: '0.9',
				 transition: '0.6s'
                 }}
         >
         <Alert severity={notify.type} onClose={handleClose} 
                style={{transform: 'translateX(-100%)', borderRadius: '16px', transition: '0.6s'}}>
            {notify.message}
         </Alert>
      </Snackbar>
   )
}
