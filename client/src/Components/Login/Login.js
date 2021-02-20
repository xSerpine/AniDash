import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Form, FormWrapper, FullPageWrapper, InfoWrapper, InputWrapper } from '../Styled Components/form';
import { Btn } from '../Styled Components/btn';
import { Titulo } from '../Styled Components/text';
import { API } from '../../Hooks/API';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const Login = ({ setAuth, setUserData }) => {
    document.title = 'Login • AniDash';
    
    const [inputs, setInputs] = useState({
        user: '',
        password: ''
    });

    const { user, password } = inputs;
    
    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
    
    const onSubmitForm = async e => {
        e.preventDefault();

        const body = { 
            user, 
            password 
        };
        const { status, statusMessage, data } = await API('POST', `${APIUrl}/auth/login`, null, body);

        if (status === 200) {            
            toast.success(`Welcome to AniDash, ${data.userInfo.username}!`, { position: 'bottom-right' });
            localStorage.setItem('jwtToken', data.jwtToken);
            localStorage.setItem('user', JSON.stringify({
                id: data.userInfo._id,
                username: data.userInfo.username,
                email: data.userInfo.email,
                avatar: data.userInfo.avatar,
                SFW: data.userInfo.sfw
            }))
            setUserData(data.userInfo._id, data.userInfo.username, data.userInfo.email, data.userInfo.avatar, data.userInfo.sfw);

            setAuth(true);
        } else {
            toast.error(statusMessage, { position: 'bottom-right' });
            setAuth(false);
        }
    }

    return (
        <FullPageWrapper className='outside' auth>
            <FormWrapper>
                <Titulo>Ani<span style={{color: '#fff'}}>Dash</span></Titulo>
                <Form onSubmit={onSubmitForm}>
                    <InputWrapper>
                        <input type='text' id='user' name='user' placeholder='Email or Username' value={user} onChange={e => onChange(e)} />
                        <label htmlFor='user'>Email or Username</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type='password' id='password' name='password' placeholder='Password' value={password} onChange={e => onChange(e)} />  
                        <label htmlFor='password'>Password</label>
                    </InputWrapper>
                    <InfoWrapper>
                        <Btn primary type='submit'>Login</Btn> 
                        <p className='actions' style={{marginTop: '20px'}}>Forgot your password? <Link to='/forgot'>Recover it!</Link></p>
                        <p className='actions'>Don't have an account yet? <Link to='/register'>Sign Up!</Link></p>
                        <p className='actions'>Just want to see a glimpse of AniDash? <Link to='/guest'>Enter as a guest!</Link></p>
                    </InfoWrapper>
                </Form>
            </FormWrapper>
        </FullPageWrapper>
    );
}

export default Login;