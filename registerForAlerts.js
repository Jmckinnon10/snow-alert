const AWS = require("aws-sdk");
const dynamoSnowAlert = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
});

module.exports.handler = async (event) => {
  const input = JSON.parse(event.body);
  console.log(event);
  try {
    const params = {
      TableName: "SnowAlertDB",
      Item: {
        userId: input.userId,
        name: input.name,
        number: input.number,
        zipcode: input.zipcode,
      },
    };
    // This Lambda signs users up for weather alerts
    await dynamoSnowAlert.put(params).promise();
    // return success message
    return {
      statusCode: 200,
      body: "Row Added Successfully",
    };
  } catch (error) {
    // return error message
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
};
