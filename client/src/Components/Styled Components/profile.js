import styled from 'styled-components';

const ProfileOverviewWrapper = styled.div`
    width: 80%;
    display: flex;
    align-items: center;
    margin: 0 auto;
    background: #1c2541;
    height: 200px;
    border-radius: 100px;
    @media (max-width: 768px) {
        display: grid !important;
        grid-template-columns: 1fr !important;
        background: none;
        height: 100%;
    } 
`;

const ProfilePicture = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    @media (max-width: 768px) {
        margin: 0 auto;
    } 
`;

const ProfileStats = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;
    font-size: 25px;
    color: #fff;
    & b {
        font-size: 28px;
        color: #FFF05A;
    }
    & p {
        color: white;
        text-align:center;
    }
    @media (max-width: 768px) {
        display: block !important;
        padding-top: 1rem;
        & div {
            padding: 0.5rem 0;
        }
    } 
`;

const ProfileDetailedStats = styled.div`
    width: 80%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 25px;
    color: #fff;
    & h1 {
        font-size: 25px;
    }
    & div {
        background: #1c2541;
        padding: 0.5rem;
    }
    & div hr {
        border: 2px solid #fff;
    }
    & .statsWrapper {
        font-size: 20px;
        text-align: center;
        display: flex;
        justify-content: space-evenly;
    }
    & .statsWrapper p {
        color: #FFF05A;
        font-size: 25px;
        margin: 0;  
    }
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        & .statsWrapper {
            flex-direction: column;
        }
    } 
`;

export {
    ProfileOverviewWrapper,
    ProfilePicture,
    ProfileStats,
    ProfileDetailedStats
}