
import styled from 'styled-components';
import {Colors} from "../Colors"

export const StyledFooter = styled.div`
	display: block;
	position: fixed;
	bottom:0;
	width: 100%;
	height: 40px;
	background-color: ${Colors.dark1};
	opacity: 0.8;
	z-index: 20;
	cursor: pointer;
`;
export const StyledFooterContaite = styled.div`
	margin: 0;
	padding: 0;
	display: flex;
	align-items: center;
`;


export const StyledFooterP = styled.p`
	margin: 0px;
	padding-left: 20px;
	color: ${Colors.primary};
	@media screen and (max-width: 768px){
		font-size: 12px;
		padding-left: 10px;
	}
`;

export const StyledFooterGit = styled.a`
	margin: 10px;
	margin-right: 0px;
	margin-left: 0px;
	padding-left: 20px;
	text-decoration: none;
	align-items: center;
	color: ${Colors.primary};
	transition: 0.2s;
	&:hover{
		font-weight: bold;
		transition: 0.2s;
		color: ${Colors.border};
	}
	@media screen and (max-width: 768px){
		font-size: 12px;
		padding-left: 10px;
	}
`;
export const StyleFooterGithub = styled.a`
	position: absolute;
	right: 0;
	bottom: 0;
	margin-right: 30px;
	margin-bottom: 5px;
	&:hover{
		 transition: 0.8s;
		 cursor: pointer;
		 color: ${Colors.border};
	}
	transition: 0.8s;
	color: ${Colors.primary};
	z-index: 20;
	@media screen and (max-width: 768px){
		margin-right: 20px;
		margin-bottom: 5px;
	}
`;
