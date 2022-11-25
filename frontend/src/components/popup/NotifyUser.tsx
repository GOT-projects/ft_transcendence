import {Dispatch, SetStateAction, FunctionComponent, useState} from 'react';
import {NotifyInter} from "../../components/interfaces"
import { StyledMenuNotif, StyledMenuNotifButton, StyledMenuNotifButtonHover, StyledMenuNotifContentUser, StyledMenuNotifholder, StyledMenuNotifUser } from '../Styles/StyleNotifUser';
import {RiUserAddFill} from 'react-icons/ri';
import {TiUserDelete} from 'react-icons/ti';
import { v4 as uuid } from 'uuid';
interface IProps {
   setNotif: Dispatch<SetStateAction<boolean>>;
   notify: NotifyInter;
   setNotify: Dispatch<any>;
}

const PopupNotifUser:FunctionComponent<IProps> = (props:IProps) => {
    const [waitingUser, setWaitingUser] = useState([props.notify])
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
                {waitingUser?.map((user) => (
                    <StyledMenuNotifholder key={uuid()}>
                        <div>
                        <StyledMenuNotifContentUser>
                            <StyledMenuNotifUser>{user.type}</StyledMenuNotifUser>
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
