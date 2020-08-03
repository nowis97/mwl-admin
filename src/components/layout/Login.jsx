import React, {useState} from "react";
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField'
import {makeStyles} from '@material-ui/core/styles';
import { Field } from 'react-final-form';
import {useLocation} from 'react-router-dom'
import {useLogin,useNotify} from 'ra-core';
import CircularProgress from "@material-ui/core/CircularProgress";
import LockIcon from '@material-ui/icons/Lock';
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { Notification } from 'react-admin';
import bg from '../../assets/background.jpg';

const useStyles = makeStyles(theme => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        background:`url(${bg}) !important`,
    },
    card: {
        minWidth: 300,
        marginTop: '6em',
    },
    avatar: {
        margin: '1em',
        display: 'flex',
        justifyContent: 'center',
    },
    icon: {
        backgroundColor: theme.palette.secondary.main,
    },
    hint: {
        marginTop: '1em',
        display: 'flex',
        justifyContent: 'center',
        color: theme.palette.grey[500],
    },
    form: {
        padding: '0 1em 1em 1em',
    },
    input: {
        marginTop: '1em',
    },
    actions: {
        padding: '0 1em 1em 1em',
    },
}));
const renderInput = ({
                         meta: { touched, error } = { touched: false, error: undefined },
                         input: { ...inputProps },
                         ...props
                     }) => (
    <TextField
        error={!!(touched && error)}
        helperText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />
);
const validate = (values) => {
    const errors = {};
    if (!values.username) {
        errors.username = "Requerido"
    }
    if (!values.password) {
        errors.password = "Requerido";
    }
    return errors;
};


export const Login = () =>{
    const classes = useStyles();
    const login = useLogin();
    const location = useLocation();
    const notify = useNotify();

    const [loading, setLoading] = useState(false);
    const handleSubmit = (auth) => {
        setLoading(true);
        login(auth, location.state ? location.state.nextPathname : '/').catch(
            (error) => {
                setLoading(false);
                notify(
                    typeof error === 'string'
                        ? error
                        : typeof error === 'undefined' || !error.message
                        ? 'ra.auth.sign_in_error'
                        : error.message,
                    'warning'
                );
            }
        );
    };
    return (

                <form onSubmit={handleSubmit} noValidate>
                    <div className={classes.main}>
                        <Card className={classes.card}>
                            <div className={classes.avatar}>
                                <Avatar className={classes.icon}>
                                    <LockIcon />
                                </Avatar>
                            </div>

                            <div className={classes.form}>
                                <div className={classes.input}>
                                    <Field
                                        autoFocus
                                        name="username"
                                        component={renderInput}
                                        label={"E-mail"}
                                        disabled={loading}
                                    />
                                </div>
                                <div className={classes.input}>
                                    <Field
                                        name="password"
                                        // @ts-ignore
                                        component={renderInput}
                                        label={"Contraseña"}
                                        type="password"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <CardActions className={classes.actions}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                    disabled={loading}
                                    fullWidth
                                >
                                    {loading && (
                                        <CircularProgress
                                            size={25}
                                            thickness={2}
                                        />
                                    )}
                                    {"Ingresar"}
                                </Button>
                            </CardActions>
                        </Card>
                        <Notification />
                    </div>
                </form>
    );

}


