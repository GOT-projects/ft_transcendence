import { Dispatch, FunctionComponent } from "react";
import { GOT } from "../../shared/types";
import { StyledContaiteClose, StyledContaiteHistory, StyledContaiteHistorylst, StyledContaiteHistoryScore, StyledContaiteHistorytile, StyledContaiteHistoryUser, StyledContaiteHistoryVs, StyledContaiteProfil, StyledContaiteRank, StyledContaiteText, StyledContaiteView, StyledViewAvatar } from "../Styles/StyleViewProfil";
import { FaWindowClose } from 'react-icons/fa';
import { Colors } from "../Colors";
import { v4 as uuid } from 'uuid';


interface IProps {
   profil: GOT.HistoryParties | undefined;
   setPopupProfil:Dispatch<React.SetStateAction<boolean>>;
}

const ProfilView:FunctionComponent<IProps> = (props:IProps) =>{
    const handleClose = ( ) => {
        props.setPopupProfil(false);
    }
    return(
        <StyledContaiteView>
            <StyledContaiteClose>
                    <FaWindowClose size={30} color={Colors.dark1} onClick={handleClose}/>
            </StyledContaiteClose>
            <StyledContaiteProfil>
                <StyledViewAvatar profilImg={props.profil?.userInfos.urlImg}/>
                <StyledContaiteText size={"18px"}>{props.profil?.userInfos.username}</StyledContaiteText>
            </StyledContaiteProfil>
            <StyledContaiteRank>
                <StyledContaiteText size={"12px"}>{`rank ${props.profil?.stat.rank} victory ${props.profil?.stat.victory} lose ${props.profil?.stat.defeat}`}</StyledContaiteText>
            </StyledContaiteRank>
            <StyledContaiteHistory>
                <StyledContaiteHistorytile>
                    <StyledContaiteText size={"16px"}>HISTORIC</StyledContaiteText>
                </StyledContaiteHistorytile>
                    {
                        props.profil?.parties.map( (party: GOT.Party) => (
                            
                            <StyledContaiteHistorylst>
                                <StyledContaiteHistoryUser>
                                    <StyledContaiteText size={"12px"}>{party.user1.username}</StyledContaiteText>
                                </StyledContaiteHistoryUser>
                                <StyledContaiteHistoryVs>
                                    <StyledContaiteText size={"12px"}>VS</StyledContaiteText>
                                </StyledContaiteHistoryVs>
                                <StyledContaiteHistoryUser>
                                    <StyledContaiteText size={"12px"}>{party.user2.username}</StyledContaiteText>
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
