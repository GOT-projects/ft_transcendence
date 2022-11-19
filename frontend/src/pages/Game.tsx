import React, { useState } from 'react';
import BackgroundAnimate from '../components/BackGroundAnimate';
import Footer from '../components/Footer';
import Header from '../components/Header';
import {Colors} from "../components/Colors"
import MousePadLeft from '../components/LeftPad';
import {NotifyInter} from "../components/interfaces"


const Game = () => {
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
	return (
		<React.Fragment>
			<BackgroundAnimate name="game"/>
            <Header colorHome={Colors.MenuDisable} 
                    colorGame={Colors.MenuActive} 
                    colorLeadBoard={Colors.MenuDisable} 
                    colorChat={Colors.MenuDisable}
                    notify={notify}
                    setNotify={setNotify}/>
					<MousePadLeft />

			<Footer/>
		</React.Fragment>
	)
}

export default Game;

  
