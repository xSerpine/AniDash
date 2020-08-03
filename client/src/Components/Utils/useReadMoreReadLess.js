import React, { useState } from 'react';
import { TextWrapper } from '../Styled Components/content';

function ReadMoreReadLess({text}) {
    const [isTruncated, setIsTruncated] = useState(false);

    const handleReadMore = () => {
        setIsTruncated(!isTruncated);
    }
    
    return (
        <TextWrapper>
            {   isTruncated || text.length < 500 ?   
                text
                :
                `${text.slice(0, 500)}...`
            }
            {   (isTruncated && text.length > 500) && <p style={{cursor: "pointer"}} onClick={handleReadMore}>Show Less</p>    } 
            {   (!isTruncated && text.length > 500) && <p style={{cursor: "pointer"}} onClick={handleReadMore}>Show more</p>   }
        </TextWrapper>                    
    );
}

export default ReadMoreReadLess;