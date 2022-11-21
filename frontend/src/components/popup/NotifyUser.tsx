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
   addFriend: GOT.User[] | undefined;
}

const PopupNotifUser:FunctionComponent<IProps> = (props:IProps) => {
    const handleAdd = () =>{
        props.setNotify({isOpen: true, message: 'Add friend', type:'success'});
    }
    const handleRemove = () =>{
        props.setNotify({isOpen: true, message: 'Refused invitation', type:'success'});
    }
    return(
        <StyledMenuNotif 
            initial={{x: 300}}
            animate={{x:0}}
            transition={{duration: 1}}
            exit={{x: 300, opacity: 0}}>
                {props.addFriend?.map((user:GOT.User) => (
                    <StyledMenuNotifholder key={uuid()}>
                        <div>
                        <StyledMenuNotifContentUser>
                            <StyledMenuNotifUser>{user.username}</StyledMenuNotifUser>
                        </StyledMenuNotifContentUser>
                        </div>
                        <StyledMenuNotifButton>
                            <StyledMenuNotifButtonHover>
                                <RiUserAddFill size={"20px"} onClick={handleAdd}/>
                            </StyledMenuNotifButtonHover>
                            <StyledMenuNotifButtonHover>
                                <TiUserDelete size={"25px"} onClick={handleRemove}/>
                            </StyledMenuNotifButtonHover>
                        </StyledMenuNotifButton>
                </StyledMenuNotifholder>
                ))}
        </StyledMenuNotif>
    )
}

export default PopupNotifUser;
