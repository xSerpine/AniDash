import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Form, FormWrapper, FullPageWrapper, InfoWrapper, InputWrapper } from '../Styled Components/form';
import { Btn } from '../Styled Components/btn';
import { Titulo } from '../Styled Components/text';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const LoginUser = ({ setAuth, setUserData }) => {
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
        try {
            const body = { user, password };
            const response = await fetch(`${APIUrl}/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );
    
            if (response.status === 200) {
                const parseRes = await response.json();
                
                toast.success(`Welcome to AniDash, ${parseRes.userInfo.username}!`, { position: 'bottom-right' });
                localStorage.setItem('jwtToken', parseRes.jwtToken);
                localStorage.setItem('user', JSON.stringify({
                    id: parseRes.userInfo._id,
                    username: parseRes.userInfo.username,
                    email: parseRes.userInfo.email,
                    avatar: parseRes.userInfo.avatar,
                    SFW: parseRes.userInfo.sfw
                }))
                setUserData(parseRes.userInfo._id, parseRes.userInfo.username, parseRes.userInfo.email, parseRes.userInfo.avatar, parseRes.userInfo.sfw);
  
                setAuth(true);
            } else {
                toast.error(await response.text(), { position: 'bottom-right' });
                setAuth(false);
            }
        } catch (error) {
            console.error(error);
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

export default LoginUser;