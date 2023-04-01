const formatResponse = require("./formatResponse.js");
const writeToDb = require("./writeToDb.js");

const sendRequest = async () => {
  const https = require("https");
  const url =
    "https://portal.rockgympro.com/portal/public/4755f180aa6b6eadf285e7f33e7668f0/occupancy";

  const isOpen = () => {
    const currentTime = new Date();
    const currentDay = currentTime.getDay();
    const currentHour = currentTime.getHours();

    if (currentDay === 0 || currentDay === 6) {
      // Sat or Sun
      if (currentHour >= 10 && currentHour < 20) {
        return true;
      }
    } else {
      // Weekdays
      if (currentHour >= 12 && currentHour < 22) {
        return true;
      }
    }
    return false;
  };

  if (isOpen()) {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          console.log(
            `Request sent to ${url}. Response status: ${res.statusCode}`
          );
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            resolve(data);
          });
        })
        .on("error", (err) => {
          console.error(`Error sending request to ${url}: ${err.message}`);
          reject(err);
        });
    });
  } else {
    console.log("is closed");
    return null;
  }
};

const run = async () => {
  const rawResult = await sendRequest();
  const formattedResult = formatResponse.formatResponse(rawResult);
  writeToDb.write(formattedResult);
};

// Send the first request immediately when the server starts
run();

// Send a request every 15 minutes
const interval = 15 * 60 * 1000;
setInterval(run, interval);
