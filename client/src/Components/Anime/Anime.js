import React, { useState, useEffect, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPlayer from 'react-player';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment-timezone';
import { ContentInfoWrapper, ContentInfo, TituloWrapper, TextWrapper } from '../Styled Components/content';
import { Titulo, SubTitulo } from '../Styled Components/text';
import { Space } from '../Styled Components/navbar';
import { Spinner } from '../Styled Components/loader';
import Pagination from '../Geral/Pagination';
import usePaginate from '../Utils/usePaginate';
import ReadMoreReadLess from '../Utils/useReadMoreReadLess';
import Countdown from '../Utils/useCountdown';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function UserAnime({userData}) {
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const [resultsAnime, setResultsAnime] = useState([]);
    const [resultsReviews, setResultsReviews] = useState([]);
    const [resultsRecommendations, setResultsRecommendations] = useState([]);
    const [isFav, setIsFav] = useState(false);   
 
    const { id_anime } = useParams();

    // eslint-disable-next-line
    let Paginate, Pag, currentPage, teste;
    const AnimeReviews = { Paginate, Pag, currentPage } = usePaginate(1, resultsReviews);
    const AnimeRecommendations = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageDetails, resultsRecommendations);

    const handleAnchor = () => {
        setUpdate(!update);     //atualizar componente quando o user seleciona uma recomendação
    }

    window.onpopstate = function() {
        if(window.location.pathname.includes("anime"))
            setUpdate(!update);     //atualizar componente quando o user volta à página anterior
    }

    const handleAddFavorito = async() => {
        try {
            const body = { 
                email: userData.email, 
                id_anime: resultsAnime.mal_id, 
                type_anime: resultsAnime.type ? resultsAnime.type : "N/A", 
                nome: resultsAnime.title, 
                image: resultsAnime.image_url.replace(".jpg", "l.jpg"), 
                episodes: resultsAnime.episodes ? resultsAnime.episodes : "N/A", 
                status: resultsAnime.status ? resultsAnime.status : "N/A",
                airing_start: resultsAnime.airing_start ? resultsAnime.airing_start : "N/A", 
                broadcast: resultsAnime.broadcast ? resultsAnime.broadcast : "N/A", 
                score: resultsAnime.score ? resultsAnime.score : "N/A", 
                url: resultsAnime.url, 
                synopsis: resultsAnime.synopsis ? resultsAnime.synopsis : "N/A"
            };

            const response = await fetch(`${APIUrl}/favoritos/anime`,
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );
    
            const parseRes = await response.json();
    
            if (parseRes === "OK") {
                toast.success(resultsAnime.title + " added to your list!", { position: "bottom-right" });
                setUpdate(!update);
            } else {
                toast.error(parseRes, { position: "bottom-right" });
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    const handleRemoveFavorito = async() => {
        try {
            const response = await fetch(`${APIUrl}/favoritos/${userData.email}/${id_anime}/anime`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json"
                    }
                }
            );
            const parseRes = await response.json();
    
            if (parseRes === "OK") {
                toast.success(resultsAnime.title + " removed from your list!", { position: "bottom-right" });
                setUpdate(!update);
            } 
        } catch (err) {
            console.error(err.message);
        }
    }

    async function checkIfFav() {
        const res = await fetch(`${APIUrl}/favoritos/${userData.email}/${id_anime}/anime`);
        const parseRes = await res.json();
        if(parseRes) setIsFav(true);
    }

    async function getAnime() {
        const res = await fetch(`https://api.jikan.moe/v3/anime/${id_anime}`);
        const AnimeArray = await res.json();
        setResultsAnime(AnimeArray);
    }

    async function getReviews() {
        const res = await fetch(`https://api.jikan.moe/v3/anime/${id_anime}/reviews`);
        const ReviewsArray = await res.json();
        setResultsReviews(ReviewsArray.reviews);
    }

    async function getRecommendations() {
        const res = await fetch(`https://api.jikan.moe/v3/anime/${id_anime}/recommendations`);
        const RecommendationsArray = await res.json();
        setResultsRecommendations(RecommendationsArray.recommendations);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        checkIfFav();
        getAnime();
        getReviews();
        setTimeout(() => {
            getRecommendations();  
            setLoading(false)
        }, 1000);
        setIsFav(false);
   
        // eslint-disable-next-line
    }, [update])

    if(resultsAnime.length === 0) return <Spinner />

    return (
        <ContentInfoWrapper>
            <TituloWrapper>
                <Space />
                {isFav 
                    ? 
                    <Titulo>{resultsAnime.title} <i onClick={handleRemoveFavorito} className='fas fa-heart'></i></Titulo> 
                    : 
                    <Titulo>{resultsAnime.title} <i onClick={handleAddFavorito} className='far fa-heart'></i></Titulo>
                }
                <Space />
            </TituloWrapper>
            <ContentInfo top>
                <img src={resultsAnime.image_url.replace(".jpg", "l.jpg")} alt="Anime Cover" />
                <ReadMoreReadLess text={resultsAnime.synopsis} />
            </ContentInfo>
            <SubTitulo style={{textAlign: "center", marginTop: "5%"}}>Overview</SubTitulo>
            <ContentInfo middle>
                <div className="playerWrapper">
                    {resultsAnime.trailer_url ? 
                        <ReactPlayer className="player" url={resultsAnime.trailer_url} /> 
                        : 
                        <div className="unavailable_player">N/A</div>
                    }
                </div>
                <div>
                    {resultsAnime.status === "Currently Airing" && (
                        <p><b>Airing in</b>
                            <br/>
                            <Countdown 
                                airingTime={
                                    resultsAnime.broadcast.slice(resultsAnime.broadcast.length - 11, resultsAnime.broadcast.length - 6)
                                }
                                airingDate={
                                    resultsAnime.broadcast.slice(0, resultsAnime.broadcast.length - 16)
                                }
                                type="favoritos"
                            />
                        </p>
                    )}
                    {resultsAnime.rank && (<p><b>Rank</b><br/>{resultsAnime.rank}</p>)}
                    {resultsAnime.status && (<p><b>Status</b><br/>{resultsAnime.status}</p>)}
                    {resultsAnime.premiered && (<p><b>Premiered</b><br/>{resultsAnime.premiered}</p>)}
                    {resultsAnime.broadcast && (<p><b>Broadcast</b><br/>{resultsAnime.broadcast}</p>)}
                    {resultsAnime.type && (<p><b>Format</b><br/>{resultsAnime.type}</p>)}
                    {resultsAnime.episodes && (<p><b>Episodes</b><br/>{resultsAnime.episodes}</p>)}
                    {resultsAnime.duration && (<p><b>Duration</b><br/>{resultsAnime.duration}</p>)}
                    {resultsAnime.score && (<p><b>Score</b><br/>{resultsAnime.score}</p>)}
                </div>
            </ContentInfo>
            {resultsReviews.length > 0 ? 
                <Pagination 
                    style={{marginTop: "5%"}} 
                    Title={`Reviews - ${resultsReviews.length} in total`} 
                    postsPerPage={1} 
                    totalPosts={resultsReviews.length} 
                    paginate={AnimeReviews.Paginate} 
                    currentPage={AnimeReviews.currentPage}
                /> 
                : 
                <SubTitulo style={{textAlign: "center", marginTop: "5%"}}>Reviews</SubTitulo> 
            }
            <ContentInfo single>
                {resultsReviews.length > 0 ? 
                    AnimeReviews.Pag.map(review => (
                        <Fragment key={review.mal_id}>
                            <TextWrapper>
                                Posted by
                                <a href={review.reviewer.url} target="_blank" rel="noopener noreferrer"> {review.reviewer.username} </a>
                                on {moment(review.date.slice(0,10)).format("DD-MM-YYYY")}
                            </TextWrapper>
                            <TextWrapper scores>
                                <p><b>Overall:</b> {review.reviewer.scores.overall}</p>
                                <p><b>Story:</b> {review.reviewer.scores.story}</p>
                                <p><b>Animation:</b> {review.reviewer.scores.animation}</p>
                                <p><b>Sound:</b> {review.reviewer.scores.sound}</p>
                                <p><b>Characters:</b> {review.reviewer.scores.character}</p>
                                <p><b>Enjoyment:</b> {review.reviewer.scores.enjoyment}</p>
                            </TextWrapper>
                            <ReadMoreReadLess text={review.content.replace(/\\\n\r\n\\n\r\n/g, "\n").replace(/\\n/g, "")} />
                        </Fragment>
                    ))
                    :
                    <div style={{width: "77vw", textAlign: "center", padding: "1rem"}}>No reviews available for {resultsAnime.title}</div>
                }
            </ContentInfo>
            {resultsRecommendations.length > 0 ? 
                <Pagination 
                    style={{marginTop: "5%"}} 
                    Title={`Recommendations - ${resultsRecommendations.length} anime`} 
                    postsPerPage={userData.postsPerPageDetails} 
                    totalPosts={resultsRecommendations.length} 
                    paginate={AnimeRecommendations.Paginate} 
                    currentPage={AnimeRecommendations.currentPage}
                /> 
                : 
                <SubTitulo style={{textAlign: "center", marginTop: "5%"}}>Recommendations</SubTitulo> 
            }
            <ContentInfo bottom last>
                {loading ?
                    <div style={{width: "77vw", textAlign: "center"}}><Spinner /></div>
                    :
                    resultsRecommendations.length > 0 ? 
                        AnimeRecommendations.Pag.map((anime, index) => (
                            <div className="item" key={index}>
                                <OverlayTrigger
                                    key={index}
                                    placement="auto"
                                    overlay={
                                        <Tooltip className="AnimeDetails">
                                            <h3><b>{anime.title}</b></h3>
                                        </Tooltip>
                                    }
                                >
                                    <div variant="secondary">
                                        <Link onClick={handleAnchor} to={`/anime/${anime.mal_id}`}><img src={anime.image_url.replace(".jpg", "l.jpg")} alt="Anime Cover"/></Link>
                                    </div>
                                </OverlayTrigger>
                    
                            </div>
                        )) 
                        : 
                        <div style={{width: "77vw", textAlign: "center"}}>No recommendations available for {resultsAnime.title}</div>
                }
            </ContentInfo>
        </ContentInfoWrapper>
    );
}

export default UserAnime;