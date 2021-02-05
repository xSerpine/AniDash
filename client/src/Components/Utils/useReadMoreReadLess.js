import React, { useState } from 'react';
import { TextWrapper } from '../Styled Components/content';

function ReadMoreReadLess({text}) {
    const [isTruncated, setIsTruncated] = useState(false);

    const handleReadMore = () => {
        setIsTruncated(!isTruncated);
    }
    
    return (
        <TextWrapper>
            {isTruncated || text.length < 250 ?   
                text
                :
                `${text.slice(0, 250)}...`
            }
            {text.length > 250 && <p style={{cursor: 'pointer'}} onClick={handleReadMore}>{isTruncated ? 'Show less' : 'Show more'}</p>} 
        </TextWrapper>                    
    );
}

export default ReadMoreReadLess;