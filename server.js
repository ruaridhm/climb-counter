const https = require("https");
const fs = require("fs");

// Replace with your desired URL
const url =
  "https://portal.rockgympro.com/portal/public/4755f180aa6b6eadf285e7f33e7668f0/occupancy";

// Send a GET request to the specified URL
function sendRequest() {
  const checkIfOpen = () => {
    const currentTime = new Date();
    const currentDay = currentTime.getDay();
    const currentHour = currentTime.getHours();
    if (currentDay === 0 || currentDay === 6) {
      // Sat or Sun
      if (currentHour >= 12 && currentHour < 22) {
        return true;
      }
    } else {
      // Weekdays
      if (currentHour >= 10 && currentHour < 20) {
        return true;
      }
    }
    return false;
  };
  if (checkIfOpen() === true) {
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
          formatData(data);
        });
      })
      .on("error", (err) => {
        console.error(`Error sending request to ${url}: ${err.message}`);
      });
  } else {
    return;
  }
}

// Send the first request immediately when the server starts
sendRequest();

// Check if current time is within opening hours

// Send a request every 15 minutes
const interval = 15 * 60 * 1000; // 15 minutes in milliseconds
setInterval(sendRequest, interval);

const getCurrentDate = () => {
  const now = new Date();
  return new Intl.DateTimeFormat("en-UK").format(now);
};

const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() + ":" + now.getMinutes();
};

const formatData = (str) => {
  const regex = /(.+)\n\s+'subLabel' : 'Current climber count'/;

  const match = regex.exec(str);

  if (match) {
    const lineBeforeSubLabel = match[1];

    const numb = Number(lineBeforeSubLabel.substring(13).slice(0, -1));

    const result = {
      date: getCurrentDate(),
      time: getCurrentTime(),
      count: numb,
    };

    console.log(result);

    //Log data
    const writeToJson = ({ time, date, count }) => {
      fs.readFile("resultData.json", (err, data) => {
        if (err) throw err;

        // parse the JSON data into a JavaScript object
        let myObj = JSON.parse(data);

        // add new data to the object
        if (myObj[date]) {
          console.log("date exists");
          myObj[date] = [...myObj[date], { time, count }];
        } else {
          myObj[date] = [{ time, count }];
        }

        // convert the object back to a JSON string
        let myJSON = JSON.stringify(myObj);

        // write the updated JSON string back to the file
        fs.writeFile("resultData.json", myJSON, (err) => {
          if (err) throw err;
          console.log("Data added to file");
        });
      });
    };
    writeToJson(result);

    return result;
  } else {
    console.log("No match found.");
  }
};
