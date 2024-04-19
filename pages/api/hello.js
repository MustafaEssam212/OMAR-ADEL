import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {

  // Ensure the request body contains the 'arr' property
  if (!req.body) {
   
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const jsonContent = JSON.stringify(req.body);
  const filePath = path.join(process.cwd(), 'public', 'arrayData.json');

  // Write the JSON content to the specified file path
  fs.writeFile(filePath, jsonContent, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred while writing JSON Object to File', err);
      return res.status(500).json({ error: 'Failed to save data' });
    }
    console.log('JSON file has been saved to:', filePath);
    res.status(200).json({ message: 'JSON file has been saved successfully' });
  });
}


export const config = {
  api: {
    externalResolver: true,
  },
}