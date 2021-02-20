import styled, { css } from 'styled-components';

const ContentInfoBar = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
    & div {
        width: 100%;
        padding: 1rem 0;
        border-bottom: 2px solid;
    }
    & div:hover, & .active {
        color: #FFF05A;  
    }
    @media (max-width: 768px) {
        flex-flow: column;
    } 
`;

const AddItem = styled.button`
    width: 100%;
    position: absolute;
    background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;
`

const ImageOverlay = styled.div`
    position: relative;
    display: flex;
    width: inherit;
    height: 2.5rem !important;
    top: -2.75rem;
    text-align: center;
    background: rgba(0,0,0,0.7);
    justify-content: center;
    align-items: center;
`;

const Tracking = styled.div`
    position: relative;
    width: 100%;
    color: #fff;
    display: flex;
    justify-content: space-evenly;
    background: #1c2541;
    & input {
        width: 45px;
        background: transparent;
        border: none;
        font-size: 18px;
        color: #FFF05A;
        text-align: center;
        border-bottom: 2px solid;
        outline: none;
        line-height: 25px;
    }
    & div {
        position: relative;
        width: 100%;
        padding: 1rem;
        text-align: center;
        font-size: 20px; 
    }
    & .add, & .remove {
        cursor: pointer;
        position: absolute;
        padding: 0;
        right: 35%;
    }
    & .add {
        top: 53px;
    }
    & .remove {
        bottom: 28px;
    }
    & .add:hover, & .remove:hover {
        color: #FFF05A;
    }
    & div p {
        color: #FFF05A;
        text-transform: capitalize;
    }
    @media (max-width: 768px) {
        flex-flow: column;
        & .add, & .remove {
            right: 30%;
        }
        & div {
            padding: 1rem 0;
        }
    }
`;

const Stats = styled.div`
    position: relative;
    width: 100%;
    background: #1c2541;
    color: #fff;
    display: flex;
    padding: 0.5rem 0;
    align-items: center;
    justify-content: space-around;
    text-align: center;
    & div {
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-size: 20px;
    }
    & div p {
        margin: 0;
    }
    & div.planning {
        background: #38b000;  
    }
    & div.current {
        background: #48cae4;      
    }
    & div.dropped {
        background: #9d4edd;  
    }
    & div.completed {
        background: #c71f37;  
    }
    & span.planning {
        color: #38b000;
    }
    & span.current {
        color: #48cae4;
    }
    & span.dropped {
        color: #9d4edd;
    }
    & span.completed {
        color: #c71f37;
    }
    @media (max-width: 768px) {
        flex-flow: column;
    }  
`;

const Characters = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 25px;
    padding: 2rem 0;
    & .characters {
        background: #1c2541;
        display: flex;
        justify-content: space-between;
    }
    & .characters div {
        display: flex;
    }
    & .characters div p {
        font-size: 20px;
        padding: 0.5rem;
    }
    & .characters div span {
        font-size: 14px;
    }
    & .characters div.right {
        text-align: right;
        justify-content: end;
    }
    & div img {
        height: 140px;
        width: 100px;
    }
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-gap: 10px;
        & .characters div p {
            font-size: 14px;
        }
        & .characters div span {
            font-size: 10px;
        }
        & div img {
            height: 100px;
            width: 60px;
        }
    } 
`;

const AiringWrapper = styled.div`
    display: flex;
    width: 80%;
    margin: 0 auto;
    align-items: center;
    &:hover span {
        visibility: visible;
    }
    ${props => props.details && css`
        width: 100%;
    `}
`;

const Airing = styled.div`
    width:100%;
    color: #fff;
    background: #1c2541;
    padding: 1rem;
    margin: 0 auto;
    overflow-x: auto;
    overflow-y: hidden;
    display: grid;
    grid-template-columns: repeat(auto-fill, 140px);
    grid-auto-flow: column;
    grid-auto-columns: minmax(140px, 1fr);
    grid-gap: 10px;
    scrollbar-color: #FFF05A #1c2541;
    scrollbar-width: thin;
    & .item:last-child {
        padding-right: inherit;
        width: 140px;
    }
    &::-webkit-scrollbar {
        background-color: #1c2541;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #FFF05A;
    }
    & .item div {
        height: 210px;
        border-radius: 0 0 5px 5px;
        overflow: hidden; 
    }
    & .item img {
        border-radius: 5px;
        width:100%;
        height:100%;
        transition: transform .5s ease;
    }
    & img:hover {
        filter: opacity(40%);
        cursor: pointer;
        transform: scale(1.2);
    }
    ${props => props.users && css`
        & .item div {
            height: 140px;
        } 
    `}
`;

