import {useState, useContext} from 'react';
import {Navigate, Outlet, useParams} from "react-router-dom";
import styles from "./HomePage.module.css";

export default function HomePage() {
    const [selectedTab, setSelectedTab] = useState(0);
    const tabs = ['Your Media', 'Shared With You', 'All Media', 'Upload'];

    if(tabs[selectedTab] === 'Upload') {
        return <Navigate to={'/upload'}/>
    }

    return <div className={styles.container}>
        <div className={styles.tabs}>
            {
                tabs.map((tab, index) =>
                    <div
                        key={tab}
                        className={[styles.tab, selectedTab === index ? styles.selectedTab : ''].join(' ')}
                        onClick={() => {
                            setSelectedTab(index);
                        }}
                    >{tab}</div>
                )
            }
        </div>
        <input className={styles.searchBar}/>
        <div className={styles.searchResults}>
            {
                // TODO Implement search
            }
        </div>
    </div>
}