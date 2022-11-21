import React, { useState } from 'react';
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"
import MousePadLeft from '../components/LeftPad';
import {NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { GOT } from '../shared/types';
import { apiSet } from '../api/get';


const Game = () => {
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
    const [profile, setProfil] = useState<GOT.Profile>();

    apiSet.setProfil(profile, setProfil);
	return (
		<React.Fragment>
			<BackgroundAnimate name="game"/>
            <Header colorHome={Colors.MenuDisable} 
                    colorGame={Colors.MenuActive} 
                    colorLeadBoard={Colors.MenuDisable} 
                    colorChat={Colors.MenuDisable}
                    notify={notify}
                    setNotify={setNotify}
                    profile={profile}
                    />
					<MousePadLeft/>
            <Notification notify={notify} setNotify={setNotify}/>
			<Footer/>
		</React.Fragment>
	)
}
export default Game;

  
