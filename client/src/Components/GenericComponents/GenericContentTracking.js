import React, { useState, useEffect } from 'react';
import { Tracking } from '../Styled Components/content';

const GenericContentTracking = ({
    type,
    status,
    current,
    total,
    handleEnter,
    handleCount
}) => {
    const [value, setValue] = useState('');

    const handleInputValue = () => {
        setValue(current);
    }

    const onChange = e => {
        setValue(e.target.value);
    }

    useEffect(() => {
        handleInputValue();

        // eslint-disable-next-line
    }, [current])

    return (
        <Tracking>
            {status &&
                <div>
                    <b>Progress</b>
                    <p>{status}</p>
                </div>
            }
            {total &&
                <div>
                    <b>Total {type === 'anime' ? 'Episodes' : 'Chapters'}</b>
                    <p>{total}</p>
                </div>
            }
            {!isNaN(current) &&
                <div>
                    <span className='add' onClick={() => handleCount('add', current)}><i className='fas fa-chevron-up'></i></span>
                    <span className='remove' onClick={() => handleCount('remove', current)}><i className='fas fa-chevron-down'></i></span>
                    <b>{type === 'anime' ? 'Episodes Watched' : 'Chapters Watched'}</b>
                    <p><input type='text' value={value} onChange={e => onChange(e)} onKeyDown={e => handleEnter(e)} /></p>
                </div>
            }
        </Tracking>
    );
}

export default GenericContentTracking;