import { createStore } from "redux";

let reducer = (state, action) => {
  if (action.type === "add-tweet") {
    return {
      ...state,
      tweets: action.tweets
    };
  }
  console.log(state.tweets);
  return state;
};
const store = createStore(
  reducer,
  {
    tweets: []
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
