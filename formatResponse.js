const formatResponse = (response) => {
  const regex = /(.+)\n\s+'subLabel' : 'Current climber count'/;
  const match = regex.exec(response);

  if (match) {
    const lineBeforeSubLabel = match[1];

    const count = Number(lineBeforeSubLabel.substring(13).slice(0, -1));

    const result = {
      date: getCurrentDate(),
      time: getCurrentTime(),
      count: count,
    };

    return result;
  } else {
    console.error("No match of regexp found.");
  }
};

const getCurrentDate = () => {
  const now = new Date();
  return new Intl.DateTimeFormat("en-UK").format(now);
};

const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() + ":" + now.getMinutes();
};

module.exports = { formatResponse };
