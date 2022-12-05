import React, { Dispatch, FunctionComponent, useContext, useEffect, useState } from 'react';
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"
import MousePadLeft from '../components/LeftPad';
import {NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { SocketContext } from '../socket/socketPovider';
import { GOT } from '../shared/types';

interface IProps {
   profil: GOT.Profile | undefined;
   setProfil: Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
}

const Game:FunctionComponent<IProps> = (props:IProps)=> {
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});

	return (
		<React.Fragment>
			<BackgroundAnimate name="game"/>
            <Header colorHome={Colors.MenuDisable} 
                    colorGame={Colors.MenuActive} 
                    colorLeadBoard={Colors.MenuDisable} 
                    colorChat={Colors.MenuDisable}
                    notify={notify}
                    setNotify={setNotify}
                    profil={props.profil}
                    setProfil={props.setProfil}
                    />
			<MousePadLeft />
            <Notification notify={notify} setNotify={setNotify}/>
			<Footer/>
		</React.Fragment>
	)
}
export default Game;

  
