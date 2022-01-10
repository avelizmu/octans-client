import {useState, useEffect} from 'react';
import {Navigate} from "react-router-dom";
import styles from "./HomePage.module.css";
import axios from "axios";
import playArrow from "./play_arrow_black_24dp.svg"

type Media =  {
    id: number,
    hash: string,
    mediaType: string,
    width: number,
    height: number,
    duration: number,
    size: number,
    created: Date,
    createdBy: number
}

type Tag = {
    id: number,
    type: string,
    namespace: string,
    tagName: string
}

export default function HomePage() {
    const [selectedTab, setSelectedTab] = useState(0);
    const tabs = ['Your Media', 'Shared With You', 'All Media', 'Upload'];
    const [media, setMedia] = useState<Media[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [suggestedTags, setSuggestedTags] = useState<Tag[]>([]);
    const [search, setSearch] = useState('');
    const [navigateToMedia, setNavigateToMedia] = useState('');

    useEffect(() => {
        if(search === '') {
            setSuggestedTags([]);
            return;
        }
        let queryString = `/api/tags/search?search=${search}`;
        if(tags.length) {
            queryString = `${queryString}&exclude[]=${tags.map(t => t.id).join('&exclude[]=')}`
        }
        axios.get(queryString)
            .then(({data}) => {
                setSuggestedTags(data);
            })
    }, [search])

    useEffect(() => {
        let queryString = '/api/media/list?type=Self';
        if(tags.length) {
            queryString = `${queryString}&tags[]=${tags.map(t => t.id).join('&tags[]=')}`
        }
        axios.get(queryString)
            .then(({data}) => {
                setMedia(data);
            })
    }, [tags])

    if(navigateToMedia) {
        return <Navigate to={`/media/${navigateToMedia}`}/>
    }

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
        <div className={styles.tags}>
            {
                tags.map(tag =>
                    <div className={styles.tag}
                         onClick={() => {

                         }}
                    >
                        <div className={styles.tagContent}>
                            <div>
                                {
                                    tag.type === 'SYSTEM' ? 'System Tag' : ''
                                }
                            </div>
                            <div>
                                {tag.namespace}:{tag.tagName}
                            </div>
                        </div>
                        <button className={styles.deleteButton} onClick={() => {
                            setTags([...tags.filter(t => t.id !== tag.id)])
                        }}>X</button>

                    </div>
                )
            }
        </div>
        <input value={search} className={styles.searchBar} onChange={(e => setSearch(e.target.value))} onKeyUp={(e) => {
            if(e.key === 'Enter') {
                if(search.includes(':') && search.split(':')[1].length) {
                    axios.post('/api/tags', {
                        namespace: search.split(':')[0],
                        tagName: search.split(':')[1]
                    }).then(({data}) => {
                        setTags([...tags, data]);
                        setSearch('')
                    });
                }
            }
        }}/>
        <div className={styles.tagSuggestions}>
            {
                suggestedTags.map(tag =>
                        <div className={styles.tagSuggestion}
                             onClick={() => {
                                 setTags([...tags, tag]);
                                 setSearch('');
                             }}
                        >
                            {tag.type === 'SYSTEM' ? 'System Tag: ' : ''} {tag.namespace}:{tag.tagName}
                        </div>
                )
            }
        </div>
        <div className={styles.searchResults}>
            {
                media.map(media =>
                        <div key={media.hash} className={styles.result} onClick={() => setNavigateToMedia(media.hash)}>
                            <div className={styles.thumbnailContainer}>
                                <img className={styles.thumbnail} src={`/api/media/download/${media.hash}/true`}/>
                                {
                                    media.mediaType.startsWith('video') ?
                                        <div className={styles.playIcon}>
                                            <img src={playArrow}/>
                                        </div> :
                                        <></>
                                }
                            </div>

                        </div>
                )
            }
        </div>
    </div>
}