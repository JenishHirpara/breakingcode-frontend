import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Avatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  commentContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  commentText: {
    flex: 1,
  },
  username: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
  timestamp: {
    color: theme.palette.text.secondary,
    fontSize: '0.8rem',
  },
}));

const Comment = ({ comment }) => {
  const classes = useStyles();

  const calculateTimeSince = (date) => {
    const currentDate = new Date();
    const commentDate = new Date(date);
    const timeDifference = currentDate - commentDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className={classes.commentContainer}>
      <Avatar
        className={classes.avatar}
        src={comment.by ? comment.by.imageUrl : "https://lh3.googleusercontent.com/proxy/QvI0kNCaa4tn2rlyOyUKb_XBD95TdQLOXBu7Z__6YroXkdilb-J2X_Sw0Dw3_k7k0-eXkngOKLhK3qJseD-j7AqLjx628Pw"}
        alt="profile"
      />
      <div className={classes.commentText}>
        <Typography variant="body1" className={classes.username}>
          {comment.by ? comment.by.name : "admin"}
        </Typography>
        <Typography variant="body1" className="media-comment">
          {comment.text}
        </Typography>
        <Typography variant="body2" className={classes.timestamp}>
          {calculateTimeSince(comment.date)}
        </Typography>
      </div>
    </div>
  );
};

export default Comment;
