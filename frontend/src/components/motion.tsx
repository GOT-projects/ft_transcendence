import {Routes, Route, useLocation} from 'react-router-dom'

import Login from "../pages/Login"
import Game from "../pages/Game"
import Leadboard from "../pages/leaderBoard"
import Waiting from "../pages/Waiting"
import Chat from '../pages/contact'
import AuthGuard from '../Guard/AuthGuard'
import Invite from '../pages/Invite'

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
               <Route path="/chat" element={
                    <AuthGuard>
                        <Chat/>
                    </AuthGuard>
                    }/>
               <Route path="/leaderboard" element={
                    <AuthGuard>
                        <Leadboard/>
                    </AuthGuard>
                    }/>
                <Route path="/invite" element={
                        <Invite/>
                    }/>
            </Routes>
         )
}  

export default MotionRoutes;
