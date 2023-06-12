import { getDriveClient } from './utils_CHECK';

// Upload a file to Google Drive
export const uploadFileToDrive = async (file: Buffer, fileName: string) => {
  const drive = getDriveClient();

  // Create the file metadata
  const fileMetadata = {
    name: fileName,
  };

  // Create the file content
  const media = {
    mimeType: 'application/octet-stream',
    body: file,
  };

  try {
    // Upload the file to Google Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
    });

    console.log('File uploaded:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
