import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./App.css";
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css/dist/js/materialize.min.js";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Navbar from "./components/layout/Navbar";
import File from "./components/File";
import Doc from "./components/Doc/Doc";
import Home from "./components/Home/Home";
import NewDoc from "./components/NewDoc/NewDoc";
import EditedDoc from "./components/EditedDoc/EditedDoc";
import { loadUser } from "./actions/userActions";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";
import { GlobalStyles } from "./global";
import { useDarkMode } from "./useDarkMode";
import {createMuiTheme, ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles';
import Toggle from "./Toggler";
function App(props) {
  useEffect(() => {
    M.AutoInit();
    props.onLoadUser();
  }, [props]);

  const [theme, themeToggler] = useDarkMode();

  const themeMode = theme === "light" ? lightTheme : darkTheme;

  const MUIthemeMode = createMuiTheme({
    palette: {
      primary: {
        main: '#0a6fa2',
      },
      nav:{
        main: '#11a0ed',
      },
    },
  });

  return (
    <ThemeProvider theme={themeMode}>
      <MuiThemeProvider theme={MUIthemeMode}>
      <Router>
        <GlobalStyles />
        {/* <Toggle theme={theme} toggleTheme={themeToggler} /> */}
        {/* <Navbar /> */}
        <Switch>
          <Redirect exact from="/" to="register" />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route
            exact
            path="/file"
            component={File}
            toggleTheme={themeToggler}
          />
          <Route
            exact
            path="/newDoc"
            component={NewDoc}
            toggleTheme={themeToggler}
          />
          <Route
            exact
            path="/editedDoc"
            component={EditedDoc}
            toggleTheme={themeToggler}
          />
          <Route exact path="/home" component={Home} toggleTheme={themeToggler} />
          <Route exact path="/:id" component={Doc} toggleTheme={themeToggler} />
        </Switch>
      </Router>
      </MuiThemeProvider>
    </ThemeProvider>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoadUser: () => dispatch(loadUser()),
  };
};

export default connect(null, mapDispatchToProps)(App);
