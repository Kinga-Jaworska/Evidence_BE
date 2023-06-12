import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL,
);

// Set the access token on the OAuth2 client
export const setAccessToken = (accessToken: string) => {
  oauth2Client.setCredentials({
    access_token: accessToken,
  });
};

// Get the authenticated Google Drive API client
export const getDriveClient = () => {
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  return drive;
};
