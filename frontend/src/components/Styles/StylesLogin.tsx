import styled from 'styled-components';
import {Colors} from "../Colors"

interface Props {
  height: string;
}
export const StyledLogin = styled.body<Props>`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	height: ${p => p.height};
`;


export const StyledLoginTitle = styled.h1`
	font-family: 'Odibee Sans';
	font-weight: 400;
	color: ${Colors.primary};
`;
export const StyledLoginButton = styled.button`
	weight: 8rem;	
	height: 2rem;
	border-radius: 6px;
	color: ${Colors.dark1};
`;
