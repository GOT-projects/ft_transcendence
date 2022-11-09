import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import Header from "../components/Header"
import {Colors} from "../components/Colors"
import React from 'react'
import { useState } from "react";
import { StyledLead, StyledLeadTile, StyledSep, StyledTile, StyledLeadP, StyledLeadTileRank } from "../components/Styles/StyledleaderBoard";

const LeaderBoard = () => {
    interface Ranks{
        rank:number,
        name:string,
        wins:number,
        lose:number,
    }
    const [rank] = useState<Ranks[]>([
      {rank: 1, name: "test1", wins: 302, lose: 102},
      {rank: 2, name: "robert paul", wins: 302, lose: 102},
      {rank: 3, name: "henri jean", wins: 302, lose: 102},
      {rank: 4, name: "test4", wins: 302, lose: 102},
      {rank: 5, name: "test4", wins: 302, lose: 102},
      {rank: 6, name: "test4", wins: 302, lose: 102},
      {rank: 7, name: "test4", wins: 302, lose: 102},
      {rank: 8, name: "test4", wins: 302, lose: 102},
      {rank: 9, name: "test4", wins: 302, lose: 102},
      {rank: 10, name: "test4", wins: 302, lose: 102},
      {rank: 11, name: "test4", wins: 302, lose: 102},
      {rank: 12, name: "test4", wins: 302, lose: 102},
      {rank: 13, name: "test4", wins: 302, lose: 102},
      {rank: 14, name: "test4", wins: 302, lose: 102},
      {rank: 15, name: "test4", wins: 302, lose: 102},
      {rank: 16, name: "test4", wins: 302, lose: 102},
      {rank: 17, name: "test4", wins: 302, lose: 102},
      {rank: 18, name: "test4", wins: 302, lose: 102},
      {rank: 19, name: "test4", wins: 302, lose: 102},
      {rank: 20, name: "test4", wins: 302, lose: 102},
      {rank: 21, name: "test4", wins: 302, lose: 102},
      {rank: 22, name: "test4", wins: 302, lose: 102},
      {rank: 23, name: "test4", wins: 302, lose: 102},
      {rank: 24, name: "test4", wins: 302, lose: 102},
      {rank: 25, name: "test4", wins: 302, lose: 102},
      {rank: 26, name: "test4", wins: 302, lose: 102},
      {rank: 27, name: "test4", wins: 302, lose: 102},
      {rank: 28, name: "test4", wins: 302, lose: 102},
      {rank: 29, name: "test4", wins: 302, lose: 102},
      {rank: 30, name: "test4", wins: 302, lose: 102},
      {rank: 31, name: "test4", wins: 302, lose: 102},
      {rank: 32, name: "test4", wins: 302, lose: 102},
      {rank: 33, name: "test4", wins: 302, lose: 102},
      {rank: 34, name: "test4", wins: 302, lose: 102},
      {rank: 35, name: "test4", wins: 302, lose: 102},
      {rank: 36, name: "test4", wins: 302, lose: 102},
      {rank: 37, name: "test4", wins: 302, lose: 102},
      {rank: 38, name: "test4", wins: 302, lose: 102},
      {rank: 39, name: "test4", wins: 302, lose: 102},
      {rank: 40, name: "test4", wins: 302, lose: 102},
      {rank: 41, name: "test4", wins: 302, lose: 102},
      {rank: 42, name: "test4", wins: 302, lose: 102},
      {rank: 43, name: "test4", wins: 302, lose: 102},
      {rank: 44, name: "test4", wins: 302, lose: 102},
      {rank: 45, name: "test4", wins: 302, lose: 102},
      {rank: 46, name: "test4", wins: 302, lose: 102},
      {rank: 47, name: "test4", wins: 302, lose: 102},
      {rank: 48, name: "test4", wins: 302, lose: 102},
      {rank: 49, name: "test4", wins: 302, lose: 102},
      {rank: 50, name: "test4", wins: 302, lose: 102},
      {rank: 51, name: "test4", wins: 302, lose: 102},
      {rank: 52, name: "test4", wins: 302, lose: 102},
      {rank: 53, name: "test4", wins: 302, lose: 102},
      {rank: 54, name: "test4", wins: 302, lose: 102},
   ]);
	return (
        <React.Fragment>
            <BackgroundAnimate/>
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
                    <StyledLeadTile color={Colors.Rank}>
                        <tr>
                        <StyledLeadP>{rk.rank}</StyledLeadP>
                        <StyledLeadP>{rk.name}</StyledLeadP>
                        <StyledLeadP>{rk.wins}</StyledLeadP>
                        <StyledLeadP>{rk.lose}</StyledLeadP>
                        </tr>
                    </StyledLeadTile>
                ))}
                </>
            </StyledLead>
            <Footer/>
        </React.Fragment>
	)
}

export default LeaderBoard;

