import {Routes, Route, useLocation} from 'react-router-dom'
import Login from "../pages/Login"
import Home from "../pages/Home"
import Game from "../pages/Game"
import Leadboard from "../pages/leaderBoard"

const MotionRoutes = () => {
         const location = useLocation();
         return (
            <Routes location={location} key={location.pathname}>
               <Route path="/" element={<Login/>}/>
               <Route path="/home" element={<Home/>}/>
               <Route path="/game" element={<Game/>}/>
               <Route path="/contact" element={<Home/>}/>
               <Route path="/leaderboard" element={<Leadboard/>}/>
            </Routes>
         )
}  

export default MotionRoutes;
