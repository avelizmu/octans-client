import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "./context/UserContext";
import axios from "axios";
import HomePage from "./components/HomePage/HomePage";
import MediaPage from "./components/MediaPage/MediaPage";

export default function AppRouter() {
    const [user, setUser] = useContext(UserContext)
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        axios.post('/api/users/login', {})
            .then(response => {
                setUser?.(response.data);
                setChecked(true);
            })
            .catch((e) => {
                setChecked(true);
            })
    }, [])

    return <Router>
        {
            user ?
                <Routes>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/media/:hash" element={<MediaPage/>}/>
                    <Route path="*" element={<Navigate to="/home"/>}/>
                </Routes> :
                <Routes>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="*" element={checked ? <Navigate to={'/login'}/> : <LoginPage/>}/>
                </Routes>
        }
    </Router>
}