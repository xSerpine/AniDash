import React, { Fragment, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpacingElement } from '../Styled Components/navbar';
import UserContext from '../../Context/UserContext';
import GenericProfileOverview from '../GenericComponents/GenericProfileOverview';
import ProfileLists from './ProfileLists';
import { ContentInfoBar } from '../Styled Components/content';
import { useHistory, useParams } from 'react-router-dom';
import { Spinner } from '../Styled Components/loader';
import { ProfileDetailedStats } from '../Styled Components/profile';
import { Titulo } from '../Styled Components/text';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function UserProfile() {
    const user = useContext(UserContext);
    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const [isFollow, setIsFollow] = useState(false);
    const [profile, setProfile] = useState([]);
    const [stats, setStats] = useState({
        animeCount: 0,
        mangaCount: 0,
        followersCount: 0,
        followingCount: 0,
        timeSpent: 0,
        episodesCount: 0,
        chaptersCount: 0
    });
    const [choice, setChoice] = useState('Stats');

    const { username } = useParams();

    document.title = `${username}'s Profile`;

    const handleChoice = (option) => {
        setChoice(option);
    }

    const handleAnchor = () => {
        setChoice('Stats');
        setLoading(true);
    }

    const handleAddFollow = async() => {
        try {
            const body = { 
                id_user: profile._id, 
                followerEmail: user.email, 
            };

            const response = await fetch(`${APIUrl}/follow`,
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );
    
            const parseRes = await response.json();
    
            if (parseRes === 'OK') {
                toast.success(`You're now following ${profile.username}`, { position: 'bottom-right' });
                setUpdate(!update);
            } else {
                toast.error(parseRes, { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleRemoveFollow = async() => {
        try {
            const body = { 
                id_user: profile._id, 
                followerEmail: user.email,  
            };

            const response = await fetch(`${APIUrl}/follow`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );
    
            const parseRes = await response.json();
    
            if (parseRes === 'OK') {
                toast.success(`You stopped following ${profile.username}`, { position: 'bottom-right' });
                setUpdate(!update);
            } else {
                toast.error(parseRes, { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const checkIfFollow = async() => {
        const res = await fetch(`${APIUrl}/follow/${username}/${user.email}`);
        const parseRes = await res.json();
        if(parseRes) setIsFollow(true);
        else setIsFollow(false);
    }

    const getProfile = async() => {
        const res = await fetch(`${APIUrl}/users/${username}`);
        if(!res.ok) return history.push('/404');
        const ProfileArray = await res.json();
        setProfile(ProfileArray);
    }

    const getStats = async() => {
        const res = await fetch(`${APIUrl}/users/stats/${username}`);
        const StatsArray = await res.json();

        setStats({
            animeCount: StatsArray.anime,
            mangaCount: StatsArray.manga,
            followersCount: StatsArray.followers,
            followingCount: StatsArray.following,
            timeSpent: StatsArray.timeSpent,
            episodesCount: StatsArray.episodes,
            chaptersCount: StatsArray.chapters
        });
    }

    useEffect(() => {
        checkIfFollow();
        getStats();

        // eslint-disable-next-line
    }, [update])

    useEffect(() => {
        window.scrollTo(0, 0);
        checkIfFollow();
        getProfile();
        getStats();
        const loadingTime = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => {
            handleAnchor()
            clearTimeout(loadingTime);
        }
        
        // eslint-disable-next-line
    }, [username]);

    if(loading) return (
        <>
            <SpacingElement unwrapped />
            <Spinner />
        </>
    )       

    return (
        <Fragment>
            <SpacingElement unwrapped />
            <GenericProfileOverview
                title={`${username}'s Profile`}
                followState={
                    username !== user.username ? 
                        isFollow ? 
                            <i onClick={() => handleAddFollow()} className='far fa-heart'></i> 
                            : 
                            <i onClick={() => handleRemoveFollow()} className='fas fa-heart'></i> 
                        : 
                        ''
                    }
                user={profile}
                array={stats}
            />
            <br/>
            <ContentInfoBar style={{width: '80%', margin: '0 auto', color: '#fff'}}>
                <div className={choice === 'Stats' ? 'active' : ''} onClick={() => handleChoice('Stats')}>Stats</div>
                <div className={choice === 'Anime List' ? 'active' : ''} onClick={() => handleChoice('Anime List')}>Anime List</div>
                <div className={choice === 'Manga List' ? 'active' : ''} onClick={() => handleChoice('Manga List')}>Manga List</div>
                <div className={choice === 'Followers' ? 'active' : ''} onClick={() => handleChoice('Followers')}>Followers</div>
                <div className={choice === 'Following' ? 'active' : ''} onClick={() => handleChoice('Following')}>Following</div>
            </ContentInfoBar>
            <br/>
            {choice === 'Stats' && 
                <ProfileDetailedStats>
                    <div>
                        <Titulo>Anime</Titulo>
                        <hr />
                        <div className='statsWrapper'>
                            <div>
                                <b>Total Anime</b>
                                <p>{stats.animeCount}</p>
                            </div>
                            <div>
                                <b>Episodes Watched</b>
                                <p>{stats.episodesCount ? stats.episodesCount : 0 }</p>
                            </div>
                            <div>
                                <b>Hours Watched</b>
                                <p>{Math.round(stats.timeSpent / 60)}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Titulo>Manga</Titulo>
                        <hr />
                        <div className='statsWrapper'>
                            <div>
                                <b>Total Manga</b>
                                <p>{stats.mangaCount}</p>
                            </div>
                            <div>
                                <b>Chapters Read</b>
                                <p>{stats.chaptersCount ? stats.chaptersCount : 0}</p>
                            </div>
                        </div>
                    </div>
                </ProfileDetailedStats>
            }
            {choice === 'Anime List' &&
                <ProfileLists 
                    user={profile}
                    type='anime'
                    item1='Type'
                    item2='Episodes'
                    item3='Score'
                    emptyMessage='No anime was found.'
                />
            }
            {choice === 'Manga List' &&
                <ProfileLists 
                    user={profile}
                    type='manga'
                    item1='Volumes'
                    item2='Chapters'
                    item3='Score'
                    emptyMessage='No manga was found.'
                />
            }
            {choice === 'Followers' &&
                <ProfileLists 
                    user={profile}
                    type='profile'
                    typeStyles={{borderRadius: '50%', width: '140px', height: '140px'}}
                    profile='followers'
                    emptyMessage='No followers were found.'
                />
            }
            {choice === 'Following' &&
                <ProfileLists 
                    user={profile}
                    type='profile'
                    typeStyles={{borderRadius: '50%', width: '140px', height: '140px'}}
                    profile='following'
                    emptyMessage='No following was found.'
                />
            }
        </Fragment>
    );
}

export default UserProfile;