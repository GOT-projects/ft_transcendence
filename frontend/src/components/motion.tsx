import {Routes, Route, useLocation} from 'react-router-dom'
import Login from "../pages/Login"
import Home from "../pages/Home"
import Game from "../pages/Game"
import Leadboard from "../pages/leaderBoard"
import Waiting from "../pages/Waiting"
import AuthGuard from '../Guard/AuthGuard'

const MotionRoutes = () => {
         const location = useLocation();
         return (
            <Routes location={location} key={location.pathname}>
               <Route path="/" element={<Login/>}/>
               <Route path="/waiting" element={<Waiting/>}/>
                <Route path="/game" element={
                    <AuthGuard>
                        <Game/>
                    </AuthGuard>
                    }/>
               <Route path="/contact" element={
                    <AuthGuard>
                        <Game/>
                    </AuthGuard>
                    }/>
               <Route path="/leaderboard" element={
                    <AuthGuard>
                        <Leadboard/>
                    </AuthGuard>
                    }/>
            </Routes>
         )
}  

export default MotionRoutes;
