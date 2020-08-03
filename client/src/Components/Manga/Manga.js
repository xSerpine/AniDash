import React, { useState, useEffect, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment-timezone';
import { ContentInfoWrapper, ContentInfo, TituloWrapper, TextWrapper } from '../Styled Components/content';
import { Titulo, SubTitulo } from '../Styled Components/text';
import { Space } from '../Styled Components/navbar';
import { Spinner } from '../Styled Components/loader';
import Pagination from '../Geral/Pagination';
import usePaginate from '../Utils/usePaginate';
import ReadMoreReadLess from '../Utils/useReadMoreReadLess';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function UserManga({userData}) {
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const [resultsManga, setResultsManga] = useState([]);
    const [resultsReviews, setResultsReviews] = useState([]);
    const [resultsRecommendations, setResultsRecommendations] = useState([]);
    const [isFav, setIsFav] = useState(false);
 
    const { id_manga } = useParams();

    // eslint-disable-next-line
    let Paginate, Pag, currentPage;
    const MangaReviews = { Paginate, Pag, currentPage } = usePaginate(1, resultsReviews);
    const MangaRecommendations = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageDetails, resultsRecommendations);
    
    const handleAnchor = () => {
        setUpdate(!update);     //atualizar componente quando o user seleciona uma recomendação
    }

    window.onpopstate = function() {
        if(window.location.pathname.includes("manga"))
            setUpdate(!update);     //atualizar componente quando o user volta à página anterior
    }

    const handleAddFavorito = async() => {
        try {
            const body = { 
                email: userData.email, 
                id_manga: resultsManga.mal_id, 
                type_manga: resultsManga.type ? resultsManga.type : "N/A", 
                nome: resultsManga.title, 
                image: resultsManga.image_url, 
                chapters: resultsManga.chapters ? resultsManga.chapters : "N/A", 
                volumes: resultsManga.volumes ? resultsManga.volumes : "N/A", 
                status: resultsManga.status ? resultsManga.status : "N/A", 
                score: resultsManga.score ? resultsManga.score : "N/A", 
                url: resultsManga.url, 
                synopsis: resultsManga.synopsis ? resultsManga.synopsis : "N/A"
            };

            const response = await fetch(`${APIUrl}/favoritos/manga`,
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
                toast.success(resultsManga.title + " added to your list!", { position: "bottom-right" });
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
            const response = await fetch(`${APIUrl}/favoritos/${userData.email}/${id_manga}/manga`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json"
                    }
                }
            );
    
            const parseRes = await response.json();
    
            if (parseRes === "OK") {
                toast.success(resultsManga.title + " removed from your list!", { position: "bottom-right" });
                setUpdate(!update);
            } 
        } catch (err) {
            console.error(err.message);
        }
    }

    async function checkIfFav() {
        const res = await fetch(`${APIUrl}/favoritos/${userData.email}/${id_manga}/manga`);
        const parseRes = await res.json();
        if(parseRes) setIsFav(true);
    }

    async function getManga() {
        const res = await fetch(`https://api.jikan.moe/v3/manga/${id_manga}`);
        const MangaArray = await res.json();
        setResultsManga(MangaArray);
    }

    async function getReviews() {
        const res = await fetch(`https://api.jikan.moe/v3/manga/${id_manga}/reviews`);
        const ReviewsArray = await res.json();
        setResultsReviews(ReviewsArray.reviews);
    }

    async function getRecommendations() {
        const res = await fetch(`https://api.jikan.moe/v3/manga/${id_manga}/recommendations`);
        const RecommendationsArray = await res.json();
        setResultsRecommendations(RecommendationsArray.recommendations);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        checkIfFav();
        getManga();
        getReviews();
        setTimeout(() => {
            getRecommendations();  
            setLoading(false); 
        }, 1000);
        setIsFav(false);

        // eslint-disable-next-line
    }, [update])

    if(resultsManga.length === 0) return <Spinner />

    return (
        <ContentInfoWrapper>
            <TituloWrapper>
                <Space />
                {isFav 
                    ? 
                    <Titulo>{resultsManga.title} <i onClick={handleRemoveFavorito} className='fas fa-heart'></i></Titulo> 
                    : 
                    <Titulo>{resultsManga.title} <i onClick={handleAddFavorito} className='far fa-heart'></i></Titulo>
                }
                <Space />
            </TituloWrapper>
            <ContentInfo top>
                <img src={resultsManga.image_url.replace(".jpg", "l.jpg")} alt="Manga Cover" />
                <ReadMoreReadLess text={resultsManga.synopsis} />
            </ContentInfo>
            <SubTitulo style={{textAlign: "center", marginTop: "5%"}}>Overview</SubTitulo>
            <ContentInfo middle manga>
                <div>
                    {resultsManga.rank && (<p><b>Rank</b><br/>{resultsManga.rank}</p>)}
                    {resultsManga.status && (<p><b>Status</b><br/>{resultsManga.status}</p>)}
                    {resultsManga.type && (<p><b>Format</b><br/>{resultsManga.type}</p>)}
                    {resultsManga.episodes && (<p><b>Volumes</b><br/>{resultsManga.volumes}</p>)}
                    {resultsManga.duration && (<p><b>Chapters</b><br/>{resultsManga.chapters}</p>)}
                    {resultsManga.score && (<p><b>Score</b><br/>{resultsManga.score}</p>)}
                </div>
            </ContentInfo>
            {resultsReviews.length > 0 ? 
                <Pagination 
                    style={{marginTop: "5%"}} 
                    Title={`Reviews - ${resultsReviews.length} in total`} 
                    postsPerPage={1} totalPosts={resultsReviews.length} 
                    paginate={MangaReviews.Paginate} 
                    currentPage={MangaReviews.currentPage}
                /> 
                : 
                <SubTitulo style={{textAlign: "center", marginTop: "5%"}}>Reviews</SubTitulo> 
            }
            <ContentInfo single>
                {resultsReviews.length > 0 ? 
                    MangaReviews.Pag.map(review => (
                        <Fragment key={review.mal_id}>
                            <TextWrapper>
                                Posted by
                                <a href={review.reviewer.url} target="_blank" rel="noopener noreferrer"> {review.reviewer.username} </a>
                                on {moment(review.date.slice(0,10)).format("DD-MM-YYYY")}
                                , read {review.reviewer.chapters_read} chapters
                            </TextWrapper>
                            <TextWrapper scores>
                                <p><b>Overall:</b> {review.reviewer.scores.overall}</p>
                                <p><b>Story:</b> {review.reviewer.scores.story}</p>
                                <p><b>Art:</b> {review.reviewer.scores.art}</p>
                                <p><b>Characters:</b> {review.reviewer.scores.character}</p>
                                <p><b>Enjoyment:</b> {review.reviewer.scores.enjoyment}</p>
                            </TextWrapper>
                            <ReadMoreReadLess text={review.content.replace(/\\\n\r\n\\n\r\n/g, "\n").replace(/\\n/g, "")} />
                        </Fragment>
                    ))
                    :
                    <div style={{width: "77vw", textAlign: "center", padding: "1rem"}}>No reviews available for {resultsManga.title}</div>
                }
            </ContentInfo>
            {resultsRecommendations.length > 0 ? 
                <Pagination 
                    style={{marginTop: "5%"}} 
                    Title={`Recommendations - ${resultsRecommendations.length} manga`} 
                    postsPerPage={userData.postsPerPageDetails} 
                    totalPosts={resultsRecommendations.length} 
                    paginate={MangaRecommendations.Paginate} 
                    currentPage={MangaRecommendations.currentPage}
                /> 
                : 
                <SubTitulo style={{textAlign: "center", marginTop: "5%"}}>Recommendations</SubTitulo> 
            }        
            <ContentInfo bottom last>
                {loading ?
                    <div style={{width: "77vw", textAlign: "center"}}><Spinner /></div>
                    :
                    resultsRecommendations.length > 0 ? 
                        MangaRecommendations.Pag.map((manga, index) => (
                            <div className="item" key={index}>
                                <OverlayTrigger
                                    key={index}
                                    placement="auto"
                                    overlay={
                                        <Tooltip className="AnimeDetails">
                                            <h3><b>{manga.title}</b></h3>
                                        </Tooltip>
                                    }
                                >
                                    <div variant="secondary">
                                        <Link onClick={handleAnchor} to={`/manga/${manga.mal_id}`}><img src={manga.image_url.replace(".jpg", "l.jpg")} alt="Manga Cover" /></Link>
                                    </div>
                                </OverlayTrigger>
                    
                            </div>
                        )) 
                        : 
                        <div style={{width: "77vw", textAlign: "center"}}>No recommendations available for {resultsManga.title}</div> 
                }
            </ContentInfo>
        </ContentInfoWrapper>
    );
}

export default UserManga;