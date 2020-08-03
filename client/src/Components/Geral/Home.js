import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment-timezone';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Airing } from '../Styled Components/content';
import { Spinner } from '../Styled Components/loader';
import usePaginate from '../Utils/usePaginate';
import Pagination from './Pagination';
import Countdown from '../Utils/useCountdown';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function HomeUser({ userData }) {
    const [loading, setLoading] = useState(true);
    const [resultsAiring, setResultsAiring] = useState({
        today: [],
        tomorrow: []
    });
    const [resultsAnimeFav, setResultsAnimeFav] = useState([]);
    const [resultsMangaFav, setResultsMangaFav] = useState([]);

    const dia = moment().day();
    const semana = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    // eslint-disable-next-line
    let Paginate, Pag, currentPage;
    const AiringToday = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageHome, resultsAiring.today);
    const AiringTomorrow = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageHome, resultsAiring.tomorrow);
    const AnimeFav = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageHome, resultsAnimeFav);
    const MangaFav = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageHome, resultsMangaFav);
    
    async function getAiringAnime() {
        const res = await fetch("https://api.jikan.moe/v3/schedule");
        const AiringArray = await res.json();

        let amanha;
        dia === 6 ? amanha = 0 : amanha = dia + 1;

        setResultsAiring({ today: AiringArray[semana[dia]], tomorrow: AiringArray[semana[amanha]] })
    }

    async function getAnimeFav() {
        const res = await fetch(`${APIUrl}/favoritos/ongoing/${userData.email}/anime`);
        const AnimeFavArray = await res.json();
        setResultsAnimeFav(AnimeFavArray);
    }

    async function getMangaFav() {
        const res = await fetch(`${APIUrl}/favoritos/ongoing/${userData.email}/manga`);
        const MangaFavArray = await res.json();
        setResultsMangaFav(MangaFavArray);
    }
    
    useEffect(() => {        
        getAiringAnime();
        getAnimeFav();
        getMangaFav();

        setLoading(false);

        // eslint-disable-next-line
    }, []);

    return (
        <Fragment>
            <Pagination 
                type={"right"} 
                style={{width: "80%", margin: "0 auto"}} 
                Title={"Airing today"} 
                postsPerPage={userData.postsPerPageHome} 
                totalPosts={resultsAiring.today.length} 
                paginate={AiringToday.Paginate} 
                currentPage={AiringToday.currentPage}
            />
            {loading ?
                <Spinner />
                : 
                <Airing>
                    {resultsAiring.today.length > 0 ?
                        AiringToday.Pag.map((airing, index) => (
                            <div className="item" key={index}>
                                <OverlayTrigger
                                    key={index}
                                    placement="auto"
                                    overlay={
                                        <Tooltip className="AnimeDetails">
                                            <h3><b>{airing.title.length > 70 ? `${airing.title.slice(0,70)}...` : airing.title}</b></h3>
                                            <hr style={{color: "white"}}/>
                                            <div className="details">
                                                <p><b>Type: </b>{airing.type ? airing.type : "N/A"} </p>
                                                <p><b>Episodes: </b>{airing.episodes ? airing.episodes : "N/A"}</p>
                                                <p><b>Score: </b>{airing.score ? airing.score : "N/A"}</p>
                                            </div>
                                        </Tooltip>
                                    }
                                >
                                    <div variant="secondary">
                                        <Link to={ `/anime/${airing.mal_id}`}><img src={airing.image_url.replace(".jpg", "l.jpg")} alt="Anime Cover" /></Link>
                                        <div className="countdown">
                                            <Countdown 
                                                airingTime={airing.airing_start.slice(11, 16)}
                                                type="today"
                                            />
                                        </div>
                                    </div>
                                </OverlayTrigger>
                            </div>
                        ))
                        :
                        <p style={{width: "80vw", textAlign: "center"}}>Couldn't find any anime airing today.</p>
                    }
                </Airing>
            }
            <Pagination 
                type={"right"} 
                style={{width: "80%", margin: "0 auto"}} 
                Title={"Airing tomorrow"} 
                postsPerPage={userData.postsPerPageHome} 
                totalPosts={resultsAiring.tomorrow.length} 
                paginate={AiringTomorrow.Paginate} 
                currentPage={AiringTomorrow.currentPage}
            />
            {loading ?
                <Spinner />
                :                
                <Airing>
                    {resultsAiring.tomorrow.length > 0 ? 
                        AiringTomorrow.Pag.map((airing, index) => (
                            <div className="item" key={index}>
                                <OverlayTrigger
                                    key={index}
                                    placement="auto"
                                    overlay={
                                        <Tooltip className="AnimeDetails">
                                            <h3><b>{airing.title.length > 70 ? `${airing.title.slice(0,70)} ...` : airing.title}</b></h3>
                                            <hr style={{color: "white"}}/>
                                            <div className="details">
                                                <p><b>Type: </b>{airing.type ? airing.type : "N/A"} </p>
                                                <p><b>Episodes: </b>{airing.episodes ? airing.episodes : "N/A"}</p>
                                                <p><b>Score: </b>{airing.score ? airing.score : "N/A"}</p>
                                            </div>
                                        </Tooltip>
                                    }
                                >
                                    <div variant="secondary">
                                        <Link to={`/anime/${airing.mal_id}`}><img src={airing.image_url.replace(".jpg", "l.jpg")} alt="Anime Cover" /></Link>
                                        <div className="countdown">
                                            <Countdown 
                                                airingTime={airing.airing_start.slice(11, 16)}
                                                type="tomorrow"
                                            />
                                        </div>
                                    </div>
                                </OverlayTrigger>
                            </div>
                        )) 
                        : 
                        <p style={{width: "80vw", textAlign: "center"}}>Couldn't find any anime airing tomorrow.</p>
                    }
                </Airing>
            }
            <Pagination 
                type={"right"} 
                style={{width: "80%", margin: "0 auto"}} 
                Title={"Your favorite Anime - Airing"} 
                postsPerPage={userData.postsPerPageHome} 
                totalPosts={resultsAnimeFav.length} 
                paginate={AnimeFav.Paginate} 
                currentPage={AnimeFav.currentPage}
            />
            {loading ?
                <Spinner />
                : 
                <Airing>
                    {resultsAnimeFav.length > 0 ? 
                        AnimeFav.Pag.map((favorites, index) => (
                            <div className="item" key={index}>
                                <OverlayTrigger
                                    key={index}
                                    placement="auto"
                                    overlay={
                                        <Tooltip className="AnimeDetails">
                                            <h3><b>{favorites.nome.length > 70 ? `${favorites.nome.slice(0,70)}...` : favorites.nome}</b></h3>
                                            <hr style={{color: "white"}}/>
                                            <div className="details">
                                                <p><b>Type: </b>{favorites.type_anime ? favorites.type_anime : "N/A"} </p>
                                                <p><b>Episodes: </b>{favorites.episodes ? favorites.episodes : "N/A"}</p>
                                                <p><b>Score: </b>{favorites.score ? favorites.score : "N/A"}</p>
                                            </div>
                                        </Tooltip>
                                    }
                                >
                                    <div variant="secondary">
                                        <Link to={`/anime/${favorites.id_anime}`}><img src={favorites.image} alt="Anime Cover" /></Link>
                                        <div className="countdown">
                                            <Countdown 
                                                airingTime={
                                                    favorites.broadcast.slice(favorites.broadcast.length - 11, favorites.broadcast.length - 6)
                                                }
                                                airingDate={
                                                    favorites.broadcast.slice(0, favorites.broadcast.length - 16)
                                                }
                                                type="favoritos"
                                            />
                                        </div>
                                    </div>
                                </OverlayTrigger>
                            </div>
                        )) 
                        : 
                        <p style={{width: "80vw", textAlign: "center"}}>No Airing Anime was found! You can add more Anime <Link to="/search">here!</Link></p>
                    }
                </Airing>
            }
            <Pagination 
                type={"right"} 
                style={{width: "80%", margin: "0 auto"}} 
                Title={"Your favorite Manga - Ongoing"} 
                postsPerPage={userData.postsPerPageHome} 
                totalPosts={resultsMangaFav.length} 
                paginate={MangaFav.Paginate} 
                currentPage={MangaFav.currentPage}
            />
            {loading ?
                <Spinner />
                : 
                <Airing last>
                    {resultsMangaFav.length > 0 ?
                        MangaFav.Pag.map((favorites, index) => (
                            <div className="item" key={index}>
                                <OverlayTrigger
                                    key={index}
                                    placement="auto"
                                    overlay={
                                        <Tooltip className="AnimeDetails">
                                            <h3><b>{favorites.nome.length > 70 ? `${favorites.nome.slice(0,70)}...` : favorites.nome}</b></h3>
                                            <hr style={{color: "white"}}/>
                                            <div className="details">
                                                <p><b>Volumes: </b>{favorites.volumes ? favorites.volumes : "N/A"} </p>
                                                <p><b>Chapters: </b>{favorites.chapters ? favorites.chapters : "N/A"}</p>
                                                <p><b>Score: </b>{favorites.score ? favorites.score : "N/A"}</p>
                                            </div>
                                        </Tooltip>
                                    }
                                >
                                    <div variant="secondary">
                                        <Link to={`/manga/${favorites.id_manga}`}><img src={favorites.image} alt="Manga Cover" /></Link>
                                    </div>
                                </OverlayTrigger>
                            </div>
                        )) 
                        : 
                        <p style={{width: "80vw", textAlign: "center"}}>No Ongoing Manga was found! You can add more Manga <Link to="/search">here!</Link></p>
                    }
                </Airing>
            }
            <br/>
        </Fragment>
    );
}

export default HomeUser;