const AiringControls = styled.div`
    visibility: hidden;
    width: 80%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & span {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        text-align: center;
        font-size: 25px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50px;
        cursor: pointer;
    }
    & .left {
        margin-left: -25px;
    }
    & .right {
        margin-right: -25px;
    }
`

const ContentWrapper = styled.div`
    width:80%;
    margin: 0 auto;
    color: #fff;
`;

const ContentInfo = styled.div`
    margin: 0 auto;
    color: #fff;
    display: grid;
    grid-gap: 10px;
    ${props => props.lists && css`
        display: flex !important;   
        @media (max-width: 768px) {
            display: grid !important;
        }  
    `}
    ${props => props.description && css`
        line-height: 1.5;
        font-size: 20px;
        grid-template-columns: 215px auto;  
        ${({ hasText }) => !hasText && css`
            justify-content: center;
        `}
        & div {
            text-align: justify;
            background: #1c2541;
        }
        & img {
            display: flex;
            align-self: center;
            width: 100%;
        }
        @media only screen and (max-width: 769px) and (min-width: 420px) {
            & img {
                width: 50% !important;
                margin: 0 auto !important;
            }
        } 
    `}
    ${props => props.overview && css`
        grid-template-columns: 2fr minmax(120px, 0.6fr); 
        ${({ hasTrailer }) => !hasTrailer && css`
            display: block;
            & div {
                display: flex;
                justify-content: space-around;
            }
            @media (max-width: 768px) {
                width: 100%;
                & div {
                    flex-direction: column;
                }
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
        }
    `}
    ${props => props.users && css`
        background: #1c2541;
        padding: 1rem;
        position: relative;
        grid-template-columns: repeat(auto-fill, 140px);
        & .item div {
            height: 140px;
            width: 140px;
        }
        & .item img {
            border-radius: 5px;
            width: 100%;
            height: 100%;
            transition: transform .5s ease;
        }
        & img:hover {
            filter: opacity(40%);
            cursor: pointer;
            transform: scale(1.1);
        }
        @media (max-width: 768px) {
            background: none;
            & .item {
                display: flex;
                justify-content: center;
            }
        } 
    `}
    ${props => props.search && css`
        display: flex; 
        padding-bottom: 5%;
        @media (max-width: 768px) {
            justify-content: center;
        } 
    `}
    & img {
        height: auto;
        width: 100%;
    }
    @media (max-width: 768px) {
        grid-template-columns: minmax(120px, 1fr); 
    }  
`;

const ContentRelated = styled.div`
    margin: 0 auto;
    background: #1c2541;
    padding: 0.5rem;
    font-size: 18px;
    display: flex;
    justify-content: space-evenly;
    text-align: center;
    & .relatedWrapper {
        width: 100%;
    }
    @media (max-width: 768px) {
        flex-direction: column;
        & .relatedWrapper {
            width: 100%;
            padding: 0.5rem 0;
        }
    }  
`;

const ContentCover = styled.div`
    position: relative;
    height: min-content;
    background: none !important;
`;

const ContentActions = styled.div`
    display: grid;
    grid-template-columns: auto 40px;
    grid-gap: 5px;
    margin-top: 15px;
    background: none !important;
    & div {
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
    }
    & .status {
        color: #000;
        position: relative;
    }
    & .status.active .options {
        opacity: 1;
        visibility: visible;
    }
    & .favorite {
        border: 2px solid red;
        background: transparent;
        & i {
            padding: 0;
            color: red;
        }
    }
    & .selected {
        display: flex;
        justify-content: space-between;
        padding: 0 5px; 
        border: 2px solid #FFF05A;
        background: #FFF05A;
        text-transform: capitalize;
    }
    & .selected i {
        display: flex;
        align-items: center;
    }
    & .options {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        opacity: 0;
        visibility: hidden;
    }
    & .options div {
        border-radius: 0;
        border-bottom: 2px solid #FFF05A;
        background: #13192d;
        color: #fff;
    }
    & .options div:hover {
        color: #FFF05A;
    }
