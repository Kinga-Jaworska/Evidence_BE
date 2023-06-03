const fs = require('fs');
const { google } = require('googleapis');

const GOOGLE_API_FOLDER_ID = '1vTbCvjSk2oMjCDCDrxdVFUCB2UOMlQYJ';

async function uploadCSVFile() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './google-api-key.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const driveService = google.drive({
      version: 'v3',
      auth,
    });

    const fileMetaData = {
      name: 'Kwiecien-evidence.csv',
      parents: [GOOGLE_API_FOLDER_ID],
    };

    const media = {
      mimeType: 'text/csv',
      fileExtension: '.csv',
      body: fs.createReadStream('./Kwiecien-evidence.csv'),
    };

    const response = await driveService.files.create({
      resource: fileMetaData,
      media: media,
      fields: 'id',
    });

    return response.data.id;
  } catch (error) {
    console.log(error);
  }
}

uploadFile().then((data) => {
  console.log(data);
});
