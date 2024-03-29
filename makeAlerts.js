const AWS = require("aws-sdk");
const dynamoSnowAlert = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
});
const axios = require("axios");
const customCreds = require("./customCreds.json");
const client = require("twilio")(
  customCreds.twilioSID,
  customCreds.twilioToken
);
// wake up
// reference the database and fetch all numbers in the database
// fetch weather api using zip code from database
// send SMS text from Twilio if snow % > 0
const getAllRecipientsFromDB = async () => {
  /* 
  START
  reference the database and fetch all numbers in the database
  */
  const params = {
    TableName: "SnowAlertDB",
  };

  try {
    const result = await dynamoSnowAlert.scan(params).promise();
    const recipients = result.Items.map((item) => ({
      userId: item.userId,
      name: item.name,
      number: item.number,
      zipcode: item.zipcode,
    }));
    console.log(recipients);
    return recipients;
  } catch (error) {
    console.error(error);
    throw error;
  }
  /* 
  STOP
  reference the database and fetch all numbers in the database
  */
};

const getWeather = async (recipients) => {
  const result = [];
  let weatherResponse;
  for (const person of recipients) {
    weatherResponse = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=e9d32b93bb95433d9cd232000231802&q=${person.zipcode}&days=1`
    );
    const snowChance =
      weatherResponse.data.forecast.forecastday[0].day.daily_chance_of_snow;
    const cityName = weatherResponse.data.location.name;
    const tempHigh = weatherResponse.data.forecast.forecastday[0].day.maxtemp_f;
    const weatherCondition =
      weatherResponse.data.forecast.forecastday[0].day.condition.text;
    const snowAmount =
      weatherResponse.data.forecast.forecastday[0].day.maxtemp_f;

    const updatedPerson = {
      ...person,
      snowChance,
      snowAmount,
      cityName,
      tempHigh,
      weatherCondition,
    };
    console.log(updatedPerson);
    result.push(updatedPerson);
    // console.log(result);
  }
  return result;
};

const sendWeatherReport = (recipients) => {
  console.log(recipients);
  const date = new Date();
  date.setUTCHours(23, 40, 0);
  const timeString = date.toLocaleTimeString("en-US", {
    timeZone: "America/Denver",
    hour12: false,
  });
  const time = "";
  recipients.forEach((person) => {
    if (person.snowChance !== 0) {
      const snowMessage = `Get your gear ready! There is a ${person.snowChance}% chance of snow today that could accumulate to ${person.snowAmount} cm in ${person.cityName}.`;
      client.messages
        .create({
          body: snowMessage,
          to: "+16176945102",
          from: "+18443292805",
        })
        .then((message) => console.log(message.sid));
    }
    if (person.snowChance == 0) {
      const weatherMessage = `There is a ${person.snowChance}% chance of snow today in ${person.cityName}. The high temperature is ${person.tempHigh} degrees Fahrenheit and the weather condition is ${person.weatherCondition}.`;
      client.messages
        .create({
          body: weatherMessage,
          to: "+16176945102",
          from: "+18443292805",
        })
        .then((message) => console.log(message.sid));
    }
  });
};

module.exports.handler = async () => {
  const recipientsData = await getAllRecipientsFromDB();
  const weatherData = await getWeather(recipientsData);
  sendWeatherReport(weatherData);
};