`;

const ListItems = styled.div`
    display: grid;
    background: #1c2541;
    grid-template-columns: repeat(auto-fill, minmax(140px, 0.5fr));
    grid-gap: 10px;
    width: 100%;
    padding: 1rem;
    margin: 0 auto;
    height: max-content;
    position: relative;
    color: #fff;
    & .item div {
        height: 210px;
        border-radius: 0 0 5px 5px;
        overflow: hidden; 
    }
    & .item img {
        border-radius: 5px;
        width:100%;
        height:100%;
        transition: transform .5s ease;
    }
    & img:hover {
        filter: opacity(40%);
        cursor: pointer;
        transform: scale(1.2);
    }
    @media (max-width: 768px) {
        ${props => props.lists && css`
            grid-template-columns: fit-content;
            padding: 0;
            background: none;
            width: 100%;
            justify-content: center;
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
        height: 210px;
        border-radius: 0 0 5px 5px;
        overflow: hidden; 
    }
    & .item img {
        border-radius: 5px;
        width:100%;
        height:100%;
        transition: transform .5s ease;
    }
    & img:hover {
        filter: opacity(40%);
        cursor: pointer;
        transform: scale(1.2);
    }
    @media (max-width: 768px) {
        padding: 0 !important;
        height: 0;
    } 
`;

const ItemsWrapper = styled.div`
    & span {
        display: block;
        background: #fff;
        color: #000;
        padding: 0.5rem 1rem;
        width: auto;
        text-align:center;
        cursor: pointer;
        border-radius: 5px;
    }
    & span:hover {
        color: black;
        background: #FFF05A;
    }
    & div {
        display: none;
    }
    &.active div {
        display: block;
    }
`;

const Items = styled.div`
    cursor: pointer;
    background: #1c2541;
    color: #000;
    width: 95%;
    margin-left: 5%;
    text-align: center;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    &:hover {
        color: black;
        background: #FFF05A;
    }
    ${props => props.option && css`
        cursor: ;
        margin-bottom: 0.5rem;
        
    `}
    ${props => props.suboption && css`
        padding: 0.5rem 0;
        background: #1c2541;
        color: #fff;
        
        cursor: pointer;
        margin-bottom: 0.5rem;
        &:first-child {
            margin-top: 0.5rem;
        }
        &:hover {
            color: black;
            background: #FFF05A;
        }   
    `}
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

const SearchOptions = styled.div`
    width: 80%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 49.5% 49.5%;
    grid-gap: 1%;
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

const ActivityContent = styled.div`
    padding: 1rem;
    text-align: center;
    background: #1c2541;
    color: white;
    & div {
        width: 100%;
        display: grid;
        grid-template-columns: 80% 20%; 
    }
    & div h4 {
        width: 100%;
        padding: 0;
        margin: 0;
        text-align: justify;
    }
    @media (max-width: 768px) {
        & div {
            grid-template-columns: 1fr; 
            grid-gap: 20px;
        }
    }
`;

const NoContent = styled.div`
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 1rem 0;
    background: #1c2541;
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
            font-size: 20px;
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

const Message = styled.div`
    text-align: center;
    color: #fff;
    font-size: 30px;
    background: #0b132b;
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    box-shadow: 20px 20px 50px #000;
    padding: 5%;
    opacity: 0.9;
    border-radius: 5px;
    @media (max-width: 768px) {
        width: 100%;
        padding: 15%;
    }
`;

const AdContent = styled.div`
    width: 80%;
    margin: 0 auto;
    background-color: #1b2e68;
    color: #fff;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 20px;
    border-radius: 5px;
    & div {
        padding: 2rem;
        width: 100%;
        text-align: center;
    }
    & div:last-child {
        border-left: 2px solid #0b132b;
        text-align: justify;
        line-height: 1.5;
    }
    @media (max-width: 768px) {
        flex-direction: column;
        & div:last-child {
            border-top: 4px solid #0b132b;
        }
        & div:last-child ul li {
            width: 90%;
        }
    }
`;

export {
    ContentInfoBar,
    AddItem,
    ImageOverlay,
    Tracking,
    Stats,
    Characters,
    AiringWrapper,
    Airing,
    AiringControls,
    ContentWrapper,
    ContentInfo,
    ContentRelated,
    ContentCover,
    ContentActions,
    ListItems,
    SearchItems,
    ItemsWrapper,
    Items,
    TituloWrapper,
    SearchOptions,
    ActivityContent,
    NoContent,
    TextWrapper,
    Message,
    AdContent
}