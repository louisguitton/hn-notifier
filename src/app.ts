// Ref: https://github.com/HackerNews/API
// Ref: https://firebase.google.com/docs/database/web/start
// Ref: https://firebase.google.com/docs/database/web/read-and-write
// Ref: https://www.twilio.com/blog/2015/04/get-notified-when-someone-posts-an-article-from-your-domain-on-hacker-news-using-node-js-firebase-and-twilio.html
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";
const axios = require("axios");
require("dotenv").config();

const DOMAIN = process.env.DOMAIN;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const DEBUG = process.env.DEBUG;

enum HackerNewsItemType {
  story,
}
interface HackerNewsItem {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: HackerNewsItemType;
  url: URL;
}

// Ref: https://discord.com/developers/docs/resources/channel#embed-object
interface DiscordEmbedObject {
  // title of embed
  title?: string;
  //	description of embed
  description?: string;
  //	url of embed
  url?: string;
  // timestamp	timestamp of embed content
  timestamp?: number;
  //	color code of the embed
  color?: number;
}

// Ref: https://discord.com/developers/docs/resources/webhook#execute-webhook
interface DiscordWebhookMessage {
  // the message contents (up to 2000 characters)
  content: string;
  // override the default username of the webhook
  username?: string;
  // override the default avatar of the webhook
  avatar_url?: string;
  // array of up to 10 embed objects	embedded rich content
  embeds?: DiscordEmbedObject[];
}

const firebaseConfig = {
  databaseURL: "https://hacker-news.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function sendMessage(story: HackerNewsItem) {
  let msg: DiscordWebhookMessage = {
    username: "hn-notifier",
    content: "hn-notifier bot found something!",
    embeds: [
      {
        title: story.title,
        description: `HN Post submitted by ${story.by} at ${new Date(
          story.time * 1000
        )}`,
        color: 15258703,
        url: `https://news.ycombinator.com/item?id=${story.id}`,
      },
    ],
  };
  axios.post(DISCORD_WEBHOOK, msg);
}

const latestStoryRef = ref(db, "v0/newstories/0");
onValue(latestStoryRef, (snapshot) => {
  const storyId: number = snapshot.val();
  console.log(storyId);

  let storyRef = ref(db, `v0/item/${storyId}`);
  onValue(storyRef, (storySnapshot) => {
    if (storySnapshot.val() === null) {
      return;
    }
    let story: HackerNewsItem = storySnapshot.val();
    console.log(story);

    let host = new URL(story.url).hostname;
    if (host === DOMAIN || DEBUG) {
      sendMessage(story);
    }

    // upvotes will trigger a new event on storyRef, so detach the listener
    // Ref: https://firebase.google.com/docs/database/web/read-and-write#detach_listeners
    off(storyRef);
  });
});
