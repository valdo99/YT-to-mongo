const ytdl = require("ytdl-core");
const mongoose = require("mongoose");
const Song = require("./model/Song")
require("dotenv").config();

const getInfo = async (ytId) => {
  let info = await ytdl.getInfo(ytId);

  return info.videoDetails.media.artist
    ? [0, info.videoDetails.media,info.videoDetails.publishDate]
    : [1, info.videoDetails,info.videoDetails.publishDate];
};

let id = process.argv[2];

getInfo(id).then(([type, info,date]) => {
  mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let song;
  let artist;
  if (type == 0) {
    song=info.song
    artist=info.artist
  } else {
    song = info.title;
    artist = info.author.name;
  }
  let newSong = new Song({
    youtube: id,
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

