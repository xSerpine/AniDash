import React, { Fragment, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpacingElement } from '../Styled Components/navbar';
import UserContext from '../../Context/UserContext';
import { Titulo } from '../Styled Components/text';
import { Form, IMGPreview, InfoWrapper, InputWrapper } from '../Styled Components/form';
import { Btn } from '../Styled Components/btn';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function UserSettings({ setUserData }) {
    const user = useContext(UserContext);

    document.title = 'Settings • AniDash';
    
    const [avatar, setAvatar] = useState(user.avatar);
    const [inputs, setInputs] = useState({
        username: user.username,
        email: user.email,
        password: '',
        Cpassword: '',
        sfw: user.SFW
    });

    const { username, email, password, Cpassword, sfw } = inputs;

    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.type === 'checkbox' ? !e.target.checked : e.target.value });
    }

    const handleFile = async e => {
        const file = e.target.files[0];
       
        previewFile(file);
    }

    const previewFile = file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setAvatar(reader.result)
        }
    }

    const onSubmitForm = async e => {
        e.preventDefault();

        if(username === user.username && email === user.email && !password && avatar.includes('https://res.cloudinary.com') && sfw === user.SFW) return;

        if(password !== Cpassword) return toast.error('Passwords do not match.', { position: 'bottom-right' });

        try {
            const body = { 
                id: user.id,
                username: username !== user.username ? username : null, 
                email: email !== user.email ? email : null, 
                password, 
                avatar: !avatar.includes('https://res.cloudinary.com') ? avatar : null,
                sfw: sfw !== user.SFW ? sfw : null
            };
            const response = await fetch(`${APIUrl}/users/profile`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': localStorage.getItem('jwtToken')
                    },
                    body: JSON.stringify(body)
                }
            );

            if(response.status === 401) {
                localStorage.clear();
                window.location.reload();
            }

            if(response.status === 200) {
                const parseRes = await response.json();

                toast.success('Your settings have been updated!', { position: 'bottom-right' });
                localStorage.setItem('user', JSON.stringify({
                    username: parseRes.username,
                    email: parseRes.email,
                    avatar: parseRes.avatar,
                    SFW: parseRes.sfw
                }))
                setUserData(parseRes.username, parseRes.email, parseRes.avatar, parseRes.sfw);
            }
            else {
                toast.error(await response.text(), { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Fragment>
            <SpacingElement unwrapped />
            <Titulo>Settings</Titulo>
            {avatar && <IMGPreview><img src={avatar} alt='User Avatar' /></IMGPreview>}
            <Form onSubmit={onSubmitForm} settings>
                <InputWrapper>
                    <input type='file' id='file' name='avatar' placeholder='Choose an avatar' accept='image/*' onChange={handleFile} />  
                    <label htmlFor='file'>Choose an avatar</label>
                </InputWrapper>
                <InputWrapper>
                    <input type='text' id='username' name='username' placeholder='Username' value={username} onChange={e => onChange(e)} />
                    <label htmlFor='username'>Username</label>
                </InputWrapper>
                <InputWrapper>
                    <input type='email' id='email' name='email' placeholder='Email' value={email} onChange={e => onChange(e)} />
                    <label htmlFor='email'>Email</label>
                </InputWrapper>
                <InputWrapper>
                    <input type='password' id='password' name='password' placeholder='Password' value={password} onChange={e => onChange(e)} />  
                    <label htmlFor='password'>Password</label>
                </InputWrapper>
                <InputWrapper>
                    <input type='password' id='Cpassword' name='Cpassword' placeholder='Confirm Password' value={Cpassword} onChange={e => onChange(e)} />  
                    <label htmlFor='Cpassword'>Confirm Password</label>
                </InputWrapper>
                <InputWrapper checkbox>
                    <label htmlFor='sfw'>Allow Hentai (18+)</label>
                    <input type='checkbox' id='sfw' name='sfw' onChange={e => onChange(e)} checked={!sfw} />  
                </InputWrapper>
                <InfoWrapper>
                    <Btn primary type='submit'>Update my settings</Btn> 
                </InfoWrapper>
            </Form>
        </Fragment>
    );
}

export default UserSettings;