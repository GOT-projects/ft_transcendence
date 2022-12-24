import styled from 'styled-components';
import {Colors} from "../Colors"

interface mousePos {
	x: string;
	y: string;
}

export const StyledCursor = styled.div<mousePos>`
		z-index: -1;
		position: fixed;
		top: ${p => p.y};
		left: ${p => p.x};
		background: ${Colors.cursorColor};
		width: 50px;
		height: 50px;
		opacity: 0.6;
		border-radius: 50%;
		cursor: none;
		box-shadow: 10px 5px 5px red;;
								0 0 20px red;
								0 0 20px red;
		&:before{
				cursor: none;
				content: '';
				position: absolute;
				background: ${Colors.cursorColor};
				width: 50px;
				height: 50px;
				opacity: 0.2;
				transform: translate(-30%, -30%);
				border-radius: 50%;
		}
`;

