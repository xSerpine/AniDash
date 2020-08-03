import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { Spinner } from '../Styled Components/loader';
import { ContentInfoWrapper, ActivityFollowing, TituloWrapper } from '../Styled Components/content';
import { Link } from 'react-router-dom';
import { Space } from '../Styled Components/navbar';
import { SubTitulo } from '../Styled Components/text';
import { InputWrapper } from '../Styled Components/form';
import { Btn } from '../Styled Components/btn';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function UserActivity({userData}) {
    const [update, setUpdate] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [value, setValue] = useState("");
    const [activity, setActivity] = useState([]);

    async function getActivity() {
        const res = await fetch(`${APIUrl}/activity/${userData.username}?page=${currentPage}`);
        const ActivityArray = await res.json();
        
        !ActivityArray || ActivityArray.length === 0 ? setHasMore(false) : setHasMore(true);

        setCurrentPage(currentPage + 1);
        
        setActivity(activity.length === 0 ? ActivityArray : activity.concat(ActivityArray));
    }

    useEffect(() => {
        getActivity();

        // eslint-disable-next-line
    }, [update])

    const addStatus = async(e) => {
        const username = userData.username;
        const comentario = value;

        if(10 >= comentario.length || comentario.length >= 250) return toast.error("Status must have between 10 and 250 characters.", { position: "bottom-right" });

        try {
            const body = { username, comentario };
            const response = await fetch(APIUrl + "/activity",
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            const parseRes = await response.json();

            if(parseRes === "OK") {
                setValue("");
                toast.success("Status added with success!", { position: "bottom-right" });
                setCurrentPage(1);
                setActivity([]);
                setUpdate(!update);
            }
            else {
                toast.error(parseRes, { position: "bottom-right" });
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <ContentInfoWrapper>
            <InputWrapper style={{textAlign: "right"}}>
                <textarea rows="2" onChange={e => setValue(e.target.value)} value={value} placeholder="Message your followers!"></textarea>           
                <Btn onClick={addStatus} style={{marginTop: "2%"}} primary>Post status</Btn>
            </InputWrapper>
            <br/>
            <InfiniteScroll 
                dataLength={activity.length}
                next={getActivity}
                hasMore={hasMore}
                loader={<Spinner />}
                endMessage={
                    <SubTitulo style={{textAlign: "center", marginBottom: "2rem"}}>No more activity was found. Try following more users! Click <Link to="/search">here</Link> to search for other users!</SubTitulo>
                }
            >
                {activity.length > 0 && 
                    activity.map((activity, index) => (
                        <ActivityFollowing key={index} style={{marginTop: "1%"}}>
                            <TituloWrapper>
                                {activity.action === "added" ?
                                    <SubTitulo><Link to={`/profile/${activity.username}`}>{activity.username}</Link> has added <Link to={`/${activity.type_content}/${activity.id_content}`}>{activity.content}</Link> to their list!</SubTitulo>
                                    :
                                    activity.action === "removed" ?
                                        <SubTitulo><Link to={`/profile/${activity.username}`}>{activity.username}</Link> has removed <Link to={`/${activity.type_content}/${activity.id_content}`}>{activity.content}</Link> from their list!</SubTitulo>
                                        :
                                        userData.username === activity.username ?
                                            <SubTitulo>
                                                <Link to={"/profile"}>You</Link> posted:
                                                <br/>
                                                {activity.content}
                                            </SubTitulo>
                                            :
                                            <SubTitulo>
                                                <Link to={`/profile/${activity.username}`}>{activity.username}</Link> has posted:
                                                <br/>
                                                {activity.content}
                                            </SubTitulo>
                                }
                                <Space />
                                <SubTitulo style={{textAlign: "right"}}>{activity.hora && moment(activity.hora.slice(0,10)).format("DD-MM-YYYY")} at {activity.hora && activity.hora.slice(11,16)}</SubTitulo>
                            </TituloWrapper>
                        </ActivityFollowing>
                    ))
                }
            </InfiniteScroll>
        </ContentInfoWrapper>
    );
}

export default UserActivity;