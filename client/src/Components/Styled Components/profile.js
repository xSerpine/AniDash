import styled from 'styled-components';

const ProfilePageWrapper = styled.div`
    width: 80%;
    display: flex;
    align-items: center;
    margin: 0 auto;
    background: #1c2541;
    height: 200px;
    border-radius: 100px 0 0 100px;
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

const InfoWrapper = styled.div`
    display: flex;
    align-items: center;
    align-self: center;
    justify-content: space-between;
    width: 100%;
    font-size: 25px;
    & b {
        color: #FFF05A;
    }
    & p {
        color: white;
        text-align:center;
    }
    @media (max-width: 768px) {
        display: block !important;
    } 
`;

export {
    ProfilePageWrapper,
    ProfilePicture,
    InfoWrapper
}