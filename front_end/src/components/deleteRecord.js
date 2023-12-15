import { Fragment, useState } from "react";
import { TextField, Button, FormGroup } from '@mui/material';
import config from '../config.js'

export default function DeleteRecord() {
    const [userId, setUserId] = useState('');
    const [responseData, setResponseData] = useState(null);

    const getUserById = async (userId) => {
        setUserId(userId);
        try {
            console.log(`${config.apiUrl}user/${userId}`);
            const response = await fetch(`${config.apiUrl}user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const jsonData = await response.json();
            console.log(jsonData);
            setResponseData(jsonData);
            console.log(responseData);
        } catch (err) {
            console.log(err)
        };
    };

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`${config.apiUrl}user/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(`Deleted: ${userId}: ${responseData.name} ${responseData.surname} (Age: ${responseData.age})`);
            } else {
                const { errors } = await response.json();
                console.log(`Failed to delete user: ${errors[0].message} `);
            }
        } catch (error) {
            console.error('Error:', error);
            console.log('Unknown error');
        };


    };

    return (
        <Fragment>
            <h4>Giver op</h4>
            <form noValidate autoComplete="off">
                <TextField
                    id="user_id"
                    label="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => getUserById(userId)}
                >
                    Submit
                </Button>
            </form>
            {responseData !== null ? (
                <Fragment>
                    <FormGroup sx={{ marginTop: 2 }}>
                        <TextField
                            label="Forename"
                            value={responseData.name}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Surname"
                            value={responseData.surname}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Age"
                            value={responseData.age}
                        />
                    </FormGroup>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={() => deleteUser(userId)}
                    >
                        Delete user
                    </Button>

                </Fragment>
            ) : null}
        </Fragment>
    );
};
