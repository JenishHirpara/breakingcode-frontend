import React, { useEffect, useState } from "react";
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import Navbar from "../layout/Navbar";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    margin: "auto",
    marginTop: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    borderRadius: theme.spacing(2),
  },
  listItem: {
    background: "#f9f9f9",
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  listItemText: {
    color: theme.palette.text.primary,
    fontSize: "16px", 
  },
  username: {
    fontWeight: "bold",
    marginRight: theme.spacing(1),
  },
  acceptIcon: {
    color: theme.palette.success.main,
  },
  rejectIcon: {
    color: theme.palette.error.main,
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(3),
    marginTop: "24px !important",
  },
}));

const EditedDoc = (props) => {
  const classes = useStyles();
  const [editedDocs, setEditedDocs] = useState(null);
  console.log(props);

  const apiFetch = async () => {
    // console.log(props.match.params.selectedDoc)
    console.log(props.location.selectedDoc)
    if (props.user?.role === "admin" && props.location?.selectedDoc?.author === props.user._id) {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
      const response = await axios.get("https://breakingcode.onrender.com/api/editedDocs/");
      console.log(response.data);
      setEditedDocs(response.data);
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
      const response = await axios.get("https://breakingcode.onrender.com/api/editedDocs/mydoc/");
      console.log(response.data);
      setEditedDocs(response.data);
    }
  };

  useEffect(() => {
    apiFetch();
  }, []);

  const deleteHandler = async (id, index) => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
    await axios.delete("https://breakingcode.onrender.com/api/editedDocs/" + id);
    let dup = [...editedDocs];
    dup.splice(index, 1);
    setEditedDocs(dup);
  };

  const acceptEditHandler = async (docId, id, text, editedDocId, index) => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
    const data = {
      data: {
        _id: id,
        text: text,
      },
    };
    const response = await axios.post("https://breakingcode.onrender.com/api/newdocs/update/" + docId, data);
    console.log(response);
    if (response.status === 200) {
      deleteHandler(editedDocId, index);
    } else {
      console.log('some error processing in the request...');
    }
  };

  return editedDocs !== null ? (
    <>
    <Navbar />
    <div>
      <Typography variant="h4" className={classes.title}>
        Edited Docs
      </Typography>
      <List className={classes.root}>
        {editedDocs.length === 0 && (
          <Typography variant="h6" className={classes.title}>
            No Edited Docs
          </Typography>
        )}
        {editedDocs.map((editedDoc, index) => 
        {
        return (
          <div key={editedDoc._id} className={classes.listItem}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar className={classes.listItemAvatar}>
                <Avatar alt="Author" src={editedDoc.by.imageUrl} />
              </ListItemAvatar>
              <ListItemText
                className={classes.listItemText}
                primary={editedDoc.model.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.listItemText}
                    >
                      <span className={classes.username}>
                        {editedDoc.by.name}:
                      </span>
                      {editedDoc.text}
                    </Typography>
                  </React.Fragment>
                }
              />
              {props.user.role === "admin" &&
              props.location.selectedDoc.author === props.user._id ? (
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() =>
                      acceptEditHandler(
                        editedDoc.model,
                        editedDoc.mainId,
                        editedDoc.text,
                        editedDoc._id,
                        index
                      )
                    }
                  >
                    <CheckIcon className={classes.acceptIcon} />
                  </IconButton>
                  <IconButton
                    onClick={() => deleteHandler(editedDoc._id, index)}
                  >
                    <ClearIcon className={classes.rejectIcon} />
                  </IconButton>
                </ListItemSecondaryAction>
              ) : null}
            </ListItem>
            {index < editedDocs.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </div>
        )}
        )}
      </List>
    </div>
    </>
  ) : null;
};

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

export default connect(mapStateToProps)(EditedDoc);