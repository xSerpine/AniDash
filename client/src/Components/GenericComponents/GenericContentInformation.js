import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ContentInfo, TextWrapper, ContentCover, ContentActions, ContentRelated } from '../Styled Components/content';
import { Titulo } from '../Styled Components/text';
import ReadMoreReadLess from '../../Utils/ReadMoreReadLess';

const GenericContentInformation = ({
    guest,
    type,
    title,
    option,
    progress1,
    progress2,
    progress3,
    progress4,
    array,
    isFavorite,
    handleAddFavorite,
    handleRemoveFavorite,
    handleSelectedOption,
    handleClick,
    itemRef
}) => {
    const [isResized, setIsResized] = useState(window.innerWidth);

    const changeDescription = () => {
        setIsResized(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', changeDescription);

        return () => window.removeEventListener('resize', changeDescription);
    }, [])

    return (
        <Fragment>
            <Titulo>{title}</Titulo>
            <ContentInfo description hasText={array.synopsis}>        
                <ContentCover>
                    <img src={array.image_url ? array.image_url.replace('.jpg', 'l.jpg') : ''} alt={`${array.title} cover`} />
                    {!guest &&
                        <ContentActions>
                            <div className='status' ref={itemRef} onClick={handleClick ? handleClick : null}>
                                <div className='selected'>
                                    <span>{option}</span>
                                    <i className='fas fa-caret-down'></i>
                                </div>
                                <div className='options'>
                                    {(type === 'manga' || array.status === 'Finished Airing') && 
                                        <div onClick={() => handleSelectedOption(progress1.toLowerCase())}>{`Set as ${progress1}`}</div>
                                    }
                                    <div onClick={() => handleSelectedOption(progress2.toLowerCase())}>{`Set as ${progress2}`}</div>
                                    <div onClick={() => handleSelectedOption(progress3.toLowerCase())}>{`Set as ${progress3}`}</div>
                                    <div onClick={() => handleSelectedOption(progress4.toLowerCase())}>{`Set as ${progress4}`}</div>
                                </div>
                            </div>
                            <div className='favorite'>
                                {isFavorite ?
                                    <i onClick={handleRemoveFavorite} className='fas fa-heart'></i>
                                    :
                                    <i onClick={handleAddFavorite} className='far fa-heart'></i>
                                }
                            </div>
                        </ContentActions>
                    }
                </ContentCover>
                {array.synopsis && (
                    isResized > 1000 ?
                        <TextWrapper className='contentDescription'>{array.synopsis}</TextWrapper>
                        :
                        <ReadMoreReadLess text={array.synopsis} />
                )}
            </ContentInfo>
            {array.related && Object.keys(array.related).length > 0 &&
                <>
                    <br/>
                    <ContentRelated>
                        {array.related.Adaptation &&
                            <div className='relatedWrapper'>
                                <b>Adaptation</b>
                                <br/>
                                {array.related.Adaptation.map((relatedItem, index) => (
                                    <div key={index}>
                                        <Link 
                                            to={guest ? 
                                                `/guest/${type === 'manga' ? 'anime' : 'manga'}/${relatedItem.mal_id}` 
                                                : 
                                                `/${type === 'manga' ? 'anime' : 'manga'}/${relatedItem.mal_id}`} 
                                            target='_blank' 
                                            rel='noreferrer noopener'
                                        >
                                            {relatedItem.name} <i className='fas fa-external-link-alt'></i>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        }
                        {array.related['Alternative version']  &&
                            <div className='relatedWrapper'>
                                <b>Alternative Version</b>
                                <br/>
                                {array.related['Alternative version'].map((relatedItem, index) => (
                                    <div key={index}>
                                        <Link 
                                            to={guest ? `/guest/${type}/${relatedItem.mal_id}` : `/${type}/${relatedItem.mal_id}`} 
                                            target='_blank' 
                                            rel='noreferrer noopener'
                                        >
                                            {relatedItem.name} <i className='fas fa-external-link-alt'></i>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        }
                        {array.related.Prequel &&
                            <div className='relatedWrapper'>
                                <b>Prequel</b>
                                <br/>
                                {array.related.Prequel.map((relatedItem, index) => (
                                    <div key={index}>
                                        <Link 
                                            to={guest ? `/guest/${type}/${relatedItem.mal_id}` : `/${type}/${relatedItem.mal_id}`} 
                                            target='_blank' 
                                            rel='noreferrer noopener'
                                        >
                                            {relatedItem.name} <i className='fas fa-external-link-alt'></i>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        }
                        {array.related.Sequel &&
                            <div className='relatedWrapper'>
                                <b>Sequel</b>
                                <br/>
                                {array.related.Sequel.map((relatedItem, index) => (
                                    <div key={index}>
                                        <Link 
                                            to={guest ? `/guest/${type}/${relatedItem.mal_id}` : `/${type}/${relatedItem.mal_id}`} 
                                            target='_blank' 
                                            rel='noreferrer noopener'
                                        >
                                            {relatedItem.name} <i className='fas fa-external-link-alt'></i>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        }
                    </ContentRelated>
                </>
            }
            <br/>
        </Fragment>
    );
}

export default GenericContentInformation;