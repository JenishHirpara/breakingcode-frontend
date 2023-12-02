import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import setAuthToken from "../../utils/setAuthToken";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
  Divider,
  Paper,
  Modal,
  Backdrop,
  Fade,
  Fab,
} from "@material-ui/core";
import CardActionArea from "@material-ui/core/CardActionArea";
import {fetchAllDocs} from "../../actions/newDocs";
import YouTubeIcon from '@material-ui/icons/YouTube';
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import EditIcon from "@material-ui/icons/Edit";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Player } from "video-react";
import Navbar from "../layout/Navbar";
import RichTextEditor from "react-rte";
import { Button as CommentButton } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Comment from "./Comment";
// import { set } from "mongoose";
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  backdrop: {
    backgroundImage: (props) => `url(${props.imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    marginBottom: theme.spacing(4),
    filter: "brightness(70%)", 
  },
  fadedBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: "7rem", 
    color: "#fff !important",  
    fontWeight: "bold",
    textAlign: "center", 
    marginTop: theme.spacing(2), 
    zIndex: 1, 
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-start",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  videoContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  docContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  commentSection: {
    // marginTop: theme.spacing(4),
  },
  commentButton: {
    marginLeft: theme.spacing(2),
  },
  card: {
    marginBottom: theme.spacing(2),
  },
  cardContent: {
    fontSize: "18px",
  },
  editButton: {
    color: theme.palette.secondary.main,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  viewAllDocsButton:{
    marginLeft: "auto",
  }
}));

const Doc = (props) => {
  const [editedText, setEditedText] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [open, setOpen] = useState(null);
  const [writeComment, setWriteComment] = useState("");
  const [comments, setComments] = useState(null);
  const [value, setValue] = useState(RichTextEditor.createEmptyValue());
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [showPopup, setShowPopup] = useState(true); // State to control the display of the popup
  const classes = useStyles({ imageUrl: selectedDoc?.imageUrl });
  const [loading, setLoading] = useState(true);
  const theme = useTheme()

  const onChange = (value) => {
    setValue(value);
    setWriteComment(value.toString("html").replace(/(<([^>]+)>)/gi, ""));
  };


  const onCommentHandler = async () => {
    const data = {
      on: props.match.params.id,
      text: writeComment,
    };
    const response = await axios.post("https://breakingcode.onrender.com/api/comments/", data);
    let dup = [...comments];
    let responseData = { ...response.data };
    responseData.by = {
      _id: response.data.by,
      name: props.user.name,
      imageUrl:
        props.user.imageUrl ||
        "https://lh3.googleusercontent.com/proxy/QvI0kNCaa4tn2rlyOyUKb_XBD95TdQLOXBu7Z__6YroXkdilb-J2X_Sw0Dw3_k7k0-eXkngOKLhK3qJseD-j7AqLjx628Pw",
    };
    dup.unshift(responseData);
    setComments(dup);
    setValue(RichTextEditor.createEmptyValue());
  };

  useEffect(() => {
    apiFetch();
    const popupTimeout = setTimeout(() => {
      setShowPopup(false);
    }, 10000);
    props.onFetchAllDocs();

    // Clear the timeout when the component unmounts
    return () => clearTimeout(popupTimeout);
  }, []);

  const apiFetch = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
    const response = await axios.get("https://breakingcode.onrender.com/api/newdocs/" + props.match.params.id);
    const response1 = await axios.get("https://breakingcode.onrender.com/api/comments/" + props.match.params.id);
    setComments(response1.data);
    const { data } = response;
    setSelectedDoc(data);
    let dup = [];
    for (let i = 0; i < data.doc.length; i++) {
      dup.push(false);
    }
    setOpen(dup);
    setLoading(false);
  };

  const openHandler = (index, docText) => {
    let dup = [...open];
    dup[index] = true;
    setOpen(dup);
    setEditedText(docText);
  };

  const closeHandler = (index) => {
    let dup = [...open];
    dup[index] = false;
    setOpen(dup);
  };

  const typingHandler = (event) => {
    setEditedText(event.target.value);
  };

  const editHandler = async (index) => {
    if(editedText === "") return alert("Please enter some text");
    if (props.user.role === "admin" && props.user._id === selectedDoc.author) {
      let dupObject = { ...selectedDoc };
      let dupArray = [...dupObject.doc];
      dupArray[index].text = editedText;
      const id = selectedDoc.doc[index]._id;
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
      const data = {
        data: {
          _id: id,
          text: editedText,
        },
      };
      const response = await axios.post(
        "https://breakingcode.onrender.com/api/newdocs/update/" + selectedDoc._id,
        data
      );
      alert("Document Section updated!");
      console.log(response);
      setSelectedDoc(dupObject);
      closeHandler(index);
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
      const data = {
        _id: selectedDoc.doc[index]._id,
        model: selectedDoc._id,
        text: editedText,
        author: selectedDoc.author,
      };
      await axios.post("https://breakingcode.onrender.com/api/editedDocs/", data);
      alert("Request for update sent!");
      closeHandler(index);
    }
  };

  const handleOpenVideoModal = () => {
    setOpenVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setOpenVideoModal(false);
  };

  const documentClickHandler = (id) => {
    props.history.push("/" + id);
    //reload the page
    window.location.reload();
  };

   return loading  ? (
    // Display loader while data is being fetched
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <CircularProgress />
      {/* <Typography variant="h6" style={{ marginTop: "10px" }}>
        Loading...
      </Typography> */}
    </div>

   ) : (
     selectedDoc !== null && open !== null ? (
      <React.Fragment>
      <Navbar />
      <div className={classes.root}>
        <Paper className={classes.backdrop}>
          <div className={classes.fadedBackdrop}></div>
          <Typography variant="h3" className={classes.title}>
            {selectedDoc.title}
          </Typography>
        </Paper>
        <Grid item xs={12} className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.history.push({ pathname: "/editedDoc", selectedDoc })}
          >
            {props.user.role === "admin" ? "User Edited Docs" : "Your Edited Docs"}
          </Button>
          <Button
              variant="contained"
              color="primary"
              onClick={() => props.history.push("/home")}
              className={classes.viewAllDocsButton}
            >
              View all docs
            </Button>
        </Grid>
        <Grid container spacing={3}>
          {selectedDoc.doc.map((doc, index) => (
            <Grid item xs={12} key={doc._id}>
              {open[index] ? (
                <div>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={editedText}
                    onChange={(event) => typingHandler(event)}
                  />
                  <div className={classes.buttonGroup}>
                    <IconButton onClick={() => editHandler(index)} className={classes.editButton}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton onClick={() => closeHandler(index)} color="secondary">
                      <ClearIcon />
                    </IconButton>
                  </div>
                </div>
              ) : (
                <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.cardContent}>
                      {doc.text}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <div>
                      <Button
                        size="small"
                        color="primary"
                        variant="outlined"  // Add this line for an outlined button
                        style={{
                          border: "2px solid #fff",  // Add a border
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",  // Add a box shadow
                          borderRadius: "8px",  // Add border-radius for a rounded look
                        }}
                        onClick={() => openHandler(index, doc.text)}
                      >
                        Edit this info.
                        <EditIcon />
                      </Button>
                    </div>
                  </CardActions>
                </Card>
              )}
            </Grid>
          ))}

<Grid item xs={10} className={classes.commentSection}>
            <div>
              <div class="row">
                <div class="col-sm-12">
                  <div class="page-header">
                    <Typography variant="h4" className="reviews">
                      Leave your comment
                    </Typography>
                  </div>
                  <div style={{ marginTop: "30px" }}>
                    <RichTextEditor value={value} onChange={onChange} />
                    <CommentButton
                      content="Add Reply"
                      labelPosition="left"
                      icon="edit"
                      primary
                      onClick={() => onCommentHandler()}
                      className={classes.commentButton}
                    />
                  </div>
                  <Divider style={{ margin: "20px 0" }} />
                  <div class="comment-tabs">
                    <ul class="nav nav-tabs" role="tablist">
                      <li class="active">
                        <a href="#comments-logout" role="tab" data-toggle="tab">
                          <Typography variant="h5" className="reviews text-capitalize">
                            Comments
                          </Typography>
                        </a>
                      </li>
                    </ul>
                    <div class="tab-content">
                      <div class="tab-pane active" id="comments-logout">
                        <ul class="media-list">
                          {comments?.map((comment) => (
                            <Comment comment={comment} />
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>

          {/* Recommended Docs  */}
          <Grid item xs={2} className={classes.docContainer}>
            {props?.docs
              ?.filter((doc) => doc._id !== selectedDoc._id)
              ?.slice(0, 4)
              .map((doc, index) => (
                <Card key={doc.imageUrl} className={classes.card}>
                  <CardActionArea onClick={() => documentClickHandler(doc._id)}>
                    <img
                      src={doc.imageUrl}
                      alt={doc.title}
                      style={{ width: "100%", height: "100px", objectFit: "cover" }}
                    />
                    <CardContent className={classes.cardContent}>
                            <Typography
                        variant="h6"
                        className={`${classes.techName} techName`}
                      >
                        {doc.title}
                      </Typography>
                      <Typography variant="body2" className={`${classes.authorName} authorName`}>
                        by: {doc.author.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
          </Grid>
        </Grid>
      </div>

      {/* Video Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openVideoModal}
        onClose={handleCloseVideoModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openVideoModal}>
          <div className={classes.modalPaper}>
            <Player
              fluid={false}
              width={800}
              height={450}
            >
              <source src={selectedDoc.url} />
            </Player>
          </div>
        </Fade>
      </Modal>

      {/* Display the popup text for the first 10 seconds */}
      {showPopup && (
        <div style={{
          position: "fixed",
          bottom: "100px",
          right: "30px",
          zIndex: 1,
          border: "2px solid #ffffff",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "10px",
          borderRadius: "5px",
        }}>
          <Typography variant="body1" style={{ color: "#ffffff", fontFamily: "Arial, sans-serif" }}>
            Our Tutorial for the same!
          </Typography>
        </div>
      )}

      {selectedDoc.url && (
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: "fixed", bottom: "30px", right: "30px", width: "60px", height: "60px" }}
          onClick={handleOpenVideoModal}
        >
          {/* large size icon */}
          <YouTubeIcon style={{ fontSize: "35px" }} />
        </Fab>
      )}

    </React.Fragment>
     ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Typography variant="h6" style={{ marginTop: "10px" }}>
            No data found
          </Typography>
        </div>
     )
   )
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  docs: state.docs.docs,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchAllDocs: () => dispatch(fetchAllDocs()),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Doc);
