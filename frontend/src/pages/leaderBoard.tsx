import BackgroundAnimate from "../components/BackGroundAnimate";
import Footer from "../components/Footer";
import Header from "../components/Header"
import {Colors} from "../components/Colors"
import React from 'react'
import { useState } from "react";
import { StyledLead, StyledLeadTile, StyledSep, StyledTile, StyledLeadP, StyledLeadTileRank } from "../components/Styles/StyledleaderBoard";
import {InfoServer, NotifyInter} from "../components/interfaces"
import {Notification} from "../components/Notify"
import { v4 as uuid } from 'uuid';

const LeaderBoard = () => {
    const [notify, setNotify] = useState<NotifyInter>({isOpen: false, message:'', type:''});
    interface Ranks{
        id: string,
        rank:number,
        name:string,
        wins:number,
        lose:number,
    }
    const [rank] = useState<Ranks[]>([
      {id:uuid(), rank: 1, name: "test1", wins: 302, lose: 102},
      {id:uuid(), rank: 2, name: "test2", wins: 302, lose: 102},
   ]);
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
	)
}

export default LeaderBoard;

