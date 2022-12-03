import {Dispatch, SetStateAction, FunctionComponent, useState, useContext} from 'react';
import {NotifyInter} from "../../components/interfaces"
import { StyledMenuNotif, StyledMenuNotifButton, StyledMenuNotifButtonHover, StyledMenuNotifContentUser, StyledMenuNotifholder, StyledMenuNotifUser } from '../Styles/StyleNotifUser';
import {RiUserAddFill} from 'react-icons/ri';
import {TiUserDelete} from 'react-icons/ti';
import { v4 as uuid } from 'uuid';
import { GOT } from '../../shared/types';
import { SocketContext } from '../../socket/socketPovider';
import { emitSocket } from '../../socket/socketEmit';

   profil: GOT.Profile | undefined;
}
const PopupNotifUser:FunctionComponent<IProps> = (props:IProps) => {
    const socket = useContext(SocketContext);
    const handleAdd = (name: string) =>{
        props.setNotify({isOpen: true, message: `Add ${name}`, type:'success'});
        emitSocket.emitDemandFriend(socket, name);
   addFriend: GOT.User[] | undefined;
}

const PopupNotifUser:FunctionComponent<IProps> = (props:IProps) => {
    const handleAdd = () =>{
        props.setNotify({isOpen: true, message: 'Add friend', type:'success'});
    }
    const handleRemove = (name: string) =>{
        props.setNotify({isOpen: true, message: `Refused invitation of ${name}`, type:'success'});
    }
    return(
        <StyledMenuNotif 
            initial={{x: 300}}
            animate={{x:0}}
            transition={{duration: 1}}
            exit={{x: 300, opacity: 0}}>
                {props.profil?.notif.map((user) => (

                    <StyledMenuNotifholder key={uuid()}>
                        <div>
                        <StyledMenuNotifContentUser>
                            <StyledMenuNotifUser>{user.username}</StyledMenuNotifUser>
                        </StyledMenuNotifContentUser>
                        </div>
                        <StyledMenuNotifButton>
                            <StyledMenuNotifButtonHover>
                                <RiUserAddFill size={"20px"} onClick={() => handleAdd(user.username)}/>
                            </StyledMenuNotifButtonHover>
                            <StyledMenuNotifButtonHover>
                                <TiUserDelete size={"25px"} onClick={() => handleRemove(user.username)}/>
                            </StyledMenuNotifButtonHover>
                        </StyledMenuNotifButton>
                </StyledMenuNotifholder>
                ))}
        </StyledMenuNotif>
    )
}

export default PopupNotifUser;
