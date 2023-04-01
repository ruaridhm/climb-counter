const writeToJson = ({ time, date, count }) => {
  const fs = require("fs");
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
