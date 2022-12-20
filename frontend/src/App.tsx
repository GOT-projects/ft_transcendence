import { SnackbarProvider } from 'notistack';
import {BrowserRouter as Router} from 'react-router-dom'
import MotionRoutes from "./components/motion"
import { SocketContext, socket } from './socket/socketPovider';

function App() {
  return ( 
  <SnackbarProvider maxSnack={2} preventDuplicate >
   <SocketContext.Provider value={socket}>
    <Router>
       <MotionRoutes/>
    </Router>
   </SocketContext.Provider>
   </SnackbarProvider>

  )
}

export default App;
