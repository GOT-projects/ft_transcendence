import { SnackbarProvider } from 'notistack';
import {BrowserRouter as Router} from 'react-router-dom'
import MotionRoutes from "./components/motion"
import { SocketContext, socket, SocketContextGame, socketGame } from './socket/socketPovider';

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
