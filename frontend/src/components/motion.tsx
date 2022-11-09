import {Routes, Route, useLocation} from 'react-router-dom'

import Login from "../pages/Login"
import Game from "../pages/Game"
import Leadboard from "../pages/leaderBoard"
import Waiting from "../pages/Waiting"
import Chat from '../pages/contact'

const MotionRoutes = () => {
         const location = useLocation();
         return (
            <Routes location={location} key={location.pathname}>
               <Route path="/" element={<Login/>}/>
               <Route path="/game" element={<Game/>}/>
               <Route path="/chat" element={<Chat/>}/>
               <Route path="/waiting" element={<Waiting/>}/>
               <Route path="/leaderboard" element={<Leadboard/>}/>
            </Routes>
         )
}  

export default MotionRoutes;
