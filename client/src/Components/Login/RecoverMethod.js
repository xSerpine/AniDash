import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Btn } from '../Styled Components/btn';
import { Form, FormWrapper, FullPageWrapper, InfoWrapper, InputWrapper } from '../Styled Components/form';
import { Titulo } from '../Styled Components/text';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const RecoverMethod = () => {
    document.title = 'Forgot Password • AniDash';

    const [email, setEmail] = useState('');

    const onChange = e => {
        setEmail(e.target.value);
    }

    const onSubmitForm = async e => {
        e.preventDefault();

        try {
            const body = {
                email: email
            }
            const response = await fetch(`${APIUrl}/users/recover`,
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );

            if (response.status === 200) {
                toast.success('An email has been sent to help you recover your password!', { position: 'bottom-right' });
                setEmail('');
            } else {
                toast.error(await response.text(), { position: 'bottom-right' });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <FullPageWrapper other>
            <FormWrapper>
                <Titulo>Recover your password!</Titulo>
                <Form onSubmit={onSubmitForm}>
                    <InputWrapper>
                        <input type='text' id='user' name='user' placeholder='Email' value={email} onChange={e => onChange(e)} />
                        <label htmlFor='user'>Email</label>
                    </InputWrapper>
                    <InfoWrapper>
                        <Btn primary type='submit'>Recover password</Btn> 
                        <p className='actions' style={{marginTop: '20px'}}>Go back to <Link to='/'>login</Link></p>
                    </InfoWrapper>
                </Form>
            </FormWrapper>
        </FullPageWrapper>
    );
}

export default RecoverMethod;