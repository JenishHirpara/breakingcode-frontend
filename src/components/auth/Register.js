import React, { useState, useEffect } from "react";
import "../../App.css";

import { registerUser } from "../../actions/userActions";

import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import InputAdornment from "@material-ui/core/InputAdornment";

import MailOutlineIcon from "@material-ui/icons/MailOutline";
import Grid from "@material-ui/core/Grid";

import { connect } from "react-redux";

import { useHistory } from "react-router-dom";
import M from "materialize-css/dist/js/materialize.min.js";
import LockOpenIcon from "@material-ui/icons/LockOpen";
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        KnowIt
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Register = ({ registerUser, isAuthenticated }) => {
  const classes = useStyles();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [imageUrl, setImageUrl] = useState();
  let history = useHistory();

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/home");
      M.toast({ html: `${name} you have successfully been registered!` });
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const { name, email, password, password2 } = user;

  const onFileChange = (e) => {
    setImageUrl(e.target.files[0]);
  };

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    try {
      e.preventDefault(); // Move this line to the beginning to ensure it's the first statement
  
      if (name === "" || email === "" || password === "" || password2 === "") {
        M.toast({ html: `Kindly fill in all the details` });
      }
       else if(!imageUrl){
          M.toast({ html: `Kindly upload a profile photo` });
        }
      else if (password !== password2) {
        M.toast({
          html: `Passwords do not match, Kindly reenter to register successfully!`,
        });
      } else {
        console.log(name, email, password, password2);
  
        const formData = new FormData();
        const item = {
          name,
          email,
          password,
        };
        for (var key in item) {
          formData.append(key, item[key]);
        }
        console.log(imageUrl);
        formData.append("imageUrl", imageUrl);
        await registerUser(formData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up!!
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              className={classes.underline}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonAddIcon />
                  </InputAdornment>
                ),
              }}
              disableUnderline
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              autoFocus
              name="name"
              value={name}
              id="name"
              onChange={onChange}
            />
            <TextField
              className={classes.underline}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon />
                  </InputAdornment>
                ),
              }}
              disableUnderline
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={onChange}
            />
            <TextField
              className={classes.underline}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onChange}
              value={password}
            />
            <TextField
              className={classes.underline}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Password Confirm"
              type="password"
              id="password2"
              autoComplete="current-password"
              onChange={onChange}
              value={password2}
            />
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="contained-button-file"
              onChange={onFileChange}
              multiple
              type="file"
            />
            <label htmlFor="contained-button-file">
              <Button variant="contained" color="primary" component="span">
                Upload profile photo
              </Button>
            </label>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onSubmit}
            >
              Register with us!
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  inputphoto: {
    display: "none",
  },
  underline: {
    "&&&:before": {
      borderBottom: "none",
    },
    "&&:after": {
      borderBottom: "none",
    },
  },
}));
const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
});

export default connect(mapStateToProps, { registerUser })(Register);
