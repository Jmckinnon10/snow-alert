const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./creds.json");
const customCreds = require("./customCreds.json");

module.exports.handler = async (event) => {
  const input = JSON.parse(event.body);
  console.log(event);
  try {
    // This Lambda signs users up for weather alets
    const doc = new GoogleSpreadsheet(customCreds.googleSheetID);

    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    }); // loads document properties and worksheets
    await doc.loadInfo();
    const firstSheet = doc.sheetsByIndex[0];

    await firstSheet.addRow({
      name: input.name,
      number: input.number,
      zipcode: input.zipcode,
    });
    // Return a success message
    return {
      statusCode: 200,
      body: "Row added successfully",
    };
  } catch (error) {
    // Return an error message
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
};
