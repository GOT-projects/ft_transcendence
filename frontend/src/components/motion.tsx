import {Routes, Route, useLocation} from 'react-router-dom'

import Login from "../pages/Login"
import Game from "../pages/Game"
import Leadboard from "../pages/leaderBoard"
import Waiting from "../pages/Waiting"
import Chat from '../pages/contact'
import AuthGuard from '../Guard/AuthGuard'
import Invite from '../pages/Invite'
import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../socket/socketPovider'
import LeaderBoard from '../pages/leaderBoard'
import { GOT } from '../shared/types'

const MotionRoutes = () => {
    const location = useLocation();
    const [profil, setProfil] = useState<GOT.Profile>();
    return (
       <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Login/>}/>
          <Route path="/waiting" element={<Waiting/>}/>
           <Route path="/game" element={
               <AuthGuard>
                   <Game profil={profil}  setProfil={setProfil}/>
               </AuthGuard>
               }/>
          <Route path="/chat" element={
                <AuthGuard>
                   <Chat profil={profil}  setProfil={setProfil}/>
                </AuthGuard>
               }/>
          <Route path="/leaderboard" element={
               <AuthGuard>
                   <LeaderBoard profil={profil}  setProfil={setProfil}/>
               </AuthGuard>
               }/>
           <Route path="/invite" element={
                   <Invite/>
               }/>
       </Routes>
    )
}  

export default MotionRoutes;
