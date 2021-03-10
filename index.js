const ytdl = require("ytdl-core");
const mongoose = require("mongoose");
const Song = require("./model/Song")
require("dotenv").config()

const getInfo = async (ytId) => {
  let info = await ytdl.getInfo(ytId);
  return info;
};

let id = process.argv[2];

getInfo(id).then((res) => {
  mongoose.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  let { song, artist } = res.videoDetails.media;
  let date = res.videoDetails.publishDate;
  let newSong = new Song({
    youtube:id,
    title: song,
    author: artist,
    genre: "indie",
    date,
  }); 

  newSong
    .save()
    .then((doc) => {
      console.log(doc);
      mongoose.connection.close();
    })
    .catch((err) => {
      console.log(err);
      mongoose.connection.close();
    });
});
