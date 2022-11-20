import {BrowserRouter as Router} from 'react-router-dom'
import MotionRoutes from "./components/motion"
// import { SocketContext, socket } from './socket/socketPovider';

function App() {
  return ( 
  // <SocketContext.Provider value={socket}>
    <Router>
       <MotionRoutes/>
    </Router>
  // </SocketContext.Provider>
  )
}

export default App;
