import { StyledFooter, StyledFooterP, StyleFooterGithub, StyledFooterGit,StyledFooterContaite} from "./Styles/StyleFooter";
import { BsGithub } from 'react-icons/bs';

const Footer = () => {
	return (
		<StyledFooter>
			<StyledFooterContaite>
				<StyledFooterP>
					Create by
				</StyledFooterP>
				<StyledFooterGit href="https://github.com/valktaelen" target="_blank">
					<StyledFooterP>Aartiges</StyledFooterP>
				</StyledFooterGit>
				<StyledFooterGit href="https://github.com/Roymain" target="_blank">
					<StyledFooterP>Rcuminal</StyledFooterP>
				</StyledFooterGit>
				<StyledFooterGit href="https://github.com/waxdred" target="_blank">
					<StyledFooterP>Jmilhas</StyledFooterP>
				</StyledFooterGit>
			</StyledFooterContaite>
				<StyleFooterGithub href="https://github.com/valktaelen/ft_transcendence" target="_blank">
			<BsGithub size={25}/>
		 </StyleFooterGithub>
		</StyledFooter>
	)
}

export default Footer;

