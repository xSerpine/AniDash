import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { Spinner } from '../Styled Components/loader';
import { ContentWrapper, Activity } from '../Styled Components/content';
import { Link } from 'react-router-dom';
import { SpacingElement } from '../Styled Components/navbar';
import { SubTitulo, Titulo } from '../Styled Components/text';
import { InputWrapper } from '../Styled Components/form';
import { Btn } from '../Styled Components/btn';
import UserContext from '../../Context/UserContext';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const UserActivity = () => {
    document.title = 'Activity • AniDash';

    const user = useContext(UserContext);
    
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [value, setValue] = useState('');
    const [activity, setActivity] = useState([]);

    const observer = useRef();

    const lastElement = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setCurrentPage(prevPageNumber => prevPageNumber + 1);
            }
        })
        if(node) observer.current.observe(node)
    }, [loading, hasMore])

    const getActivity = async() => {
        const res = await fetch(`${APIUrl}/activity/${user.username}?page=${currentPage}`);
        const ActivityArray = await res.json();
        
        ActivityArray.length === 0 ? setHasMore(false) : setHasMore(true);
        
        setActivity(activity.concat(ActivityArray));

        setLoading(false);
    }

    useEffect(() => {
        getActivity();

        // eslint-disable-next-line
    }, [update, currentPage])

    const addStatus = async() => {
        const username = user.username;
        const status = value;

        if(10 >= status.length || status.length >= 250) return toast.error('Status must have between 10 and 250 characters.', { position: 'bottom-right' });

        try {
            const body = { username, status };
            const response = await fetch(`${APIUrl}/activity`,
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );

            const parseRes = await response.json();

            if(parseRes === 'OK') {
                setValue('');
                toast.success('Status added with success!', { position: 'bottom-right' });
                setCurrentPage(1);
                setActivity([]);
                setUpdate(!update);
            }
            else {
                toast.error(parseRes, { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ContentWrapper>
            <SpacingElement unwrapped />
            <Titulo>Activity</Titulo>
            <InputWrapper style={{textAlign: 'right'}}>
                <textarea rows='2' onChange={e => setValue(e.target.value)} value={value} placeholder='Message your followers!'></textarea>           
                <Btn onClick={addStatus} style={{marginTop: '2%'}} primary>Post status</Btn>
            </InputWrapper>
            <br/>
            {activity.length > 0 && 
                activity.map((activityItem, index) => (
                    <div key={index}>
                        <Activity ref={activity.length === index + 1 ? lastElement : undefined}>
                            <div>
                                {activityItem.action === 'added' &&
                                    <SubTitulo><Link to={`/profile/${activityItem.username}`}>{activityItem.username}</Link> has added <Link to={`/${activityItem.type_content}/${activityItem.id_content}`}>{activityItem.content}</Link> to their list!</SubTitulo>
                                }
                                {activityItem.action === 'removed' &&
                                    <SubTitulo><Link to={`/profile/${activityItem.username}`}>{activityItem.username}</Link> has removed <Link to={`/${activityItem.type_content}/${activityItem.id_content}`}>{activityItem.content}</Link> from their list!</SubTitulo>
                                }
                                {activityItem.action === 'comment' && (
                                    user.username === activityItem.username ?
                                        <SubTitulo>
                                            <Link to={'/profile'}>You</Link> posted:
                                            <br/>
                                            {activityItem.content}
                                        </SubTitulo>
                                        :
                                        <SubTitulo>
                                            <Link to={`/profile/${activityItem.username}`}>{activityItem.username}</Link> has posted:
                                            <br/>
                                            {activityItem.content}
                                        </SubTitulo>
                                )}
                                <SubTitulo style={{textAlign: 'right'}}>{activityItem.hour && moment(activityItem.hour.slice(0,10)).format('DD-MM-YYYY')} at {activityItem.hour && activityItem.hour.slice(11,16)}</SubTitulo>
                            </div>
                        </Activity>
                        <br/>
                    </div>
                ))
            }
            {hasMore ?
                <Spinner />
                :
                <SubTitulo style={{textAlign: 'center'}}>No more activity was found. Try following more users! Click <Link to='/search'>here</Link> to search for other users!</SubTitulo>                
            }
        </ContentWrapper>
    );
}

export default UserActivity;