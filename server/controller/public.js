const axios = require("axios");
require("dotenv").config();

const getFileSizeMb = async (url) => {
  try {
    const response = await axios.head(url, {
      validateStatus: () => true,
      timeout: 15000,
    });

    const sizeBytes = Number(
      response.headers["content-length"] || response.headers["Content-Length"] || 0
    );

    if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
      return "0.0";
    }

    return (sizeBytes / (1024 * 1024)).toFixed(1);
  } catch (error) {
    console.warn(`Unable to resolve file size for ${url}:`, error.message);
    return "0.0";
  }
};

exports.startApi = (req, res, next) => {
  res.status(200).json({ message: "Welcome To Vidown Api" });
};

exports.postYoutube = (req, res, next) => {
  const ytUrl = req.body.urls;
  let videoId = ytUrl.replace("https://www.youtube.com/watch?v=", "");
  videoId = videoId.replace("https://www.youtube.com/shorts/", "");
  videoId = videoId.replace("https://youtu.be/", "");
  videoId = videoId.replace("https://youtube.com/shorts/", "");
  videoId = videoId.replace("https://www.youtube.com/live/", "");
  videoId = videoId.slice(0, 11);

  const options = {
    method: "GET",
    url: "https://yt-api.p.rapidapi.com/dl",
    params: { id: videoId },
    headers: {
      "X-RapidAPI-Key": process.env.YT_API_KEY,
      "X-RapidAPI-Host": "yt-api.p.rapidapi.com",
    },
  };

  try {
    axios
      .request(options)
      .then((response) => {
        const result = response.data;
        if (result.thumbnail) {
          let dataList = result.formats.map((obj) => {
            return {
              url: obj.url,
              quality: obj.qualityLabel,
              size: (
                (obj.bitrate * (+obj.approxDurationMs / 1000)) /
                (8 * 1024 * 1024)
              ).toFixed(1),
            };
          });

          res.status(200).json({
            thumb: result["thumbnail"][2].url,
            urls: dataList,
            title: result["title"],
          });

          req.users
            .addActivity({ yturl: ytUrl })
            .then((result) => {
              // console.log(result);
            })
            .catch((err) => {
              const error = new Error(err);
              error.httpStatusCode = 500;
              return next(error);
            });
        } else {
          res.status(403).json({
            status: "fail",
            error:
              "Sorry, we couldn't locate the video you're looking for. It's possible that the video is set to private or has been removed.",
            code: 403,
          });
        }
      })
      .catch((error) => {
        res.status(403).json({
          status: "fail",
          error:
            "Sorry, we couldn't locate the video you're looking for. It's possible that the video is set to private or has been removed.",
          code: 403,
        });
        const err = new Error(error);
        err.httpStatusCode = 403;
        return next(err);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error: "An unexpected error occurred. Please try again later.",
      code: 500,
    });
    const err = new Error(error);
    err.httpStatusCode = 500;
    return next(err);
  }
};

exports.postTwitter = async (req, res, next) => {
  const twUrl = req.body.urls;

  const options = {
    method: "POST",
    url: "https://twitter65.p.rapidapi.com/api/twitter/links",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.TW_API_KEY,
      "X-RapidAPI-Host": "twitter65.p.rapidapi.com",
    },
    data: {
      url: twUrl,
    },
  };

  try {
    axios
      .request(options)
      .then(async (response) => {
        const data = response.data;
        const dataUrl = data[0]?.urls || [];

        if (!dataUrl.length) {
          return res.status(403).json({
            status: "fail",
            error:
              "Sorry, we couldn't locate the video you're looking for. It's possible that the video is set to private or has been removed.",
            code: 403,
          });
        }

        const dataList = await Promise.all(
          dataUrl.map(async (item) => ({
            url: item.url,
            quality: `${item.subName}P`,
            size: await getFileSizeMb(item.url),
          }))
        );

        res.status(200).json({
          thumb: data[0]["pictureUrl"],
          urls: dataList,
          title: data[0]["meta"]["title"],
        });

        req.users
          .addActivity({ twUrl: twUrl })
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
      })
      .catch((err) => {
        res.status(403).json({
          status: "fail",
          error:
            "Sorry, we couldn't locate the video you're looking for. It's possible that the video is set to private or has been removed.",
          code: 403,
        });

        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error: "An unexpected error occurred. Please try again later.",
      code: 500,
    });
    const err = new Error(error);
    err.httpStatusCode = 500;
    return next(err);
  }
};

exports.postFb = (req, res, next) => {
  const fbUrl = req.body.urls;

  const options = {
    method: "GET",
    url: "https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php",
    params: {
      url: fbUrl,
    },
    headers: {
      "x-rapidapi-key": process.env.FB_API_KEY,
      "x-rapidapi-host": "facebook-reel-and-video-downloader.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(async (response) => {
      const dataList = response.data;
      const format = dataList.links;

      if (dataList.error === true) {
        return res.status(403).json({
          status: "fail",
          error:
            "Sorry, we couldn't locate the video you're looking for. It's possible that the video is set to private or has been removed.",
          code: 403,
        });
      }

      const formatEntries = Object.entries(format || {});
      const urls = await Promise.all(
        formatEntries.map(async ([key, url]) => ({
          url,
          quality: key.toUpperCase(),
          size: await getFileSizeMb(url),
        }))
      );

      res.status(200).json({
        thumb: dataList["thumbnail"],
        urls,
        title: dataList?.["description"] || "Your Facebook Videos",
      });
      return req.users.addActivity({ fbUrl: fbUrl });
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.otherPost = (req, res, next) => {
  const igUrl = req.body.urls;

  const encodedParams = new URLSearchParams();
  encodedParams.set("url", igUrl);

  const options = {
    method: "POST",
    url: "https://snap-video3.p.rapidapi.com/download",
    headers: {
      "x-rapidapi-key": process.env.IG_API_KEY,
      "x-rapidapi-host": "snap-video3.p.rapidapi.com",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: encodedParams,
  };

  axios
    .request(options)
    .then(async (response) => {
      const formats = response.data;
      const videData = formats.medias || [];

      if (formats.error === true) {
        return res.status(403).json({
          status: "fail",
          error:
            "Sorry, we couldn't locate the video you're looking for. It's possible that the video is set to private or has been removed.",
          code: 403,
        });
      }

      const urls = await Promise.all(
        videData.map(async (data) => ({
          url: data.url,
          quality: data.quality?.length > 1 ? data.quality.toUpperCase() : "720P",
          size: await getFileSizeMb(data.url),
        }))
      );

      res.status(200).json({
        thumb: formats.thumbnail,
        urls,
        title: formats.title || "Your IG Videos",
      });
      return req.users.addActivity({ igUrl: igUrl });
    })
    .then((result) => {
      console.log("OK");
    })
    .catch((err) => {
      console.log(err);
      res.status(403).json({
        status: "fail",
        error:
          "Sorry, we couldn't locate the video you're looking for. It's possible that the video is set to private or has been removed.",
        code: 403,
      });

      const error = new Error(err);
      error.httpStatusCode = 403;
      return next(error);
    });
};
