import { Fragment, useState } from "react";
import { Button, Grid } from '@mui/material';
// import { makeStyles } from '@mui/styles';
import config from '../config.js'
import { DataGrid } from '@mui/x-data-grid';

export default function CreateReadRecords() {
    const [responseData, setResponseData] = useState([]);
    const [columns, setColumns] = useState([]);

    const fetchData = async (endpoint, uniqueIdentifier) => {
        try {
            const response = await fetch(`${config.apiUrl}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setResponseData(data);
                // setMessage(`None`);
            } else {
                // const { errors } = await response.json();
                // setMessage(`Failed to fetch data: ${errors[0].message} `);
            }
        } catch (error) {
            console.error('Error:', error);
            //   setMessage('Unknown error');
        }
    };

    const handleReadManyFriends = (event) => {
        event.preventDefault();
        fetchData('usersw10f', 'user_id');
        const newColumns = [
            { field: 'user_id', headerName: 'User ID', width: 120 },
            { field: 'full_name', headerName: 'Full Name', width: 200 },
            { field: 'nb_friends', headerName: 'Number of Friends', width: 180 },
        ];
        setColumns(newColumns);
    };

    const handleUserWMostPosts = (event) => {
        event.preventDefault();
        fetchData('usersmostposts');
        const newColumns = [
            { field: 'user_id', headerName: 'User ID', width: 120 },
            { field: 'full_name', headerName: 'Full Name', width: 200 },
            { field: 'post_count', headerName: 'Number of Posts', width: 180 },
        ];
        setColumns(newColumns);
    };

    const handlePostWMostReactions = (event) => {
        event.preventDefault();
        fetchData('postswithmostreactions');
        const newColumns = [
            { field: 'post_id', headerName: 'Post ID', width: 120 },
            { field: 'post_type', headerName: 'Post type', width: 120 },
            { field: 'user_id', headerName: 'User ID', width: 120 },
            { field: 'user_name', headerName: 'User', width: 180 },
            { field: 'reaction_count', headerName: 'Number of reactions', width: 180 }
        ];
        setColumns(newColumns);
    };

    return (
        <Fragment>
            <h2>Nok heller ikke h2?</h2>
            <Grid container spacing={1}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleReadManyFriends}
                    >
                        Get users with more than 10 friends
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleUserWMostPosts}
                    >
                        Users with most posts
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled
                        onClick={handlePostWMostReactions}
                    >
                        Posts with most reactions
                    </Button>
                </Grid>
            </Grid>
            {responseData !== null ? (
                <DataGrid
                    rows={responseData}
                    getRowId={(row) => row.user_id}
                    columns={columns}
                    pagination
                    initialState={{
                        ...responseData.initialState,
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    autoHeight
                />
            ) : (
                <p>Press the button to fetch data.</p>
            )}
        </Fragment>
    );
};
