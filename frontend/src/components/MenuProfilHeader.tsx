import {Dispatch, FunctionComponent, useRef, useState} from 'react';
import {StyleMenuHeaderAvatarContainte, StyleMenuHeaderLoggout} from "./Styles/StyledHeader"
import {StyledMenuProfile, StyleMenuHeaderProfilData, StyleMenuHeaderProfilOption} from "./Styles/StyleMenuProfilHeader"
import { accountService } from "../services/account.service";
import { HiLogout  } from 'react-icons/hi';
import PopupChangeUsername from "./popup/ChangeUserName";
import {NotifyInter} from "../components/interfaces"
import { GOT } from '../shared/types';
import { BiUpload } from 'react-icons/bi';
import { Colors } from './Colors';
import { apiPost } from '../api/post';

interface IProps {
   notify: NotifyInter;
   setNotify: Dispatch<any>;
   setProfileMenu: Dispatch<React.SetStateAction<boolean>>;
   setOtc: Dispatch<React.SetStateAction<boolean>>;
   profil: GOT.Profile | undefined;
}

const ProfileMenu :FunctionComponent<IProps> = (props:IProps) => {
    const [changeUsername, setChangeUsername] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const handleChangeUsername = () => {
        if (changeUsername === true)
            setChangeUsername(false)
        else if (changeUsername === false)
            setChangeUsername(true)
    }

    const handleAvatar = () =>{
        if (inputRef.current !== null)
            inputRef.current.click();
    }

    const handleFile = (event:any) => {
        const fileObj:File | File[] = event.target.files && event.target.files[0];
        if (!fileObj) {
          return;
        }
        event.target.value = null;
        console.log(fileObj);
        apiPost.PostUpload(fileObj);
        props.setProfileMenu(false);
  };

  const handleOtc= () =>{
    props.setProfileMenu(false);
    props.setOtc(true);
  }
    
    return (
        <StyledMenuProfile 
            initial={{x: 300}}
            animate={{x:0}}
            transition={{duration: 1}}
            exit={{x: -100, opacity: 0}}>
            <StyleMenuHeaderProfilOption onClick={handleChangeUsername}>Username</StyleMenuHeaderProfilOption>
            <StyleMenuHeaderAvatarContainte onClick={handleAvatar}>
                <input
                    style={{display: 'none'}}
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {handleFile(e)}}
                />
                <StyleMenuHeaderProfilOption >Avatar</StyleMenuHeaderProfilOption>
                <BiUpload size={25} color={Colors.darkText}/>
            </StyleMenuHeaderAvatarContainte>
            <StyleMenuHeaderProfilOption onClick={handleOtc}>Setup 2FA</StyleMenuHeaderProfilOption>
            <StyleMenuHeaderProfilData>
                victory {props.profil?.stat.victory} rank {props.profil?.stat.rank}
            </StyleMenuHeaderProfilData>
            <StyleMenuHeaderLoggout onClick={accountService.removeToken}>
                <HiLogout size={"30px"}/>
            </StyleMenuHeaderLoggout>
            {changeUsername ? <PopupChangeUsername setChangeUsername={setChangeUsername} notify={props.notify} setNotify={props.setNotify}></PopupChangeUsername> : <></>}
        </StyledMenuProfile>
    )
}

export default ProfileMenu;
