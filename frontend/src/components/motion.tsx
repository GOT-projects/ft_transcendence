import {Routes, Route, useLocation} from 'react-router-dom'

import React, { useState } from 'react'
import { GOT } from '../shared/types'
const LazyLogin = React.lazy(() => import("../pages/Login"))
const LazyGame = React.lazy(() => import("../pages/Game"))
const LazyWaiting = React.lazy(() => import("../pages/Waiting"))
const LazyChat = React.lazy(() => import("../pages/contact"))
const LazyAuthGuard = React.lazy(() => import("../Guard/AuthGuard"))
const LazyInvite = React.lazy(() => import("../pages/Invite"))
const LazyLeaderBoard = React.lazy(() => import("../pages/leaderBoard"))

const MotionRoutes = () => {
	const location = useLocation();
	const [profil, setProfil] = useState<GOT.Profile>();

	return (
	   <Routes location={location} key={location.pathname}>
		  <Route path="/" element={<LazyLogin/>}/>
		  <Route path="/waiting" element={<LazyWaiting/>}/>
		   <Route path="/game" element={
			   <LazyAuthGuard>
                    <React.Suspense fallback='loading...'>
				        <LazyGame profil={profil}  setProfil={setProfil}/>
                    </React.Suspense>
			   </LazyAuthGuard>
			   }/>
		  <Route path="/chat" element={
				<LazyAuthGuard>
                    <React.Suspense fallback='loading...'>
				        <LazyChat profil={profil}  setProfil={setProfil}/>
                    </React.Suspense>
				</LazyAuthGuard>
			   }/>
		  <Route path="/leaderboard" element={
			   <LazyAuthGuard>
                    <React.Suspense fallback='loading...'>
				        <LazyLeaderBoard profil={profil}  setProfil={setProfil}/>
                    </React.Suspense>
			   </LazyAuthGuard>
			   }/>
          {process.env.NODE_ENV !== 'production' ?
		   <Route path="/invite" element={
                    <React.Suspense fallback='loading...'>
				        <LazyInvite/>
                    </React.Suspense>
			   }/>: <></>}
	   </Routes>
	)
}

export default MotionRoutes;
