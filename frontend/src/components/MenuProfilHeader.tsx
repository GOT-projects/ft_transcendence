import {Dispatch, SetStateAction, FunctionComponent, useState} from 'react';
import { v4 as uuid } from 'uuid';
import {StyleMenuHeaderLoggout} from "./Styles/StyledHeader"
import {StyledMenuProfile, StyleMenuHeaderProfilData, StyleMenuHeaderProfilOption} from "./Styles/StyleMenuProfilHeader"
import { accountService } from "../services/account.service";
import { HiLogout  } from 'react-icons/hi';
import PopupChangeUsername from "./popup/ChangeUserName";
import {NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { profile } from 'console';

interface IProps {
   notify: NotifyInter;
   setNotify: Dispatch<any>;
}

const ProfileMenu :FunctionComponent<IProps> = (props:IProps) => {
    const [changeUsername, setChangeUsername] = useState(false);
    const [dataPlayer, setDataPlayer] = useState({id: uuid(), victory: 10, rank: 1});
    
    const handleChangeUsername = () => {
        if (changeUsername === true)
            setChangeUsername(false)
        else if (changeUsername === false)
            setChangeUsername(true)
    }

    return (
        <StyledMenuProfile 
            initial={{x: 300}}
            animate={{x:0}}
            transition={{duration: 1}}
            exit={{x: -100, opacity: 0}}>
            <StyleMenuHeaderProfilOption onClick={handleChangeUsername}>Username</StyleMenuHeaderProfilOption>
            <StyleMenuHeaderProfilOption>Avatar</StyleMenuHeaderProfilOption>
            <StyleMenuHeaderProfilOption>Add 2FA</StyleMenuHeaderProfilOption>
            <StyleMenuHeaderProfilData>
                victory {dataPlayer.victory} rank {dataPlayer.rank}
            </StyleMenuHeaderProfilData>
            <StyleMenuHeaderLoggout onClick={accountService.removeToken}>
                <HiLogout size={"30px"}/>
            </StyleMenuHeaderLoggout>
            {changeUsername ? <PopupChangeUsername setChangeUsername={setChangeUsername} notify={props.notify} setNotify={props.setNotify}></PopupChangeUsername> : <></>}
        </StyledMenuProfile>
    )
}

export default ProfileMenu;
