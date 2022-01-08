import {useState, useContext} from 'react';
import styles from './LoginPage.module.css';
import {Navigate} from "react-router-dom";
import {UserContext} from "../../context/UserContext";
import axios from "axios";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useContext(UserContext);

    async function login() {
        const response = await axios.post('/api/users/login', {
            username,
            password
        });
        setUser?.(response.data);
    }

    if(user) {
        return <Navigate to={"/"}/>
    }

    return <div className={styles.container}>
        <input className={styles.input} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>
        <input className={styles.input} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
        <button className={styles.submit} onClick={login}>Log In</button>
    </div>
}