import styled, { css } from 'styled-components';

const BasicWrapper = styled.div`
    width: 50%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    @media (max-width: 768px) {
        width: 80% !important;
    }  
`;

const Airing = styled.div`
    width:80%;
    background: #1c2541;
    padding: 1rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    grid-gap: 10px;
    color: white;
    & .item div {
        height: 200px;
    }
    & .item img {
        width:100%;
        height:100%;
    }
    & img:hover {
        filter: opacity(20%);
        cursor: pointer;
    }
    ${props => props.last && css`
        margin-bottom: 2rem !important;
        @media (max-width: 768px) {
            margin-bottom: 0 !important;
        }  
    `}
`;

const ContentInfoWrapper = styled.div`
    width:80%;
    padding: 1rem;
    margin: 0 auto;
    color: white;
`;

const ContentInfo = styled.div`
    display: grid;
    grid-gap: 10px;
    ${props => props.last && css`
        margin-bottom: 2rem;
        @media (max-width: 768px) {
            margin-bottom: 0 !important;
        }  
    `}
    ${props => props.listContent && css`
        display: flex !important;   
        @media (max-width: 768px) {
            display: grid !important;
        }  
    `}
    ${props => props.top && css`
        grid-template-columns: minmax(120px, 0.6fr) 2fr; 
        grid-template-rows: auto; 
        & div {
            padding: 1rem 2rem;
            text-align: justify;
            background: #1c2541;
        }
        & img {
            display: flex;
            align-self: center;
            height: inherit !important;
            width: 100%;
        }
        @media only screen and (max-width: 769px) and (min-width: 420px) {
            & img {
                width: 50% !important;
                margin: 0 auto !important;
            }
        } 
    `}
    ${props => props.middle && css`
        grid-template-columns: 2fr minmax(120px, 0.6fr); 
        ${props => props.manga && css`
            width: 40% !important;
            margin: 0 auto !important;
            grid-template-columns: 1fr !important; 
            @media (max-width: 768px) {
                width: 100% !important;
            } 
        `}
        & div {
            text-align: center;
            background: #1c2541;
            & b {
                color: #FFF05A;
            }
            & p {
                font-size: 20px;
            }
        }
        & .playerWrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            & .player {
                width: 100% !important;
                height: 100% !important;
            }
            & .unavailable_player {
                display: flex;
                font-size: 30px;
                color: #FFF05A;
            }
        }
    `}
    ${props => props.bottom && css`
        background: #1c2541;
        padding: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        grid-gap: 10px;
        color: white;
        & .item div {
            height: 200px;
        }
        & .item img {
            width:100%;
            height:100%;
        }
        & img:hover {
            filter: opacity(20%);
            cursor: pointer;
        }
        @media (max-width: 768px) {
            grid-template-columns: minmax(120px, 1fr) minmax(120px, 1fr) !important;
            & .item div {
                height: 100% !important;
            }
            padding: 0 !important;
            background: none;
        } 
    `}
    ${props => props.single && css`
        background: #1c2541;
        margin: 0 auto;
        width: 100%;
    `}
    ${props => props.users && css`
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        & .item div {
            height: 100% !important;
        }
        @media (max-width: 768px) {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;
        } 
    `}
    ${props => props.search && css`
        display: flex !important; 
        @media (max-width: 768px) {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important; 
        } 
    `}
    & img {
        height: 100%;
        width: 100%;
    }
    @media (max-width: 768px) {
        grid-template-columns: minmax(120px, 1fr); 
    }  
`;

const ListItems = styled.div`
    display: grid;
    background: #1c2541;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    grid-gap: 10px;
    width: 100%;
    padding: 1rem;
    margin: 0 auto;
    & .item div {
        height: 200px;
    }
    & .item img {
        width:100%;
        height:100%;
    }
    & img:hover {
        filter: opacity(20%);
        cursor: pointer;
    }
    @media (max-width: 768px) {
        ${props => props.animelist && css`
            padding: 0 !important;
            background: none;
        `}
    } 
`;

const SearchItems = styled.div`
    background: #1c2541;
    padding: 1rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    grid-gap: 10px;
    color: white;
    width: 100%;
    height: 100%;
    & .item div {
        height: 200px;
    }
    & .item img {
        width:100%;
        height:100%;
    }
    & img:hover {
        filter: opacity(20%);
        cursor: pointer;
    }
    @media (max-width: 768px) {
        padding: 0 !important;
        background: none;
        height: 0;
    } 
`;

const Items = styled.p`
    cursor: pointer;
    width: inherit;
    padding: 0.5rem 1rem;
    text-align: center;
    background: #1c2541;
    &:hover {
        color: black;
        background: #FFF05A;
    }
    ${props => props.status && css`
        width: 5%;
    `}
`;

const TituloWrapper = styled.div`
    width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content : space-between;
    & h1 {
        text-align:center;
    }
    & .fa-arrow-left {
        color: #FFF05A !important;
    }
    & .fa-arrow-left:hover {
        color: white !important;
    }
`;

const PaginationArrows = styled.div`
    display: flex;
    align-items: center;
    justify-content : center;
    padding: 0.3rem 0;
    & i {
        font-size: 30px;
        color: #FFF05A;
        border: 2px solid #FFF05A;
        padding: 2px 10px;
        background: #1c2541;
    }
    & i:hover {
        color: white;
        border: 2px solid white;
    }
`;

const SearchOptions = styled.div`
    width: 80%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-gap: 10px;
    & p {
        background: #FFF05A;
        width: 100%;
        padding: 1rem 0;
        cursor: pointer;
        text-align: center;
    }
    & p:hover {
        background: white;
    }
`;

const ActivityFollowing = styled.div`
    width: 100%;
    padding: 0.5rem 0;
    text-align: center;
    background: #1c2541;
    color: white;
`;

const NoContent = styled.div`
    width: 70vw;
    text-align: center;
    font-size: 25px;
    @media (max-width: 768px) {
        width: 80vw !important;
    }
`;

const TextWrapper = styled.div`
    padding: 1rem;
    text-align: justify;
    white-space: pre-line;
    & p {
        text-align: center;
        color: #FFF05A;
    }
    ${props => props.scores && css`
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        padding: 0;
        & p {
            color: white;
            font-size: 18px;
        }
        & b {
            color: #FFF05A;
        }
        @media (max-width: 768px) {
            display: grid;
            grid-template-columns: 1fr;
            padding: 0;
        }
    `}
`;

export {
    BasicWrapper,
    Airing,
    ContentInfoWrapper,
    ContentInfo,
    ListItems,
    SearchItems,
    Items,
    TituloWrapper,
    PaginationArrows,
    SearchOptions,
    ActivityFollowing,
    NoContent,
    TextWrapper
}