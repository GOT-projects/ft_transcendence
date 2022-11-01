import {Routes, Route, useLocation} from 'react-router-dom'
import Login from "../pages/Login"
import Game from "../pages/Game"
// import { AnimatePresence } from "framer-motion";

const MotionRoutes = () => {
         const location = useLocation();
         return (
            <Routes location={location} key={location.pathname}>
               <Route path="/" element={<Login/>}/>
               <Route path="/game" element={<Game/>}/>
            </Routes>
         )
}  

export default MotionRoutes;
