import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {signup} from "../fetch/requestAPI";
import {navigate} from "@reach/router";


const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp() {
    const classes = useStyles();
    //
    // const [formInfo, setFormInfo] = useState({
    //     userType: "",
    //     username: "",
    //     password: "",
    // });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleOnClick = async () => {
        console.log(email, password);
        let res;
        try{
            res = await signup(email, password);
        } catch (err) {
            console.log(err);
        }
        if (res === '注册成功') {
            window.alert('注册成功，可前往登录页登录');
        } else {
            window.alert('注册失败，请重新尝试');
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePwdChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        {/*<Grid item xs={12} sm={6}>*/}
                        {/*    <TextField*/}
                        {/*        autoComplete="fname"*/}
                        {/*        name="firstName"*/}
                        {/*        variant="outlined"*/}
                        {/*        required*/}
                        {/*        fullWidth*/}
                        {/*        id="firstName"*/}
                        {/*        label="First Name"*/}
                        {/*        autoFocus*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        {/*<Grid item xs={12} sm={6}>*/}
                        {/*    <TextField*/}
                        {/*        variant="outlined"*/}
                        {/*        required*/}
                        {/*        fullWidth*/}
                        {/*        id="lastName"*/}
                        {/*        label="Last Name"*/}
                        {/*        name="lastName"*/}
                        {/*        autoComplete="lname"*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={handlePwdChange}
                            />
                        </Grid>
                        {/*<Grid item xs={12}>*/}
                        {/*    <FormControlLabel*/}
                        {/*        control={<Checkbox value="allowExtraEmails" color="primary" />}*/}
                        {/*        label="I want to receive inspiration, marketing promotions and updates via email."*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                    </Grid>
                    <Button
                        // type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleOnClick}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="space-around">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}