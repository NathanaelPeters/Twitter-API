let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");
let Twit = require("twit");
var bodyParser = require("body-parser");

app.use("/", express.static("build/dist"));

let config = require("./config");

let tweets = [];

reloadMagic(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static("build"));
app.use("/", express.static("public"));

app.post("/", (req, res) => {
  let searchTerm = req.body.searchTerm;
  var T = new Twit(config);
  var params = {
    q: searchTerm,
    count: 1
  };
  T.get("search/tweets", params, gotData);
  function gotData(err, data, response) {
    const tweetData = {
      id_str: data.statuses[0].id_str,
      user: {
        name: data.statuses[0].user.name,
        screen_name: data.statuses[0].user.screen_name,
        profile_image_url: data.statuses[0].user.profile_image_url
      },
      text: data.statuses[0].text,
      created_at: data.statuses[0].created_at,
      favorite_count: "" + data.statuses[0].favorite_count,
      retweet_count: "" + data.statuses[0].retweet_count,
      entities: {
        media: [],
        urls: data.statuses[0].entities.urls,
        user_mentions: [],
        hashtags: data.statuses[0].entities.hashtags,
        symbols: data.statuses[0].entities.symbols
      }
    };
    tweets.unshift(tweetData);
    tweets = tweets.filter(
      (v, i, a) =>
        a.findIndex(
          t => t.id_str === v.id_str && t.user.name === v.user.name
        ) === i
    );
    tweets = tweets.slice(0, 20);
    res.send(JSON.stringify({ tweets }));
  }
});

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
