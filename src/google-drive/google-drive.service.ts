import { Injectable } from '@nestjs/common';
import { join } from 'path';
const { google } = require('googleapis');
const fs = require('fs');
const GOOGLE_API_FOLDER_ID = '1vTbCvjSk2oMjCDCDrxdVFUCB2UOMlQYJ';

@Injectable()
export class GoogleDriveService {
  async uploadCompanyCSVFile(fileName: string) {
    const file = join(process.cwd(), fileName);
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
        name: fileName,
        parents: [GOOGLE_API_FOLDER_ID],
      };

      const media = {
        mimeType: 'text/csv',
        fileExtension: '.csv',
        body: fs.createReadStream(file),
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

  async uploadUserCSVFile(
    fileName: string,
    accessToken: string,
  ): Promise<string> {
    const file = join(process.cwd(), fileName);

    try {
      const auth = new google.auth.OAuth2({
        keyFile: './google-api-key.json',
        scopes: ['https://www.googleapis.com/auth/drive'],
      });

      auth.setCredentials({ access_token: accessToken });

      const driveService = google.drive({
        version: 'v3',
        auth,
      });

      const fileMetaData = {
        name: fileName,
      };

      const media = {
        mimeType: 'text/csv',
        body: file,
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
}
