import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GenericContentTracking from '../GenericComponents/GenericContentTracking';
import { Spinner } from '../Styled Components/loader';
import { SpacingElement } from '../Styled Components/navbar';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const MangaTracking = ({ id_manga, user, total }) => {
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [favorite, setFavorite] = useState([]);

    const handleCount = async(action, currentCount) => {
        let isCompleted = false;

        if(!isNaN(total)) {
            if(action === 'add' && currentCount + 1 > parseInt(total)) return toast.error(`Can't add more chapters.`, { position: 'bottom-right' });
            if(action === 'add' && currentCount + 1 === parseInt(total)) isCompleted = true;
            if(action === 'remove' && currentCount - 1 < 0) return toast.error(`Can't remove more chapters.`, { position: 'bottom-right' });
        }

        try {
            const body = { 
                count: action === 'add' ? currentCount + 1 : currentCount - 1,
                completed: isCompleted,
                id: user.id,
                id_content: id_manga,
                type: 'manga'
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
        const res = await fetch(`${APIUrl}/favorites/favorite/${user.id}/${id_manga}/manga`);
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
            type='manga'
            status={favorite.progress}
            current={favorite.read}
            total={total}
            handleCount={handleCount}
        />
    );
}

export default MangaTracking;