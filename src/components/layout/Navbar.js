import React, { Fragment, useRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/userActions";
import M from "materialize-css/dist/js/materialize.min.js";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.nav.main, // Update with your desired background color
  },
  brandLogo: {
    textDecoration: "none",
    color: "white",
    marginRight: theme.spacing(2),
    "&:hover": {
      textDecoration: "none",
      color: "white",
    },
  },
  brandLogoText: {
    flexGrow: 1,
  },
  userGreetings: {
    marginRight: theme.spacing(2),
    color: "white",
  },
  avatar: {
    marginLeft: theme.spacing(2),
  },
  logoutButton: {
    color: "white",
  },
  searchContainer: {
    marginRight: "18px", // Adjusted to a pixel value
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff", // Change to white
    borderRadius: "4px",
    padding: "1px", // Adjusted to a pixel value
    height: "40px",
  },
  searchForm: {
    position: "relative",
    // marginRight: "10px", // Adjusted to a pixel value
    marginBottom: "0",
  },
  searchInput: {
    // border: "2px solid #FF4081 !important", // Contrasting color
    backgroundColor: "#fff !important", // White background
    color: "#333 !important", // Text color
    padding: "8px !important", // Adjusted to a pixel value
    borderRadius: "4px !important",
    outline: "none !important",
    width: "200px !important",
    transition: "width 0.3s ease-in-out !important",
    height: "70% !important", // Fill the container height
    "&:focus": {
      width: "300px !important",
    },
    marginBottom: "0 !important",
  },
  searchIcon: {
    position: "absolute",
    right: "4px", // Adjusted to a pixel value
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "black", // Contrasting color
    fontSize: "1rem", // Adjusted to a smaller pixel value
  },
}));

const Navbar = ({
  user: { user, isAuthenticated },
  logout,
  icon,
  title,
  // if not present, make default props
  onFilterDocs,
  onClearFilterDocs,
}) => {
  const classes = useStyles();
  const text = useRef("");

  const onClickClose = () => {
    text.current.value = "";
    onClearFilterDocs();
  };

  const searchHandler = (event) => {
    if (event.target.value !== "") {
      onFilterDocs(event.target.value);
    } else {
      onClearFilterDocs();
    }
  };

  const onLogout = () => {
    logout();
    M.toast({ html: "Successfully logged out" });
    window.location.href = "/";
  };

  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Link to="/home" className={classes.brandLogo}>
            <Typography variant="h6">{title}</Typography>
          </Link>

          <div className={classes.brandLogoText} />

        {/* only show search bar if user is on home page */}
        {window.location.pathname === "/home" ? (
          <div className={classes.searchContainer}>
            <div className={classes.searchForm}>
              <input
                id="search"
                type="search"
                placeholder="Search Documentation.."
                ref={text}
                className={classes.searchInput}
                onChange={(event) => searchHandler(event)}
                required
              />
              <i
                className={`material-icons ${classes.searchIcon}`}
                onClick={onClickClose}
              >
                close
              </i>
            </div>
          </div>
        ) : null}

          {isAuthenticated ? (
            <Fragment>
              <Typography variant="h6" className={classes.userGreetings}>
                Hi, {user.name}
              </Typography>

              <IconButton
                color="inherit"
                className={classes.logoutButton}
                onClick={onLogout}
              >
                <ExitToAppIcon />
              </IconButton>

              <Avatar
                src={user.imageUrl}
                alt=""
                height="50"
                width="50"
                className={classes.avatar}
              />
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  title: "Handle Docs",
  icon: "fas fa-pizza-slice",
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { logout })(Navbar);
