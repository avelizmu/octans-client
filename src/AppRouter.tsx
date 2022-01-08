import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import {useContext, useEffect} from "react";
import {UserContext} from "./context/UserContext";
import axios from "axios";
import HomePage from "./components/HomePage/HomePage";

export default function AppRouter() {
    const [user, setUser] = useContext(UserContext)

    useEffect(() => {
        axios.post('/api/users/login', {})
            .then(response => {
                setUser?.(response.data);
            })
    }, [])

    return <Router>
        {
            user ?
                <Routes>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="*" element={<Navigate to="/home"/>}/>
                </Routes> :
                <Routes>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="*" element={<Navigate to="/login"/>}/>
                </Routes>
        }
    </Router>
}