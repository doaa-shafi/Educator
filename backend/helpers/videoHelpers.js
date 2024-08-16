const axios = require("axios");
const { ValidationError } = require("./errors");

const BrowserUrlRegex = new RegExp(
  /^(http(s)?:\/\/)?((w){3}.)?youtube\.com\/watch\?v=/
);
const ShareUrlRegex = new RegExp(/^(http(s)?:\/\/)?((w){3}.)?youtu\.be\//);

const VideoURLType = {
  BROWSER: 1,
  SHARE: 2,
};

const isValidVideoLink = (videoLink) => {
  return BrowserUrlRegex.test(videoLink) || ShareUrlRegex.test(videoLink);
};

const getVideoURLType = (videoLink) => {
  if (BrowserUrlRegex.test(videoLink)) {
    return VideoURLType.BROWSER;
  } else if (ShareUrlRegex.test(videoLink)) {
    return VideoURLType.SHARE;
  } else {
    throw new ValidationError("Invalid video link");
  }
};

const getVideoId = (videoLink) => {
  if (!isValidVideoLink(videoLink)) {
    throw new ValidationError("Invalid video link");
  }

  const videoURLType = getVideoURLType(videoLink);

  let videoId = "";
  if (videoURLType === VideoURLType.BROWSER) {
    videoId = videoLink.split("v=")[1];
    const ampersandPosition = videoId.indexOf("&");
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
  } else if (videoURLType === VideoURLType.SHARE) {
    videoId = videoLink.split(".be/")[1];
  }
  return videoId;
};

const getVideoEmbedUrl = (videoLink) => {
  const videoId = getVideoId(videoLink);
  return `https://www.youtube.com/embed/${videoId}`;
};

const getVideoThumbnailUrl = (videoLink) => {
  try {
    const videoId = getVideoId(videoLink);
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  } catch {
    return "https://www.messagetech.com/wp-content/themes/ml_mti/images/no-image.jpg";
  }
};

const getVideoDuration = async (link) => {
  try {
    const videoId = getVideoId(link);
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          key: process.env.youtube_api_key,
          part: "contentDetails",
          id: videoId,
        },
      }
    );
    const durationString = response.data.items[0].contentDetails.duration;
    const duration = { hours: 0, minutes: 0, seconds: 0 };
    const durationParts = durationString
      .replace("PT", "")
      .replace("H", ":")
      .replace("M", ":")
      .replace("S", "")
      .split(":");

    if (durationParts.length === 3) {
      duration["hours"] = parseInt(durationParts[0]);
      duration["minutes"] = parseInt(durationParts[1]);
      duration["seconds"] = parseInt(durationParts[2]);
    }

    if (durationParts.length === 2) {
      duration["minutes"] = parseInt(durationParts[0]);
      duration["seconds"] = parseInt(durationParts[1]);
    }

    if (durationParts.length === 1) {
      duration["seconds"] = parseInt(durationParts[0]);
    }

    const durationRes = {
      ...duration,
      string: `${duration.hours}hr ${duration.minutes}min ${duration.seconds}sec`,
    };
    const totalMins = durationRes.hours * 60 + durationRes.minutes;
    return { ...durationRes, totalMins: totalMins };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  isValidVideoLink,
  getVideoThumbnailUrl,
  getVideoEmbedUrl,
  getVideoDuration,
};
