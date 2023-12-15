import { Fragment, useState, forwardRef } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Slide } from '@mui/material';
import { makeStyles } from '@mui/styles';
import config from '../config.js'
// import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    button: {
        marginTop: theme.spacing(2),
    },
}));

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateUserForm() {
    const classes = useStyles();
    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        age: '',
    });
    const [message, setMessage] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCreateUser = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${config.apiUrl}create_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const { user_id } = await response.json();
                setMessage(`${user_id}: ${userData.name} ${userData.surname} (Age: ${userData.age})`);
                setOpenDialog(true);
            } else {
                const { errors } = await response.json();
                setMessage(`Failed to create user: ${errors[0].message} `);
                setOpenDialog(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Unknown error');
            setOpenDialog(true);
        }
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    return (
        <Fragment>
            <h1>skal ikke være en h1</h1>

            <form className={classes.root}>
                <div>
                    <TextField
                        label="Forename"
                        variant="outlined"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <TextField
                        label="Surname"
                        variant="outlined"
                        name="surname"
                        value={userData.surname}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <TextField
                        label="Age"
                        variant="outlined"
                        name="age"
                        value={userData.age}
                        onChange={handleInputChange}
                    />
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleCreateUser}
                >
                    Create User
                </Button>
            </form>
            <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <p>{message}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
