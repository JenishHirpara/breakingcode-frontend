import {
  REGISTER_USER,
  GET_USER,
  USER_ERROR,
  LOGIN_USER,
  LOGOUT,
} from "../actions/types";

// const initialState = {
//   user: {
//     "_id": "654f6a495007d2e7b70fa0f1",
//     "name": "User",
//     "email": "test@test.com",
//     "password": "$2a$10$9J3ZdzedQ4P7Wy/uZVjOq.viypEoiKbnIg9XJwf3YS2.BqQlqchhi",
//     "role": "admin",
//     "imageUrl": "https://cdn2.iconfinder.com/data/icons/business-man-8/512/7-1024.png",
//     "date": "2023-11-11T11:49:29.986Z",
//     "__v": 0
// },
//   error: null,
//   current: {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU0ZjZhNDk1MDA3ZDJlN2I3MGZhMGYxIn0sImlhdCI6MTcwMDMyODE5NSwiZXhwIjoxNzAwNjg4MTk1fQ.VFDgKncU3U1xXyG2tYVM5JlhPR0McG9AAPnySFS_NPM",
//     "user": {
//         "_id": "654f6a495007d2e7b70fa0f1",
//         "name": "User",
//         "email": "test@test.com",
//         "password": "$2a$10$9J3ZdzedQ4P7Wy/uZVjOq.viypEoiKbnIg9XJwf3YS2.BqQlqchhi",
//         "role": "admin",
//         "imageUrl": "https://cdn2.iconfinder.com/data/icons/business-man-8/512/7-1024.png",
//         "date": "2023-11-11T11:49:29.986Z",
//         "__v": 0
//     }
// },
//   isAuthenticated: true,
// };

  const initialState = {
    user: null,
    error: null,
    current: null,
    isAuthenticated: false,
  }

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        current: action.payload.user,
      };
    case REGISTER_USER:
      console.log("token: ", action.payload)
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        current: action.payload.user,
      };
    case USER_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
        current: null,
      };
    case GET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        current: action.payload,
      };
    default:
      return { ...state };
  }
};
