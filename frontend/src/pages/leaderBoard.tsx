import {Colors} from "../components/Colors"
import React, { Dispatch, FunctionComponent } from 'react'
import { useContext, useState, useEffect } from 'react';
import { StyledLead, StyledSep, StyledTile, StyledLeadP, StyledLeadTileRank, StyledLeadB, StyledSepController, StyledLeadPHead } from "../components/Styles/StyledleaderBoard";
import { NotifyInter} from "../components/interfaces"
import { v4 as uuid } from 'uuid';
import { GOT } from "../shared/types";
import { SocketContext, SocketContextGame } from "../socket/socketPovider";
import { emitSocket } from "../socket/socketEmit";
import { GiRetroController } from 'react-icons/gi';
import { emitGame } from "../socket/socketEmitGame";
const Footer = React.lazy(() => import("../components/Footer"))
const Header = React.lazy(() => import("../components/Header"))
const ProfilView = React.lazy(() => import('../components/popup/ProfilView'))
const BackgroundAnimate = React.lazy(() => import("../components/BackGroundAnimate"))


interface IProps {
   profil: GOT.Profile | undefined;
   setProfil: Dispatch<React.SetStateAction<GOT.Profile | undefined>> | undefined;
}

const LeaderBoard:FunctionComponent<IProps> = (props:IProps)=> {
	const socket = useContext(SocketContext);
	const socketGame = useContext(SocketContextGame);

	const [popuProfil, setPopupProfil] = useState(false);
	const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
	const [tab, setTab] = useState<GOT.LeaderBoard>();
	const [login, setLogin] = useState<string>("");

	useEffect(() => {
		emitGame.emit_where_am_I(socketGame,"no_where");
	}, [socketGame])

	useEffect(() => {
		emitSocket.emitLeaderboard(socket);
	}, [socket])

	useEffect(() => {
		socket.on("client_leaderboard", (e: GOT.LeaderBoard) => {
			if (e)
				setTab(e);
		});
		return () => {
			socket.off('client_leaderboard');
		}
	}, [socket, tab]);

	const buttonHandler = (handleLogin: string) => {
		if (popuProfil === false){
			setLogin(handleLogin);
			setPopupProfil(true);
		}
		else{
			setPopupProfil(false);
		}
	};

	return (
		<React.Fragment>
			<BackgroundAnimate name="LeaderBoard"/>
            <React.Suspense fallback='loading...'>
			<Header colorHome={Colors.MenuDisable}
					colorGame={Colors.MenuDisable}
					colorLeadBoard={Colors.MenuActive}
					colorChat={Colors.MenuDisable}
					notify={notify}
					setNotify={setNotify}
					profil={props.profil}
					setProfil={props.setProfil}
					/>
            </React.Suspense>
			<StyledLead>
				<StyledTile>LeaderBoard</StyledTile>
				<StyledSep/>
				<StyledLeadTileRank color={Colors.Sep}>
				<thead>
					<tr style={{borderCollapse: "collapse"}}>
						<StyledLeadPHead>Name</StyledLeadPHead>
						<StyledLeadPHead>Rank</StyledLeadPHead>
						<StyledLeadPHead>Wins</StyledLeadPHead>
						<StyledLeadPHead>Loses</StyledLeadPHead>
					</tr>
				</thead>
				<tbody style={{overflow: "scroll"}}>
					<>
					{
						tab?.map((usr: GOT.ProfileLeaderBoard) => (
						<tr key={uuid()} >
							<td>
								<div style={{display: "flex", flexDirection: "row" , justifyContent: "space-between"}}>
									{usr.inGame !== undefined ? <GiRetroController size={"20px"} color="white"/> : <StyledSepController/>}
									<StyledLeadB onClick={() => {buttonHandler(usr.userInfos.login)}} className="button">{usr.userInfos.login}</StyledLeadB>
								</div>
							</td>
							<StyledLeadP style={{textAlign: "center"}}>{usr.stat.rank}</StyledLeadP>
							<StyledLeadP style={{textAlign: "center"}}>{usr.stat.victory}</StyledLeadP>
							<StyledLeadP style={{textAlign: "center"}}>{usr.stat.defeat}</StyledLeadP>
						</tr>
						))
					}
					</>
				</tbody>
				</StyledLeadTileRank>
			</StyledLead>
			{
            popuProfil ?
            <React.Suspense fallback='loading...'>
                <ProfilView login={login} setPopupProfil={setPopupProfil} profil={props.profil}/> 
            </React.Suspense>
            : <> </>}
            <React.Suspense fallback='loading...'>
			    <Footer/>
            </React.Suspense>
		</React.Fragment>
	)
}

export default LeaderBoard;
