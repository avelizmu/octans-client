import {useState, useEffect} from 'react';
import {Navigate, useParams} from "react-router-dom";
import styles from "./MediaPage.module.css";
import axios from "axios";

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

export default function MediaPage() {
    const {hash} = useParams()
    const [media, setMedia] = useState<Media>();
    const [subtitleTracks, setSubtitleTracks] = useState<number[]>([]);

    useEffect(() => {
        axios.get(`/api/media/${hash}`)
            .then(({data}) => {
                setMedia(data);
                if(data.mediaType.startsWith('video')) {
                    axios.get(`/api/media/listSubtitles/${hash}`)
                        .then(({data}) => {
                            setSubtitleTracks([...new Array(data)].map((_, i) => i + 1))
                        })
                }
            })
    }, [hash])

    return <div className={styles.container}>
        <div className={styles.tags}>

        </div>
        <div className={styles.mediaContent}>
            {
                media?.mediaType.startsWith('video') ?
                    <video className={styles.video} controls src={`/api/media/download/${media?.hash}`}>
                        {
                            subtitleTracks.map(trackNumber =>
                                <track kind="subtitles" src={`/api/media/downloadSubtitle/${hash}/${trackNumber}`} label={`Subtitle Track ${trackNumber}`}/>
                            )
                        }
                    </video> :
                    <img className={styles.image} src={`/api/media/download/${media?.hash}`}/>
            }
        </div>
    </div>
}