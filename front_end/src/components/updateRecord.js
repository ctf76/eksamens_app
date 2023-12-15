import { Fragment, useState } from "react";
import { TextField, Button, FormGroup } from '@mui/material';
import config from '../config.js'

export default function UpdateRecord() {
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

    const handleInputChange = (fieldName, value) => {
        setResponseData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const updateUser = async (userId) => {
        const user_data = {
            name: responseData.name,
            surname: responseData.surname,
            age: responseData.age
        };
        console.log(user_data);
        try {
            const response = await fetch(`${config.apiUrl}user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user_data),
            });

            if (response.ok) {
                console.log(`${userId}: ${responseData.name} ${responseData.surname} (Age: ${responseData.age})`);
            } else {
                const { errors } = await response.json();
                console.log(`Failed to update user: ${errors[0].message} `);
            }
        } catch (error) {
            console.error('Error:', error);
            console.log('Unknown error');
        };


    };

    return (
        <Fragment>
            <h3>h3 så da</h3>
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
                            defaultValue={responseData.name}
                            sx={{ marginBottom: 2 }}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                        <TextField
                            label="Surname"
                            defaultValue={responseData.surname}
                            sx={{ marginBottom: 2 }}
                            onChange={(e) => handleInputChange('surname', e.target.value)}
                        />
                        <TextField
                            label="Age"
                            defaultValue={responseData.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                        />
                    </FormGroup>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={() => updateUser(userId)}
                    >
                        Update user
                    </Button>

                </Fragment>
            ) : null}
        </Fragment>
    );
};
