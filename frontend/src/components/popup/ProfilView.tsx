import { Dispatch, FunctionComponent, useContext, useEffect, useState } from "react";
import { GOT } from "../../shared/types";
import { StyledContaiteClose, StyledContaiteHistory, StyledContaiteHistorylst, StyledContaiteHistoryScore, StyledContaiteHistorytile, StyledContaiteHistoryUser, StyledContaiteHistoryVs, StyledContaiteProfil, StyledContaiteRank, StyledContaiteText, StyledContaiteView, StyledViewAvatar } from "../Styles/StyleViewProfil";
import { FaWindowClose } from 'react-icons/fa';
import { Colors } from "../Colors";
import { v4 as uuid } from 'uuid';
import { SocketContext } from "../../socket/socketPovider";
import { emitSocket } from "../../socket/socketEmit";
import { onSocket } from "../../socket/socketOn";


interface IProps {
   setPopupProfil:Dispatch<React.SetStateAction<boolean>>;
   login: string;
}

const ProfilView:FunctionComponent<IProps> = (props:IProps) =>{
    const socket = useContext(SocketContext);
    const [profil, setProfil] = useState<GOT.HistoryParties>();
    const handleClose = ( ) => {
        props.setPopupProfil(false);
    }

    useEffect(() => {
        onSocket.profil_login(socket, setProfil);
    }, [socket]);

    useEffect(() => {
        emitSocket.emitProfilHisto(socket, props.login);
    }, [socket]);
    return(
        <StyledContaiteView>
            <StyledContaiteClose>
                    <FaWindowClose size={30} color={Colors.dark1} onClick={handleClose}/>
            </StyledContaiteClose>
            <StyledContaiteProfil>
                <StyledViewAvatar profilImg={profil?.userInfos.urlImg}/>
                <StyledContaiteText size={"18px"}>{profil?.userInfos.login}</StyledContaiteText>
            </StyledContaiteProfil>
            <StyledContaiteRank>
                <StyledContaiteText size={"12px"}>{`rank ${profil?.stat.rank} victory ${profil?.stat.victory} lose ${profil?.stat.defeat}`}</StyledContaiteText>
            </StyledContaiteRank>
            <StyledContaiteHistory>
                <StyledContaiteHistorytile>
                    <StyledContaiteText size={"16px"}>HISTORIC</StyledContaiteText>
                </StyledContaiteHistorytile>
                    {
                        profil?.parties.map( (party: GOT.Party) => (
                            
                            <StyledContaiteHistorylst key={uuid()}>
                                <StyledContaiteHistoryUser>
                                    <StyledContaiteText size={"12px"}>{party.user1.login}</StyledContaiteText>
                                </StyledContaiteHistoryUser>
                                <StyledContaiteHistoryVs>
                                    <StyledContaiteText size={"12px"}>VS</StyledContaiteText>
                                </StyledContaiteHistoryVs>
                                <StyledContaiteHistoryUser>
                                    <StyledContaiteText size={"12px"}>{party.user2.login}</StyledContaiteText>
                                </StyledContaiteHistoryUser>
                                <StyledContaiteHistoryScore>
                                    <StyledContaiteText size={"10px"}>{party.points1}-{party.points2}</StyledContaiteText>
                                </StyledContaiteHistoryScore>
                            </StyledContaiteHistorylst>
                        ))
                    }
            </StyledContaiteHistory>
        </StyledContaiteView>
    )
} 

export default ProfilView;
