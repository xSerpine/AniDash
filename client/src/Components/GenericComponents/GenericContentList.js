import React from 'react';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AddItem, ImageOverlay, ListItems, NoContent } from '../Styled Components/content';
import { Spinner } from '../Styled Components/loader';

const GenericContentList = ({
    guest,
    contentListType,
    listStyles,
    listType,
    typeStyles,
    array,
    propertiesOption,
    item1,
    item2,
    item3,
    lastElement,
    hasMore,
    handleAddCount,
    emptyMessage
}) => {
    const properties = propertiesOption === 'jikanAPI' ?
        {
            id: 'mal_id',
            name: 'title',
            image: 'image_url',
            item1: listType === 'anime' ? 'type' : 'volumes',
            item2: listType === 'anime' ? 'episodes' : 'chapters',
            item3: 'score',
            count: listType === 'anime' ? 'watched' : 'read'
        }
        :
        {
            id: `id_${listType}`,
            name: listType === 'profile' ? 'username' : 'name',
            image: listType === 'profile' ? 'avatar' : 'image',
            item1: listType === 'anime' ? 'type_anime' : 'volumes',
            item2: listType === 'anime' ? 'episodes' : 'chapters',
            item3: 'score',
            count: listType === 'anime' ? 'watched' : 'read'
        }
    return (
        <ListItems lists style={listStyles}>
            {array.length > 0 ? 
                    array.map((arrayItem, index) => (
                        <div
                            className='item'
                            key={index}
                            ref={array.length === index + 1 ? lastElement : undefined}
                        >
                            <OverlayTrigger
                                key={index}
                                placement='auto'
                                overlay={
                                    <Tooltip className='TooltipInfo'>
                                        <h3>
                                            <b>
                                                {arrayItem[properties.name].length > 70
                                                    ? `${arrayItem[properties.name].slice(0, 70)}...`
                                                    : arrayItem[properties.name]}
                                            </b>
                                        </h3>
                                        <hr style={{ color: '#fff', border: '2px solid' }} />
                                        <div className='details'>
                                            {arrayItem[properties.item1] && arrayItem[properties.item1] !== 'N/A' ?
                                                <p>
                                                    <b>{item1}: </b>
                                                    {arrayItem[properties.item1]}
                                                </p>
                                                :
                                                ''
                                            }
                                            {arrayItem[properties.item2] && arrayItem[properties.item2] !== 'N/A' ?
                                                <p>
                                                    <b>{item2}: </b>
                                                    {arrayItem[properties.item2]}
                                                </p>
                                                :
                                                ''
                                            }
                                            {arrayItem[properties.item3] && arrayItem[properties.item3] !== 'N/A' ?
                                                <p>
                                                    <b>{item3}: </b>
                                                    {arrayItem[properties.item3]}
                                                </p>
                                                :
                                                ''
                                            }
                                            {contentListType === 'favorites' &&
                                                <p style={{width: '100%'}}>
                                                    <b>Progress:</b> {`
                                                        ${arrayItem[properties.count] !== null ? arrayItem[properties.count] : 'Completed' }
                                                        ${arrayItem[properties.item2] && arrayItem[properties.item2] !== 'N/A' ? 
                                                            `/ ${arrayItem[properties.item2]}` 
                                                            : 
                                                            ''
                                                        }
                                                    `}
                                                </p>
                                            }
                                        </div>
                                    </Tooltip>
                                }
                            >
                                <div variant='secondary' style={typeStyles}>
                                    <Link to={guest ? 
                                        `/guest/${listType}/${listType === 'profile' ? 
                                            arrayItem[properties.name] 
                                            : 
                                            arrayItem[properties.id]}` 
                                        : 
                                        `/${listType}/${listType === 'profile' ? 
                                            arrayItem[properties.name] 
                                            : 
                                            arrayItem[properties.id]}`}
                                    >
                                        {propertiesOption === 'anidashAPI' ?
                                            <img
                                                style={typeStyles}
                                                src={
                                                    listType === 'profile' ?
                                                        arrayItem[properties.image] ? 
                                                            arrayItem[properties.image]
                                                            :
                                                            '/imagens/placeholder.png'
                                                        :
                                                        arrayItem[properties.image]
                                                }
                                                alt={`${arrayItem[properties.name]} cover`}
                                            />
                                            :
                                            <img
                                                src={arrayItem[properties.image].replace('.jpg', 'l.jpg')}
                                                alt={`${arrayItem[properties.name]} cover`}
                                            />
                                        }
                                    </Link>
                                    {contentListType === 'favorites' &&
                                        <ImageOverlay>
                                            <AddItem onClick={handleAddCount && arrayItem[properties.count] !== null ? () => handleAddCount(arrayItem[properties.item2], arrayItem[properties.count], arrayItem[properties.id], index) : null}>
                                                {arrayItem[properties.count] !== null ? `${arrayItem[properties.count]} +` : 'Completed'}
                                            </AddItem>
                                        </ImageOverlay>
                                    }
                                </div>
                            </OverlayTrigger>
                        </div>
                    ))
                :
                <NoContent>{emptyMessage}</NoContent>
            }    
            {array.length > 0 && hasMore && <div style={listType === 'profile' ? {background: '#1c2541', height: '140px', display: 'flex', alignItems: 'center'} : {background: '#1c2541', height: '210px', display: 'flex', alignItems: 'center'}}><Spinner /></div>}
        </ListItems>
    );
}

export default GenericContentList;