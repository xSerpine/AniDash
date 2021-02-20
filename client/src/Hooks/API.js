export const API = async(method, endpoint, hasHeaders = false, body = {}) => {
    switch (method) {
        case 'GET':
            try {
                const res = hasHeaders ? 
                    await fetch(endpoint, {
                        headers: {
                            'Authorization': localStorage.getItem('jwtToken')
                        }
                    })
                    :
                    await fetch(endpoint);
                const status = res.status;
                const statusMessage = status !== 200 ? await res.text() : null;
                const data = status === 200 ? await res.json() : null;
                return { status, statusMessage, data };
            } catch (error) {
                console.error(error);
            }
            break;
        case 'POST':
            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': localStorage.getItem('jwtToken')
                    },
                    body: JSON.stringify(body)
                });
                const status = res.status;
                const statusMessage = status !== 200 && res.headers.get('Content-Type').includes('text/html') ? await res.text() : null;
                const data = status === 200 && res.headers.get('Content-Type').includes('application/json') ? await res.json() : null;
                return { status, statusMessage, data };
            } catch (error) {
                console.error(error);
            }
            break;
        case 'PUT':
            try {
                const res = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': localStorage.getItem('jwtToken')
                    },
                    body: JSON.stringify(body)
                });
                const status = res.status;
                const statusMessage = status !== 200 && res.headers.get('Content-Type').includes('text/html') ? await res.text() : null;
                const data = status === 200 && res.headers.get('Content-Type').includes('application/json') ? await res.json() : null;
                return { status, statusMessage, data };
            } catch (error) {
                console.error(error);
            }
            break;
        case 'DELETE':
            try {
                const res = await fetch(endpoint, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': localStorage.getItem('jwtToken')
                    },
                    body: JSON.stringify(body)
                });
                const status = res.status;
                const statusMessage = status !== 200 && res.headers.get('Content-Type').includes('text/html') ? await res.text() : null;
                const data = status === 200 && res.headers.get('Content-Type').includes('application/json') ? await res.json() : null;
                return { status, statusMessage, data };
            } catch (error) {
                console.error(error);
            }
            break;
        default:
            break;
    }
}