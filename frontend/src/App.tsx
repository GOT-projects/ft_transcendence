import { SnackbarProvider } from 'notistack';
import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import { SocketContext, socket, SocketContextGame, socketGame } from './socket/socketPovider';
const MotionRoutes  = React.lazy(() => import("./components/motion"))

function App() {
	return (
		<SnackbarProvider maxSnack={2} preventDuplicate >
			<SocketContext.Provider value={socket}>
			<SocketContextGame.Provider value={socketGame}>
				<Router>
					<MotionRoutes/>
				</Router>
			</SocketContextGame.Provider>
			</SocketContext.Provider>
		</SnackbarProvider>
	)
}

export default App;
