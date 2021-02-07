import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Message } from '../Styled Components/content';
import { FullPageWrapper } from '../Styled Components/form';
import { Spinner } from '../Styled Components/loader';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const ConfirmationPage = () => {
    document.title = 'Email Confirmation • AniDash';

    const [loading, setLoading] = useState(true);
    const [confirmed, setConfirmed] = useState(false);

    const { token } = useParams();

    const confirm = async() => {
        try {
            const body = {
                token: token
            }
            const response = await fetch(`${APIUrl}/users/confirm`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );

            if (response.status === 200) {
                setConfirmed(true);
            } else {
                toast.error(await response.text(), { position: 'bottom-right' });
            }

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        confirm();

        // eslint-disable-next-line
    }, [])

    return (
        <FullPageWrapper other>
            <Message>
                {loading ?
                    <Spinner />
                    :
                    confirmed ?
                        <div>
                            Your account has been confirmed!
                            <br/><br/>
                            You can now <Link to='/'>login</Link>!
                        </div>
                        :
                        <div>
                            Couldn't confirm your account.
                        </div>
                }
            </Message>
        </FullPageWrapper>
    );
}

export default ConfirmationPage;