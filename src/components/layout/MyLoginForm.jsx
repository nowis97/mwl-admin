import React, {useState} from "react";
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField'
import {makeStyles} from '@material-ui/core/styles';
import {Field, Form} from 'react-final-form';
import {useLocation} from 'react-router-dom'
import {useLogin,useNotify} from 'ra-core';
import CircularProgress from "@material-ui/core/CircularProgress";

import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { Login } from 'react-admin';
import bg from '../../assets/background.jpg';

const useStyles = makeStyles(theme => (
        {
            form: {
                padding: '0 1em 1em 1em',
            },
            input: {
                marginTop: '1em',
            },
            button: {
                width: '100%',
            },
            icon: {
                marginRight: theme.spacing(1),
            },
        }),
    { name: 'RaLoginForm' }
);
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
    if (!values.email) {
        errors.email = "Requerido"
    }
    if (!values.password) {
        errors.password = "Requerido";
    }
    return errors;
};


const MyLoginForm = (props) =>{
    const classes = useStyles(props);
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
    return (   <Form
            onSubmit={handleSubmit}
            validate={validate}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} noValidate>
                    <div className={classes.form}>
                        <div className={classes.input}>
                            <Field
                                autoFocus
                                id="email"
                                name="email"
                                component={renderInput}
                                label={'E-mail'}
                                type={'email'}
                                disabled={loading}
                            />
                        </div>
                        <div className={classes.input}>
                            <Field
                                id="password"
                                name="password"
                                component={renderInput}
                                label={'Contraseña'}
                                type="password"
                                disabled={loading}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>
                    <CardActions>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            className={classes.button}
                        >
                            {loading && (
                                <CircularProgress
                                    className={classes.icon}
                                    size={18}
                                    thickness={2}
                                />
                            )}
                            {'Ingresar'}
                        </Button>
                    </CardActions>
                </form>
            )}
        />
    );

}

export const MyLogin = props =>{

    return <Login backgroundImage={bg}>
        <MyLoginForm/>
    </Login>

}


