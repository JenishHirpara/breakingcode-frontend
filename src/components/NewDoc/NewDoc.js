import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Fab,
  Icon,
  LinearProgress,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { addNewDoc } from "../../actions/newDocs";
import firebase from "./firebase";
import { Player } from "video-react";
import Navbar from "../layout/Navbar";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  submit2: {
    margin: "auto",
  },
  addButton: {
    float: "right",
  },
  videoButton: {
    marginTop: "10px",
  },
  videoContainer: {
    height: "auto",
    width: "100%",
    margin: "20px 0", 
  },
  progressBar: {
    marginTop: "20px",
  },
}));

const NewDoc = (props) => {
  const classes = useStyles();
  const [number, setNumber] = useState([Math.random()]);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState([{ text: "" }]);
  const [files, setFiles] = useState();
  const [url, setUrl] = useState();
  const [tempurl, setTempUrl] = useState();
  const [patience, setPatience] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (url) {
      props.onAddNewDoc(title, content, imageUrl, url);
      // props.history.push("/home");
      window.location.href = "/home";
    }
  }, [url]);

  const addButtonHandler = (event) => {
    event.preventDefault();
    const dup = [...number];
    const contentdup = [...content];
    dup.push(Math.random());
    contentdup.push({ text: "" });
    setNumber(dup);
    setContent(contentdup);
  };

  const titleChangedHandler = (event) => {
    setTitle(event.target.value);
  };

  const imageUrlChangedHandler = (event) => {
    setImageUrl(event.target.value);
  };

  const contentChangedHandler = (event, i) => {
    const dup = [...content];
    dup[i].text = event.target.value;
    setContent(dup);
  };

  const submitFormHandler = (e) => {
    e.preventDefault();
    setUrl(tempurl);
    setPatience(false);
  };

  const handleChange = (file) => {
    setFiles(file);
  };

  const showImage = async () => {
    if (!files) {
      alert("Please select a video file");
      return;
    }

    var file = files[0];
    var storageRef = firebase.storage().ref('videos/' + file.name);

    var uploadTask = storageRef.put(file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Track the upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        console.log(progress);
      },
      (error) => {
        console.log(error);
      },
      async () => {
        // Get the uploaded video url back
        const url = await uploadTask.snapshot.ref.getDownloadURL();
        setTempUrl(url);
      }
    );

    setPatience(true);
  };

  return (
    <>
    <Navbar />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create documentation for <span className="">{title}</span>
        </Typography>

        <form className={classes.form} onSubmit={submitFormHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="Title"
                variant="outlined"
                required
                fullWidth
                label="Title"
                autoFocus
                onChange={(event) => titleChangedHandler(event)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Image URL"
                onChange={(event) => imageUrlChangedHandler(event)}
              />
            </Grid>

            <Grid item xs={12}>
              {number.map((el, i) => (
                <TextField
                  key={el + `${i}`}
                  label="Content"
                  multiline
                  rows={3}
                  fullWidth
                  defaultValue=""
                  onChange={(event) => contentChangedHandler(event, i)}
                />
              ))}
            </Grid>
            <Grid item xs={10}></Grid>
            <Grid item xs={2}>
              <Fab
                color="primary"
                aria-label="add"
                className={classes.addButton}
                onClick={(event) => addButtonHandler(event)}
              >
                <AddIcon />
              </Fab>
            </Grid>
          </Grid>

          {uploadProgress===0 && <div className="">
            <div className="file-field input-field">
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit2}
                >
                  Add Video
                </Button>
              </span>
              <span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleChange(e.target.files)}
                />
              </span>

              {files && <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>}
            </div>
          </div>}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              className={classes.progressBar}
            />
            <Typography variant="body2" color="textSecondary">
              {Math.round(uploadProgress)}% Complete
            </Typography>
          </div>
          )}

          {files && uploadProgress===0 && <Button
            variant="contained"
            color="primary"
            className={classes.videoButton}
            onClick={showImage}
            endIcon={<Icon>video</Icon>}
          >
            Upload Video 
          </Button>}

          {tempurl && (
            <div className={classes.videoContainer}>
              <Player>
                <source src={tempurl} />
              </Player>
            </div>
          )}

          {/* remove video button */}
          {tempurl && (
            <Button
              variant="contained"
              color="primary"
              className={classes.videoButton}
              onClick={() => {
                setTempUrl("");
                setFiles(null);
                setUploadProgress(0);
              }}
              endIcon={<Icon>delete</Icon>}
            >
              Remove Video
            </Button>
          )}

          {/* {tempurl && ( */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={tempurl ? false : true}
            >
              Submit Document
            </Button>
          {/* )} */}
        </form>
      </div>
      <Box mt={5}></Box>
    </Container>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddNewDoc: (title, content, imageUrl, url) =>
      dispatch(addNewDoc(title, content, imageUrl, url)),
  };
};

export default connect(null, mapDispatchToProps)(NewDoc);
