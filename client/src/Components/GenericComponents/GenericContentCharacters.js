import React from 'react';
import { Characters, NoContent } from '../Styled Components/content';

const GenericContentCharacters = ({
    type,
    array,
    emptyMessage
}) => {
    return (
        <Characters>
            {array.length > 0 ?
                array.map((arrayItem, index) => (
                    <div className='characters' key={index}>
                        <div className='left'>
                            <img src={arrayItem.image_url} alt={`${arrayItem.name}`} />
                            <p>
                                {arrayItem.name}
                                <br/>
                                <span>{arrayItem.role}</span>
                            </p>
                        </div>
                        {type === 'anime' && arrayItem.voice_actors.length > 0 &&
                            <div className='right'>
                                <p>
                                    {arrayItem.voice_actors[0].name}
                                    <br/>
                                    <span>{arrayItem.voice_actors[0].language}</span>
                                </p>
                                <img 
                                    src={arrayItem.voice_actors[0].image_url.includes('/r/42x62/') ?
                                        arrayItem.voice_actors[0].image_url.replace('/r/42x62/', '/')
                                        :
                                        arrayItem.voice_actors[0].image_url
                                    } 
                                    alt={`${arrayItem.voice_actors[0].name}`} 
                                />
                            </div>
                        }
                    </div>
                ))
                :
                <NoContent>{emptyMessage}</NoContent>
            }
        </Characters>
    );
}

export default GenericContentCharacters;