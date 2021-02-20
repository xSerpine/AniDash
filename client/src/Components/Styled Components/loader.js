import styled from 'styled-components';

const Spinner = styled.div`
    width: 40px;
    height: 40px;
    margin: 100px auto;
    background-color: #FFF05A;
    border-radius: 100%;  
    -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
    animation: sk-scaleout 1.0s infinite ease-in-out;
    @-webkit-keyframes sk-scaleout {
        0% { -webkit-transform: scale(0) }
        100% {
          -webkit-transform: scale(1.0);
          opacity: 0;
        }
    }
    @keyframes sk-scaleout {
        0% { 
          -webkit-transform: scale(0);
          transform: scale(0);
        } 
        100% {
          -webkit-transform: scale(1.0);
          transform: scale(1.0);
          opacity: 0;
        }
    }
`;

const SpinnerWithText = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

export {
    Spinner,
    SpinnerWithText
}