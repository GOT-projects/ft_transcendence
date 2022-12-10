import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import Header from "../components/Header"
import {Colors} from "../components/Colors"
import React, { Dispatch, FunctionComponent } from 'react'
import { useContext, useState, useEffect, useRef} from 'react';
import { StyledLead, StyledLeadTile, StyledSep, StyledTile, StyledLeadP, StyledLeadTileRank, Button } from "../components/Styles/StyledleaderBoard";
import {InfoServer, NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { v4 as uuid } from 'uuid';
import { apiGet } from "../api/get";
import { GOT } from "../shared/types";
import { SocketContext } from "../socket/socketPovider";
import { tmpdir } from "os";
import { emitSocket } from "../socket/socketEmit";
import Axios from "../services/Axios";
import ProfilView from '../components/popup/ProfilView';


interface IProps {
   profil: GOT.Profile | undefined;
   setProfil: Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
}

const LeaderBoard:FunctionComponent<IProps> = (props:IProps)=> {
    const socket = useContext(SocketContext);

    const [popuProfil, setPopupProfil] = useState(false);
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
    const [tab, setTab] = useState<GOT.LeaderBoard>();
    const [histo, setHisto] = useState<GOT.HistoryParties>();
    const [login, setLogin] = useState<string>("");

    useEffect(() => {
        emitSocket.emitLeaderboard(socket);
    }, [socket])

    useEffect(() => {
        socket.on("client_leaderboard", (e: GOT.LeaderBoard) => {
            console.log(e);
            if (e)
                setTab(e);
        });
        return () => {
            socket.off('client_leaderboard');
        }
    }, [tab]);
    
    useEffect(() => {
        socket.on("client_profil_login", (e: GOT.HistoryParties) => {
            console.log(e);
            e.parties[0] = {user1: e.userInfos, user2: e.userInfos, points1: 102, points2: 205};
            e.parties[1] = {user1: e.userInfos, user2: e.userInfos, points1: 220, points2: 105};
            if (e)
                setHisto(e);
        });
        return () => {
            socket.off('client_profil_login');
        }
    }, [histo]);

	const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const button: HTMLButtonElement = event.currentTarget;
        emitSocket.emitProfilHisto(socket, button.name);
        if (popuProfil === false){
            setPopupProfil(true);
            setLogin(button.name);
        }
        else{
            setLogin(button.name);
            setPopupProfil(false);
        }
	};

	return (
        <React.Fragment>
			<BackgroundAnimate name="LeaderBoard"/>
			<Header colorHome={Colors.MenuDisable} 
                    colorGame={Colors.MenuDisable} 
                    colorLeadBoard={Colors.MenuActive} 
                    colorChat={Colors.MenuDisable}
                    notify={notify}
                    setNotify={setNotify}
                    profil={props.profil}
                    setProfil={props.setProfil}
                    />
			<StyledLead>
				<StyledTile>LeaderBoard</StyledTile>
				<StyledSep/>
				<StyledLeadTileRank color={Colors.Sep}>
				<tr>
					<StyledLeadP>Name</StyledLeadP>
					<StyledLeadP>Rank</StyledLeadP>
					<StyledLeadP>Wins</StyledLeadP>
					<StyledLeadP>Loses</StyledLeadP>
				</tr>
                <>
				{
                    tab?.map((usr: GOT.ProfileLeaderBoard) => (
                    <tr key={uuid()}>
                        <Button onClick={buttonHandler} className="button" name={usr.userInfos.username}>{usr.userInfos.username}</Button>
                        <StyledLeadP>{usr.stat.rank}</StyledLeadP>
                        <StyledLeadP>{usr.stat.victory}</StyledLeadP>
                        <StyledLeadP>{usr.stat.defeat}</StyledLeadP>
                    </tr>
                    ))
                }
				</>
				</StyledLeadTileRank>
			</StyledLead>
            {popuProfil ? <ProfilView login={login} setPopupProfil={setPopupProfil}/> : <> </>}
			<Footer/>
		</React.Fragment>
	)
}

export default LeaderBoard;
