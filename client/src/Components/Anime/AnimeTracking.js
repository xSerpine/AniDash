import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GenericContentTracking from '../GenericComponents/GenericContentTracking';
import { Spinner } from '../Styled Components/loader';
import { SpacingElement } from '../Styled Components/navbar';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const AnimeTracking = ({ id_anime, user, total }) => {
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [favorite, setFavorite] = useState([]);

    const handleEnter = e => {
        if(e.keyCode === 13)  {
            if(!e.target.value) return;
            if(!isNaN(e.target.value)) handleCount('custom', parseInt(e.target.value));
        }
    }

    const handleCount = async(action, currentCount) => {
        let isCompleted = false;

        if(action === 'custom' && currentCount.toString().length > 4) return;

        if(!isNaN(total)) {
            if((action === 'add' && currentCount + 1 > parseInt(total)) || (action === 'custom' && currentCount > parseInt(total))) return toast.error("Can't add more episodes.", { position: 'bottom-right' });
            if((action === 'add' && currentCount + 1 === parseInt(total)) || (action === 'custom' && currentCount === parseInt(total))) isCompleted = true;
            if((action === 'remove' && currentCount - 1 < 0) || (action === 'custom' && currentCount < 0)) return toast.error("Can't remove more episodes.", { position: 'bottom-right' });
        }

        try {
            const body = { 
                count: action === 'add' ? currentCount + 1 : action === 'remove' ? currentCount - 1 : currentCount,
                completed: isCompleted,
                id: user.id,
                id_content: id_anime,
                type: 'anime'
            };

            const res = await fetch(`${APIUrl}/favorites/counter`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': localStorage.getItem('jwtToken')
                    },
                    body: JSON.stringify(body)
                }
            );

            if(res.status === 401) {
                localStorage.clear();
                window.location.reload();
            }

            if (res.status === 200) {
                setUpdate(!update);
            } else {
                toast.error(await res.text(), { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getFavorite = async() => {
        const res = await fetch(`${APIUrl}/favorites/favorite/${user.id}/${id_anime}/anime`);
        const FavoriteArray = await res.json();

        setFavorite(FavoriteArray);

        setLoading(false);
    }

    useEffect(() => {
        getFavorite();
   
        // eslint-disable-next-line
    }, [update])

    if(loading) return (
        <>
            <SpacingElement unwrapped />
            <Spinner />
        </>
    )

    return (
        <GenericContentTracking
            type='anime'
            status={favorite.progress}
            current={favorite.watched}
            total={total}
            handleEnter={handleEnter}
            handleCount={handleCount}
        />
    );
}

export default AnimeTracking;