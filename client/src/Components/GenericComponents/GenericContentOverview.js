import React, { Fragment } from 'react';
import ReactPlayer from 'react-player';
import { ContentInfo } from '../Styled Components/content';
import { SubTitulo } from '../Styled Components/text';
import Countdown from '../../Utils/Countdown';

const GenericContentOverview = ({
    subtitle,
    array
}) => {
    return (
        <Fragment>
            <SubTitulo style={{textAlign: 'center'}}>{subtitle}</SubTitulo>
            <ContentInfo overview hasTrailer={array.trailer_url}>
                {array.trailer_url &&
                    <div className='playerWrapper'>
                        <ReactPlayer 
                            className='player' 
                            url={array.trailer_url} 
                            controls={true} 
                        /> 
                    </div>
                }
                <div>
                    {array.status === 'Currently Airing' && (
                        <p><b>Airing in</b>
                            <br/>
                            <Countdown 
                                airingTime={array.broadcast.split(' ')[2]}
                                airingDate={array.broadcast.split(' ')[0]}
                                type='favoritos'
                            />
                        </p>
                    )}
                    {array.rank && (<p><b>Rank</b><br/>{array.rank}</p>)}
                    {array.status && (<p><b>Status</b><br/>{array.status}</p>)}
                    {array.premiered && (<p><b>Premiered</b><br/>{array.premiered}</p>)}
                    {array.broadcast && (<p><b>Broadcast</b><br/>{array.broadcast}</p>)}
                    {array.type && (<p><b>Format</b><br/>{array.type}</p>)}
                    {array.episodes && (<p><b>Episodes</b><br/>{array.episodes}</p>)}
                    {array.duration && (<p><b>Duration</b><br/>{array.duration}</p>)}
                    {array.score && (<p><b>Score</b><br/>{array.score}</p>)}
                </div>
            </ContentInfo>
            <br/>
        </Fragment>
    );
}

export default GenericContentOverview;