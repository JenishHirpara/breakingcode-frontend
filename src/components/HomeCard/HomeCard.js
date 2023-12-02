import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap", // Allow items to wrap to the next row
    justifyContent: "",
    backgroundColor: "#fff",
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
  },
  card: {
    width: "22.5%",
    margin: theme.spacing(2),
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0px 0px 20px rgba(25, 99, 71, 0.3)", // Add a playful shadow on hover
    },
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)", // Gradient background for a funky look
    borderRadius: "15px", // Rounded corners
    overflow: "hidden", // Hide overflow content
  },
  cardContent: {
    textAlign: "center",
    backgroundColor: "#fff",
    padding: theme.spacing(2),
    borderRadius: "0 0 15px 15px", // Rounded corners only at the bottom
  },
  techName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "black", // White text color
  },
  authorName: {
    fontSize: "0.9rem",
    color: "#0e0e0e", // Lighter text color
  },
}));

const HomeCard = (props) => {
  const classes = useStyles();

  const documentClickHandler = (id) => {
    props.history.push("/" + id);
  };

  return (
    <div className={classes.root}>
      {props.docs.map((doc, index) => (
        <Card className={classes.card} key={index}>
          <CardActionArea onClick={() => documentClickHandler(doc._id)}>
            <img
              src={doc.imageUrl}
              alt={doc.title}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <CardContent className={classes.cardContent}>
              <Typography
                variant="h6"
                className={`${classes.techName} techName`}
              >
                {doc.title}
              </Typography>
              <Typography
                variant="body2"
                className={`${classes.authorName} authorName`}
              >
                by: {doc.author.name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </div>
  );
};

export default withRouter(HomeCard);
