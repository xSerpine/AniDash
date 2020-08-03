import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProfilePicture, ProfilePageWrapper, InfoWrapper } from '../Styled Components/profile';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ContentInfoWrapper, ContentInfo, TituloWrapper, BasicWrapper } from '../Styled Components/content';
import { Titulo } from '../Styled Components/text';
import { Space } from '../Styled Components/navbar';
import { Spinner } from '../Styled Components/loader';
import { InputWrapper } from '../Styled Components/form';
import Pagination from '../Geral/Pagination';
import { Btn } from '../Styled Components/btn';
import usePaginate from '../Utils/usePaginate';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function UserProfile({ userData, setUser }) {
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const [edit, setEdit] = useState(false);
    const [anime, setAnime] = useState([]);
    const [manga, setManga] = useState([]);
    const [follow, setFollow] = useState({
        countFollowers: 0,
        countFollowing: 0,
        userFollowers: [],
        userFollowing: []
    });
    const [newPostsPerPage, setNewPostsPerPage] = useState({
        home: userData.postsPerPageHome,
        animemanga: userData.postsPerPageAnimeManga,
        details: userData.postsPerPageDetails,
        profile: userData.postsPerPageProfile
    })

    // eslint-disable-next-line
    let Paginate, Pag, currentPage;
    const Anime = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageProfile, anime);
    const Manga = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageProfile, manga);
    const Followers = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageProfile, follow.userFollowers);
    const Following = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageProfile, follow.userFollowing);

    //Atualizar conteudo
    const handleAnchor = () => {
        setUpdate(!update);
        setLoading(true);
    }

    //Editar perfil
    const handleEdit = () => {
        setEdit(!edit);
    }

    const handleOnChangePosts = (e, type) => {
        setNewPostsPerPage({
            home: type === 1 ? e.target.value : newPostsPerPage.home,
            animemanga: type === 2 ? e.target.value : newPostsPerPage.animemanga,
            details: type === 3 ? e.target.value : newPostsPerPage.details,
            profile: type === 4 ? e.target.value : newPostsPerPage.profile
        })
    }

    //Requests
    async function getFollows() {
        const res = await fetch(`${APIUrl}/follow/${userData.username}`);
        const FollowsArray = await res.json();
        setFollow({
            countFollowers: FollowsArray.contagem_followers.followers,
            countFollowing: FollowsArray.contagem_following.followers,
            userFollowers: FollowsArray.info_followers,
            userFollowing: FollowsArray.info_following
        })
    }

    async function getAnime() {
        const res = await fetch(`${APIUrl}/favoritos/${userData.email}/anime`);
        const AnimeArray = await res.json();
        setAnime(AnimeArray);
    }

    async function getManga() {
        const res = await fetch(`${APIUrl}/favoritos/${userData.email}/manga`);
        const MangaArray = await res.json();
        setManga(MangaArray);
    }

    useEffect(() => {
        getFollows();
        getAnime();
        getManga();
        setLoading(false);
        
        // eslint-disable-next-line
    }, [update]);

    //Upload avatar
    const updateAvatar = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async() => {
            try {
                const body = { 
                    email: userData.email,
                    avatar: reader.result
                };
    
                const response = await fetch(`${APIUrl}/users`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(body)
                    }
                );
        
                const parseRes = await response.json();
        
                if (parseRes === "OK") {
                    toast.success("Avatar updated sucessfully!", { position: "bottom-right" });
                    setUser(userData.username, userData.email, reader.result, userData.postsPerPage);
                    setUpdate(!update);
                } else {
                    toast.error(parseRes, { position: "bottom-right" });
                }
            } catch (err) {
                console.error(err.message);
            }
        }
    }

    const updatePosts = async() => {
        try {
            const body = { 
                postsPerPageHome: newPostsPerPage.home,
                postsPerPageAnimeManga: newPostsPerPage.animemanga,
                postsPerPageDetails: newPostsPerPage.details,
                postsPerPageProfile: newPostsPerPage.profile,
                username: userData.username
            };

            const response = await fetch(`${APIUrl}/users/postsperpage`,
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );
    
            const parseRes = await response.json();
    
            if (parseRes === "OK") {
                toast.success("Pagination values updated successfully!", { position: "bottom-right" });
                setUser(
                    userData.username, 
                    userData.email, 
                    userData.avatar,  
                    newPostsPerPage.home,
                    newPostsPerPage.animemanga,
                    newPostsPerPage.details,
                    newPostsPerPage.profile,
                );
                setUpdate(!update);
            } else {
                toast.error(parseRes, { position: "bottom-right" });
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <Fragment>
            <TituloWrapper>
                <Space />
                {!edit && <Titulo>Your Profile <i onClick={handleEdit} className="far fa-edit"></i></Titulo>}
                <Space />
            </TituloWrapper>
            {edit &&
               <BasicWrapper>
                    <Titulo>Update your avatar</Titulo>
                    <InputWrapper>
                        <input type="file" id="file" name="avatar" placeholder="Choose a new avatar" onChange={updateAvatar} />  
                        <label htmlFor="file">Choose a new avatar</label>
                    </InputWrapper>
                    <Titulo>Update your pagination settings</Titulo>
                    <InputWrapper>
                        <input type="number" id="numberPagesHome" min="5" max="30" value={newPostsPerPage.home} placeholder="Items on Home's pagination" onChange={e => handleOnChangePosts(e, 1)} />  
                        <label htmlFor="numberPagesHome">Items on Home's pagination</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type="number" id="numberPagesAnime" min="5" max="30" value={newPostsPerPage.animemanga} placeholder="Items on Anime and Manga's pagination" onChange={e => handleOnChangePosts(e, 2)} />  
                        <label htmlFor="numberPagesAnime">Items on Anime and Manga's pagination</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type="number" id="numberPagesManga" min="5" max="30" value={newPostsPerPage.details} placeholder="Items on Content Details's pagination" onChange={e => handleOnChangePosts(e, 3)} />  
                        <label htmlFor="numberPagesManga">Items on Content Details's pagination</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type="number" id="numberPagesProfile" min="5" max="30" value={newPostsPerPage.profile} placeholder="Items on Profile's pagination" onChange={e => handleOnChangePosts(e, 4)} />  
                        <label htmlFor="numberPagesProfile">Items on Profile's pagination</label>
                    </InputWrapper>
                    <Btn onClick={updatePosts} primary>Update values</Btn>
                    <Btn style={{marginTop: "10%"}} onClick={handleEdit} secondary>Back to my profile</Btn>
                </BasicWrapper>
            }
            {loading ?
                <Spinner />
                :
                !edit &&
                    <ProfilePageWrapper>
                        {userData.avatar ? 
                            <ProfilePicture src={userData.avatar} alt="User Avatar" self />
                            :
                            <ProfilePicture src="/imagens/placeholder.png" alt="User Avatar" self />
                        }
                        <InfoWrapper>
                            <Space />
                            <p><b>Username</b><br/>{userData.username}</p>
                            <Space />
                            <p><b>Anime</b><br/>{anime.length}</p>
                            <Space />
                            <p><b>Manga</b><br/>{manga.length}</p>
                            <Space />
                            <p><b>Followers</b><br/>{follow.countFollowers}</p>
                            <Space />
                            <p><b>Following</b><br/>{follow.countFollowing}</p>
                            <Space />
                        </InfoWrapper>
                    </ProfilePageWrapper>
            }
            {!edit && 
                <Pagination 
                    style={{width: "80%", margin: "0 auto"}} 
                    MainTitle={"Your Anime"} 
                    postsPerPage={userData.postsPerPageProfile} 
                    totalPosts={anime.length} 
                    paginate={Anime.Paginate} 
                    currentPage={Anime.currentPage}
                /> 
            }
            {loading ?
                <Spinner />
                :
                !edit &&
                    <ContentInfoWrapper>
                        <ContentInfo bottom>
                            {anime.length > 0 ? 
                                Anime.Pag.map((anime, index) => (
                                    <div className="item" key={index}>
                                        <OverlayTrigger
                                            key={index}
                                            placement="auto"
                                            overlay={
                                                <Tooltip className="AnimeDetails">
                                                    <h3><b>{anime.nome}</b></h3>
                                                </Tooltip>
                                            }
                                        >
                                            <div variant="secondary">
                                                <Link to={`/anime/${anime.id_anime}`}><img src={anime.image} alt="Anime Cover"/></Link>
                                            </div>
                                        </OverlayTrigger>
                            
                                    </div>
                                )) 
                                : 
                                <div style={{width: "77vw", textAlign: "center"}}>You don't have any Anime yet!</div>
                            }
                        </ContentInfo>
                    </ContentInfoWrapper>
            }
            {   !edit && <Pagination style={{width: "80%", margin: "0 auto"}} MainTitle={"Your Manga"} postsPerPage={userData.postsPerPageProfile} totalPosts={manga.length} paginate={Manga.Paginate} currentPage={Manga.currentPage}/> }
            {   loading ?
                <Spinner />
                :
                !edit &&
                <ContentInfoWrapper>
                    <ContentInfo bottom>
                        {manga.length > 0 ? Manga.Pag.map((manga, index) => (
                            <div className="item" key={index}>
                                <OverlayTrigger
                                    key={index}
                                    placement="auto"
                                    overlay={
                                        <Tooltip className="AnimeDetails">
                                            <h3><b>{manga.nome}</b></h3>
                                        </Tooltip>
                                    }
                                    >
                                    <div variant="secondary">
                                        <Link to={`/manga/${manga.id_manga}`}><img src={manga.image} alt="Anime Cover"/></Link>
                                    </div>
                                </OverlayTrigger>
                    
                            </div>
                        )) : <div style={{width: "77vw", textAlign: "center"}}>You don't have any Manga yet!</div>}
                    </ContentInfo>
                </ContentInfoWrapper>
            }
            {!edit && 
                <Pagination 
                    style={{width: "80%", margin: "0 auto"}} 
                    MainTitle={`Your Followers`} 
                    postsPerPage={userData.postsPerPageProfile} 
                    totalPosts={follow.userFollowers.length} 
                    paginate={Followers.Paginate} 
                    currentPage={Followers.currentPage}
                /> 
            }
            {loading ?
                <Spinner />
                :
                !edit &&
                    <ContentInfoWrapper>
                        <ContentInfo bottom users>
                            {follow.userFollowers.length > 0 ? 
                                Followers.Pag.map((user, index) => (
                                    <div className="item" key={index}>
                                        <OverlayTrigger
                                            key={index}
                                            placement="auto"
                                            overlay={
                                                <Tooltip className="AnimeDetails">
                                                    <h3><b>{user.username}</b></h3>
                                                </Tooltip>
                                            }
                                        >
                                            <div variant="secondary">
                                                {   user.avatar ? 
                                                    <Link onClick={handleAnchor} to={`/profile/${user.username}`}><img style={{borderRadius: "50%"}} src={user.avatar} alt="User Avatar" /></Link>
                                                    :
                                                    <Link onClick={handleAnchor} to={`/profile/${user.username}`}><img style={{borderRadius: "50%"}} src="/imagens/placeholder.png" alt="User Avatar" /></Link>
                                                }                                   
                                            </div>
                                        </OverlayTrigger>
                            
                                    </div>
                                )) 
                                : 
                                <div style={{width: "77vw", textAlign: "center"}}>{userData.username} doesn't have any followers yet!</div>
                            }
                        </ContentInfo>
                    </ContentInfoWrapper>
            }
            {!edit && 
                <Pagination 
                    style={{width: "80%", margin: "0 auto"}} 
                    MainTitle={`Your Following`} 
                    postsPerPage={userData.postsPerPageProfile} 
                    totalPosts={follow.userFollowing.length} 
                    paginate={Following.Paginate} 
                    currentPage={Following.currentPage}
                /> 
            }
            {loading ?
                <Spinner />
                :
                !edit &&
                    <ContentInfoWrapper>
                        <ContentInfo bottom users last>
                            {follow.userFollowing.length > 0 ? 
                                Following.Pag.map((user, index) => (
                                    <div className="item" key={index}>
                                        <OverlayTrigger
                                            key={index}
                                            placement="auto"
                                            overlay={
                                                <Tooltip className="AnimeDetails">
                                                    <h3><b>{user.username}</b></h3>
                                                </Tooltip>
                                            }
                                        >
                                            <div variant="secondary">
                                                {   user.avatar ? 
                                                    <Link onClick={handleAnchor} to={`/profile/${user.username}`}><img style={{borderRadius: "50%"}} src={user.avatar} alt="User Avatar" /></Link>
                                                    :
                                                    <Link onClick={handleAnchor} to={`/profile/${user.username}`}><img style={{borderRadius: "50%"}} src="/imagens/placeholder.png" alt="User Avatar" /></Link>
                                                }                                   
                                            </div>
                                        </OverlayTrigger>
                            
                                    </div>
                                )) 
                                : 
                                <div style={{width: "77vw", textAlign: "center"}}>{userData.username} isn't following anyone yet!</div>
                            }
                        </ContentInfo>
                    </ContentInfoWrapper>
            }
        </Fragment>
    );
}

export default UserProfile;