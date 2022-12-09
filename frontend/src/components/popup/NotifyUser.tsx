import {Dispatch, SetStateAction, FunctionComponent, useState, useContext} from 'react';
import {NotifyInter} from "../../components/interfaces"
import { StyledMenuNotif, StyledMenuNotifButton, StyledMenuNotifButtonHover, StyledMenuNotifContentUser, StyledMenuNotifholder, StyledMenuNotifUser } from '../Styles/StyleNotifUser';
import {RiUserAddFill} from 'react-icons/ri';
import {TiUserDelete} from 'react-icons/ti';
import { v4 as uuid } from 'uuid';
import { GOT } from '../../shared/types';
import { SocketContext } from '../../socket/socketPovider';
import { emitSocket } from '../../socket/socketEmit';

interface IProps {
   notify: NotifyInter;
   setNotify: Dispatch<any>;
   profil: GOT.Profile | undefined;
}

const PopupNotifUser:FunctionComponent<IProps> = (props:IProps) => {
    const socket = useContext(SocketContext);
    const handleAdd = (user: GOT.User) =>{
        let tmp: GOT.NotifChoice = {user:user, accept: true};
        props.setNotify({isOpen: true, message: `Add ${user.login}`, type:'success'});
        emitSocket.emitReplyNotif(socket, tmp)
    }
    const handleRemove = (user: GOT.User) =>{
        let tmp: GOT.NotifChoice = {user:user, accept: false};
        emitSocket.emitReplyNotif(socket, tmp)
        props.setNotify({isOpen: true, message: `Refused invitation of ${user.login}`, type:'success'});
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
                            <StyledMenuNotifUser>{user.login}</StyledMenuNotifUser>
                        </StyledMenuNotifContentUser>
                        </div>
                        <StyledMenuNotifButton>
                            <StyledMenuNotifButtonHover>
                                <RiUserAddFill size={"20px"} onClick={() => handleAdd(user)}/>
                            </StyledMenuNotifButtonHover>
                            <StyledMenuNotifButtonHover>
                                <TiUserDelete size={"25px"} onClick={() => handleRemove(user)}/>
                            </StyledMenuNotifButtonHover>
                        </StyledMenuNotifButton>
                </StyledMenuNotifholder>
                ))}
        </StyledMenuNotif>
    )
}

export default PopupNotifUser;
