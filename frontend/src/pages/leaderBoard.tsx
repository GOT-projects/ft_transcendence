import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import Header from "../components/Header"
import {Colors} from "../components/Colors"


import { StyledLead, StyledLeadTile, StyledSep, StyledTile, StyledLeadP, StyledLeadTileRank, Button } from "../components/Styles/StyledleaderBoard";
import {InfoServer, NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { v4 as uuid } from 'uuid';
import { apiGet } from "../api/get";
import { SocketContext } from "../socket/socketPovider";
import { tmpdir } from "os";
import React, { useContext, useState, useEffect, useRef, FunctionComponent } from 'react';
import { GOT } from "../shared/types";

/*
async function useInterval(callback: any, delay: number) {
	const savedCallback: any = useRef();
	
	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);
	
	// Set up the interval.
	useEffect(() => {
		function tick() {
			if (savedCallback.current)
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}
*/



const LeaderBoard= () => {
    const socket = useContext(SocketContext);
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
    const [tab, setTab] = useState<GOT.LeaderBoard>();
    const [clickedButton, setClickedButton] = useState('');
    const request = () => {
        socket.emit("server_leaderboard", "leaderboard");
    }
    
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

    
	const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const button: HTMLButtonElement = event.currentTarget;
        setClickedButton(button.name);
	};

    if (!tab)
        request();

	return (
        
        <React.Fragment>
			<BackgroundAnimate name="LeaderBoard"/>
			<Header colorHome={Colors.MenuDisable} 
                    colorGame={Colors.MenuDisable} 
                    colorLeadBoard={Colors.MenuActive} 
                    colorChat={Colors.MenuDisable}
                    notify={notify}
                    setNotify={setNotify}/>
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
                    <tr>
                        <Button onClick={buttonHandler} className="button" name={usr.userInfos.username}>{usr.userInfos.username}</Button>
                        <StyledLeadP>{usr.stat.rank}</StyledLeadP>
                        <StyledLeadP>{usr.stat.victory}</StyledLeadP>
                        <StyledLeadP>{usr.stat.defeat}</StyledLeadP>
                    </tr>
                ))
                // rank.map((rk: Ranks) => (
                    // 	<StyledLeadTile color={Colors.Rank} key={uuid()}>
                    // 		<tr>
                    // 		<StyledLeadP>{rk.rank}</StyledLeadP>
                    // 		<StyledLeadP>
                    // 			<Button onClick={buttonHandler} className="button" name={rk.name}>{rk.name}
                    // 			</Button>
                //                 {clickedButton === rk.name 
                                
                //                     ? <tr >{ tmppp?.map((game: GOT.Party) => (
                    //                         <p key={uuid()}>
                    //                             {game.user1 + " " + game.points1} - {game.points2 + " " + game.user2}
                    //                         </p>))}
                    //                     </tr>
                    //                     : <></>
                    // 				}
                    //                 {/* {clickedButton === rk.name
                    //                 ? <tr >{rk.games?.map((game: string) => (
                        // 					<p key={uuid()}>
                        //                         {game}
                        //                     </p>))}
                        //                 </tr>
                        //                 : <></>
                    // 				} */}
                    // 		</StyledLeadP>
                    // 		<StyledLeadP>{rk.wins}</StyledLeadP>
                    // 		<StyledLeadP>{rk.lose}</StyledLeadP>
                    // 		</tr>
                    // 	</StyledLeadTile>))
                    
                }
				</>
				</StyledLeadTileRank>
                    
       
			</StyledLead>
			<Footer/>
		</React.Fragment>
	)
}

export default LeaderBoard;
