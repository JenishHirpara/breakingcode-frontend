import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Navbar from "../layout/Navbar";
import HomeCard from "../HomeCard/HomeCard";
import {
  fetchAllDocs,
  filterDocs,
  clearFilterDocs,
} from "../../actions/newDocs";

const Home = (props) => {
  
  useEffect(() => {
    props.onFetchAllDocs();
  }, []);

  const createNewDocHandler = () => {
    props.history.push("/newDoc");
  };


  let load = false;
  if (props.user !== null) {
    load = true;
  }

  return props.docs ? (
    <React.Fragment>
      <Navbar 
      onFetchAllDocs={props.onFetchAllDocs}
      onFilterDocs={props.onFilterDocs}
      onClearFilterDocs={props.onClearFilterDocs}
      />
      <div>
        
        {props.docs && props.filteredDocs ? (
          <HomeCard docs={props.filteredDocs} />
        ) : (
          <HomeCard docs={props.docs} />
        )}
        {load ? (
          props.user.role === "admin" ? (
            <Fab
              color="primary"
              aria-label="add"
              style={{ position: "fixed", bottom: "30px", right: "30px" }}
              onClick={createNewDocHandler}
            >
              <AddIcon />
            </Fab>
          ) : null
        ) : null}
      </div>
    </React.Fragment>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    docs: state.docs.docs,
    filteredDocs: state.docs.filtered,
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchAllDocs: () => dispatch(fetchAllDocs()),
    onFilterDocs: (text) => dispatch(filterDocs(text)),
    onClearFilterDocs: () => dispatch(clearFilterDocs()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
