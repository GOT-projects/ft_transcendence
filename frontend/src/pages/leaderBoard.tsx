import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import Header from "../components/Header"
import {Colors} from "../components/Colors"
import React from 'react'
import { useState } from "react";
import { StyledLead, StyledLeadTile, StyledSep, StyledTile, StyledLeadP, StyledLeadTileRank, Button } from "../components/Styles/StyledleaderBoard";
import {InfoServer, NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { v4 as uuid } from 'uuid';
import { apiSet } from "../api/get";
import { GOT } from '../shared/types';



const LeaderBoard = () => {
    const [profile, setProfile] = useState<GOT.Profile>();
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
    interface Ranks{
        id: string,
        rank:number,
        name:string,
        wins:number,
        lose:number,
        games:string[],
    }
    const [rank] = useState<Ranks[]>([
      {id:uuid(), rank: 1, name: "test1", wins: 302, lose: 102, games: ["2-0", "5-2"]},
      {id:uuid(), rank: 2, name: "test2", wins: 302, lose: 102, games: ["2-1", "5-2"]},

   ]);
   const [clickedButton, setClickedButton] = useState('');
    apiSet.setProfil(profile, setProfile);

	const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const button: HTMLButtonElement = event.currentTarget;
    setClickedButton(button.name);
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
                    profile={profile}
                    />
			<StyledLead>
				<StyledTile>LeaderBoard</StyledTile>
				<StyledSep/>
				<StyledLeadTileRank color={Colors.Sep}>
				<tr>
					<StyledLeadP>Rank</StyledLeadP>
					<StyledLeadP>Name</StyledLeadP>
					<StyledLeadP>Wins</StyledLeadP>
					<StyledLeadP>Loses</StyledLeadP>
				</tr>
				</StyledLeadTileRank>
				<>
				{rank.map((rk: Ranks) => (
					<StyledLeadTile color={Colors.Rank} key={uuid()}>
						<tr>
						<StyledLeadP>{rk.rank}</StyledLeadP>
						<StyledLeadP>
							
						
							<Button onClick={buttonHandler} className="button" name={rk.name}>{rk.name}
							</Button>
								{clickedButton === rk.name
								? <tr >{rk.games?.map((game: string) => (
									<p key={uuid()}>{game}</p>
								))}</tr>: <></>
								}
 
							{/* </Button>
							<li>
								{clickedButton === rk.name
								? `"${clickedButton}" \nscore: ${rk.games}`
								: ""}
							</li> */}
    					
						</StyledLeadP>
						
						<StyledLeadP>{rk.wins}</StyledLeadP>
						<StyledLeadP>{rk.lose}</StyledLeadP>
						</tr>
					</StyledLeadTile>
					// <StyleProfildupersonnage to={"/profil" + userenquestion} user={userenquestion} ></StyleProfildupersonnage>
				)
				)

				}
				</>
			</StyledLead>
			<Footer/>
		</React.Fragment>
	)
}
/*
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
                <thead>
                    <tr>
                        <StyledLeadP>Rank</StyledLeadP>
                        <StyledLeadP>Name</StyledLeadP>
                        <StyledLeadP>Wins</StyledLeadP>
                        <StyledLeadP>Loses</StyledLeadP>
                    </tr>
                </thead>
                </StyledLeadTileRank>
                {rank.map((rk: Ranks) => (
                    <StyledLeadTile color={Colors.Rank} key={rk.id}>
                        <thead>
                            <tr>
                                <StyledLeadP>{rk.rank}</StyledLeadP>
                                <StyledLeadP>{rk.name}</StyledLeadP>
                                <StyledLeadP>{rk.wins}</StyledLeadP>
                                <StyledLeadP>{rk.lose}</StyledLeadP>
                            </tr>
                        </thead>
                    </StyledLeadTile>
                ))}
            </StyledLead>
            <Notification notify={notify} setNotify={setNotify}/>
            <Footer/>
        </React.Fragment>
*/

export default LeaderBoard;

