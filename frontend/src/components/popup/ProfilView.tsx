import { Dispatch, FunctionComponent } from "react";
import { GOT } from "../../shared/types";
import { StyledContaiteClose, StyledContaiteHistory, StyledContaiteHistorylst, StyledContaiteHistoryScore, StyledContaiteHistorytile, StyledContaiteHistoryUser, StyledContaiteHistoryVs, StyledContaiteProfil, StyledContaiteRank, StyledContaiteText, StyledContaiteView, StyledViewAvatar } from "../Styles/StyleViewProfil";
import { FaWindowClose } from 'react-icons/fa';
import { Colors } from "../Colors";


interface IProps {
   profil: GOT.Profile | undefined;
   setPopupProfil:Dispatch<React.SetStateAction<boolean>>;
   login: GOT.User | undefined;
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
                <StyledViewAvatar profilImg={props.login?.urlImg}/>
                <StyledContaiteText size={"18px"}>{props.login?.username}</StyledContaiteText>
            </StyledContaiteProfil>
            <StyledContaiteRank>
                <StyledContaiteText size={"12px"}>{`rank ${props.profil?.stat.rank} victory ${props.profil?.stat.victory} lose ${props.profil?.stat.defeat}`}</StyledContaiteText>
            </StyledContaiteRank>
            <StyledContaiteHistory>
                <StyledContaiteHistorytile>
                    <StyledContaiteText size={"16px"}>history game</StyledContaiteText>
                </StyledContaiteHistorytile>
                <StyledContaiteHistorylst>
                    <StyledContaiteHistoryUser>
                        <StyledContaiteText size={"12px"}>robert</StyledContaiteText>
                    </StyledContaiteHistoryUser>
                    <StyledContaiteHistoryVs>
                        <StyledContaiteText size={"12px"}>VS</StyledContaiteText>
                    </StyledContaiteHistoryVs>
                    <StyledContaiteHistoryUser>
                        <StyledContaiteText size={"12px"}>robert</StyledContaiteText>
                    </StyledContaiteHistoryUser>
                    <StyledContaiteHistoryScore>
                        <StyledContaiteText size={"12px"}>{`0 - 1`}</StyledContaiteText>
                    </StyledContaiteHistoryScore>
                </StyledContaiteHistorylst>
            </StyledContaiteHistory>
        </StyledContaiteView>
    )
} 

export default ProfilView;
