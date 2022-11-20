import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import Header from "../components/Header"
import {Colors} from "../components/Colors"
import React from 'react'
import { useState } from "react";
import { StyledLead, StyledLeadTile, StyledSep, StyledTile, StyledLeadP, StyledLeadTileRank, Button } from "../components/Styles/StyledleaderBoard";
import { ResultType } from "@remix-run/router/dist/utils";
import { v4 as uuid } from 'uuid';

const LeaderBoard = () => {
	interface Ranks{
		rank:number,
		name:string,
		wins:number,
		lose:number,
		games:string[],
	}
	const [rank] = useState<Ranks[]>([
	  {rank: 1, name: "test1", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 2, name: "robert paul", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 3, name: "henri jean", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 4, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 5, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 6, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 7, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 8, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 9, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 10, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 11, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 12, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 13, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 14, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 15, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 16, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 17, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 18, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 19, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 20, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 21, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 22, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 23, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 24, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 25, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 26, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 27, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 28, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 29, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 30, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 31, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 32, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 33, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 34, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 35, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 36, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 37, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 38, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 39, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 40, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 41, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 42, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 43, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 44, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 45, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 46, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 47, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 48, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 49, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 50, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 51, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 52, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 53, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
	  {rank: 54, name: "test4", wins: 302, lose: 102, games:["0-2", "1-0"]},
   ]);
   const [clickedButton, setClickedButton] = useState('');

	const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const button: HTMLButtonElement = event.currentTarget;
    setClickedButton(button.name);
	};

//    const showprofil = () => {
// 		return (
			
// 		);
//    }
	return (
		<React.Fragment>
			<BackgroundAnimate name="LeaderBoard"/>
			<Header colorHome={Colors.MenuDisable} colorGame={Colors.MenuDisable} colorLeadBoard={Colors.MenuActive} colorChat={Colors.MenuDisable}/>
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
							{/* employees.forEach((employee, index) => {
    results.push(
      <div key={index}>
        <h2>name: {employee.name}</h2>
        <h2>country: {employee.country}</h2>

        <hr />
      </div>,
    );
  }); */}
							</Button>
								{clickedButton === rk.name
								? <tr >{rk.games?.map((game) => (
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

export default LeaderBoard;

