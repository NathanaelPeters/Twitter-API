import React, { Component } from "react";
import { connect } from "react-redux";
import { TwitterTweetEmbed } from "react-twitter-embed";
import Tweet from "react-tweet";

class UnconnectedApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "Donald Trump"
    };
  }
  componentDidMount = () => {
    setInterval(async evt => {
      let data = { searchTerm: this.state.searchTerm };
      let response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      let body = await response.text();
      let tweets = JSON.parse(body);
      this.props.dispatch({
        type: "add-tweet",
        tweets: tweets
      });
    }, 7000);
  };

  searchInput = evt => {
    this.setState({ searchTerm: evt.target.value });
  };

  hillaryButton = () => {
    this.setState({ searchTerm: "Hillary Clinton" });
  };

  render() {
    if (this.props.tweets && this.props.tweets.tweets) {
      let tweet = this.props.tweets[0];
      return (
        <div>
          <div className="forms">
            <button className="Add" onClick={this.hillaryButton}>
              Hillary Button
            </button>
            <br />
            <div className="Add">
              <div class="searchBox">
                <input
                  type="text"
                  name="search"
                  placeholder="Search.."
                  onChange={this.searchInput}
                  value={this.props.searchTerm}
                />
              </div>
            </div>
          </div>
          {Object.values(this.props.tweets.tweets).map(tweet => (
            <div className="tweet-body">
              <div className="inner-body">
                <img
                  src={tweet.user.profile_image_url}
                  alt="Logo"
                  className="picture"
                ></img>
                <div className="body">
                  <div className="inner-body">
                    <div className="name">
                      {tweet.user.name} (@{tweet.user.screen_name}) ·{" "}
                      {tweet.created_at.slice(0, 16)}
                    </div>
                  </div>
                  <div className="tweet">{tweet.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return <div> Loading... </div>;
  }
}
let mapStateToProps = state => {
  return {
    tweets: state.tweets
  };
};
let App = connect(mapStateToProps)(UnconnectedApp);
export default App;
