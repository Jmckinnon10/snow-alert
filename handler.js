const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./creds.json");

module.exports.handler = async () => {
  const doc = new GoogleSpreadsheet(
    "1YrsfZg1pkeyYnQapDkWQUPOU-IZpvmdapXeAz6VcZe0"
  );

  await doc.useServiceAccountAuth({
    // env var values are copied from service account credentials generated by google
    // see "Authentication" section in docs for more info
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);
};
module.exports.handler();