import { Dispatch, FunctionComponent, useContext, useEffect, useState } from "react";
import { GOT } from "../../shared/types";
import { StyledContaiteClose, StyledContaiteHistory, StyledContaiteHistorylst, StyledContaiteHistoryScore, StyledContaiteHistorytile, StyledContaiteHistoryUser, StyledContaiteHistoryUserButton, StyledContaiteHistoryVs, StyledContaiteProfil, StyledContaiteRank, StyledContaiteText, StyledContaiteView, StyledViewAvatar } from "../Styles/StyleViewProfil";
import { FaWindowClose } from 'react-icons/fa';
import { Colors } from "../Colors";
import { v4 as uuid } from 'uuid';
import { SocketContext } from "../../socket/socketPovider";
import { emitSocket } from "../../socket/socketEmit";
import { onSocket } from "../../socket/socketOn";
import { GiRetroController } from "react-icons/gi";
import { GrFormView } from "react-icons/gr";
import { MdOutlineViewInAr } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { emitGame } from "../../socket/socketEmitGame";


interface IProps {
   setPopupProfil:Dispatch<React.SetStateAction<boolean>>;
   login: string;
}

const ProfilView:FunctionComponent<IProps> = (props:IProps) =>{
    const navigate = useNavigate();
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

    const handleInviteGame = ()=>{
        navigate(`/game?code=waiting&id=${profil?.userInfos.login}`)
    }

    const handleSpect = () => {
        navigate(`/game?code=spectator&id=${profil?.inGame}`)
    }

    return(
        <StyledContaiteView>
            <StyledContaiteClose>
                    <FaWindowClose size={30} color={Colors.dark1} onClick={handleClose}/>
            </StyledContaiteClose>
            <StyledContaiteProfil>
                <StyledViewAvatar profilImg={profil?.userInfos.urlImg}/>
                <StyledContaiteText size={"18px"}>{profil?.userInfos.login}</StyledContaiteText>
                <StyledContaiteHistoryUserButton>
                    <GiRetroController size={30} color={Colors.primary} title={"invite game"} onClick={handleInviteGame}/>
                    {profil?.inGame !== undefined ?
                    <MdOutlineViewInAr size={30} color={Colors.primary} title={"View game"} onClick={handleSpect}/>:<></>}
                </StyledContaiteHistoryUserButton>
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
