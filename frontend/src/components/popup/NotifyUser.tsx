import {Dispatch, SetStateAction, FunctionComponent, useState} from 'react';
import {NotifyInter} from "../../components/interfaces"
import { StyledMenuNotif, StyledMenuNotifButton, StyledMenuNotifButtonHover, StyledMenuNotifContentUser, StyledMenuNotifholder, StyledMenuNotifUser } from '../Styles/StyleNotifUser';
import {RiUserAddFill} from 'react-icons/ri';
import {TiUserDelete} from 'react-icons/ti';
import { v4 as uuid } from 'uuid';
import { GOT } from '../../shared/types';

interface IProps {
   setNotif: Dispatch<SetStateAction<boolean>>;
   notify: NotifyInter;
   setNotify: Dispatch<any>;
   profil: GOT.Profile | undefined;
}

const PopupNotifUser:FunctionComponent<IProps> = (props:IProps) => {
    const handleAdd = (name: string) =>{
        props.setNotify({isOpen: true, message: `Add ${name}`, type:'success'});
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
