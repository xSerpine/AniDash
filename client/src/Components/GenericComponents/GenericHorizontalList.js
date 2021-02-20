import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ImageOverlay, Airing, AddItem, AiringControls, AiringWrapper, NoContent } from '../Styled Components/content';
import { Spinner } from '../Styled Components/loader';
import { SubTitulo } from '../Styled Components/text';
import Countdown from '../../Utils/Countdown';

const GenericHorizontalList = ({ 
    guest,
    listType,
    listStyles,
    title,
    titleStyles,
    overlay,
    array,
    arrayfavoritos,
    propertiesOption,
    carouselRef,
    item1,
    item2,
    item3,
    airingType,
    hover,
    handleHover,
    handleArrowScroll,
    handleAddCount,
    lastElement,
    emptyMessage,
    hasMore
}) => {

    const properties = propertiesOption === 'jikanAPI' ?
        {
            id: 'mal_id',
            name: 'title',
            image: 'image_url',
            airing: 'airing_start',
            item1: 'type',
            item2: 'episodes',
            item3: 'score',
            count: listType === 'anime' ? 'watched' : 'read'
        }
        :
        {
            id: `id_${listType}`,
            name: 'name',
            image: 'image',
            airing: 'broadcast',
            item1: listType === 'anime' ? 'type_anime' : 'volumes',
            item2: listType === 'anime' ? 'episodes' : 'chapters',
            item3: 'score',
            count: listType === 'anime' ? 'watched' : 'read'
        }
	return (
		<Fragment>
            <SubTitulo style={titleStyles}>{title}</SubTitulo>  
            <AiringWrapper style={listStyles}>              
                <Airing ref={carouselRef} style={array.length === 0 ? {position: 'relative', padding: '2rem 0'} : {}}>
                    {array.length > 0 ? 
                        array.map((arrayItem, index) => (
                            <div
                                className='item'
                                key={index}
                                onMouseEnter={handleHover ? () => handleHover(index, true) : null}
                                onMouseLeave={handleHover ? () => handleHover(index, false) : null}
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
                                            </div>
                                            {arrayfavoritos && (
                                                arrayfavoritos.find(dataItem => dataItem.name === arrayItem[properties.name]) &&
                                                    <p style={{width: '100%'}}>
                                                        <b>Progress:</b> {`
                                                            ${[...arrayfavoritos].filter(dataItem => dataItem.name === arrayItem[properties.name])[0][properties.count]}
                                                            ${arrayItem[properties.item2] && arrayItem[properties.item2] !== 'N/A' ? 
                                                                `/ ${arrayItem[properties.item2]}` 
                                                                : 
                                                                ''
                                                            }
                                                        `}
                                                    </p>
                                            )}
                                        </Tooltip>
                                    }
                                >
                                    <div variant='secondary'>
                                        <Link to={guest ? `/guest/${listType}/${arrayItem[properties.id]}` : `/${listType}/${arrayItem[properties.id]}`}>
                                            {propertiesOption === 'anidashAPI' ?
                                                <img
                                                    src={arrayItem[properties.image]}
                                                    alt={`${arrayItem[properties.name]} cover`}
                                                />
                                                :
                                                <img
                                                    src={arrayItem[properties.image].replace('.jpg', 'l.jpg')}
                                                    alt={`${arrayItem[properties.name]} cover`}
                                                />
                                            }
                                        </Link>
                                        {overlay &&
                                            <ImageOverlay>
                                                {hover && arrayfavoritos && (
                                                    hover.element === index && 
                                                    hover.state &&  
                                                    arrayfavoritos.find(dataItem => dataItem.name === arrayItem[properties.name]) ?
                                                        <AddItem onClick={handleAddCount ? () => handleAddCount(arrayItem[properties.item2], [...arrayfavoritos].filter(dataItem => dataItem.name === arrayItem[properties.name])[0][properties.count], arrayItem[properties.id], index) : null}>
                                                            {[...arrayfavoritos].filter(dataItem => dataItem.name === arrayItem[properties.name])[0][properties.count]} +
                                                        </AddItem>
                                                        :
                                                        listType === 'anime' ? 
                                                            airingType === 'favoritos' ?
                                                                <Countdown 
                                                                    airingTime={arrayItem[properties.airing].split(' ')[2]} 
                                                                    airingDate={arrayItem[properties.airing].split(' ')[0]}
                                                                    type={airingType} 
                                                                />
                                                                :
                                                                <Countdown 
                                                                    airingTime={arrayItem[properties.airing].split('T')[1]} 
                                                                    type={airingType} 
                                                                />
                                                            :
                                                            <AddItem onClick={handleAddCount ? () => handleAddCount(arrayItem[properties.item2], [...arrayfavoritos].filter(dataItem => dataItem.name === arrayItem[properties.name])[0][properties.count], arrayItem[properties.id], index) : null}>
                                                                {[...arrayfavoritos].filter(dataItem => dataItem.name === arrayItem[properties.name])[0][properties.count]} +
                                                            </AddItem>
                                                )}
                                            </ImageOverlay>
                                        }
                                    </div>
                                </OverlayTrigger>
                            </div>
                        ))
                        :
                        <NoContent>{emptyMessage}</NoContent>
                    }
                    {array.length > 0 && hasMore && <div style={{background: '#1c2541', height: '210px', display: 'flex', alignItems: 'center'}}><Spinner /></div>}                    
                </Airing> 
                {array.length > 0 &&
                    <AiringControls>
                        <span className='left' onClick={() => handleArrowScroll(carouselRef, -carouselRef.current.offsetWidth)}><i className='fas fa-arrow-left'></i></span>
                        <span className='right' onClick={() => handleArrowScroll(carouselRef, carouselRef.current.offsetWidth)}><i className='fas fa-arrow-right'></i></span>
                    </AiringControls>
                }
            </AiringWrapper>     
		</Fragment>
	);
}

export default GenericHorizontalList;
