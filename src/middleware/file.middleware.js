const { GraphQLError } = require('graphql');
const path = require('path');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const validateFile = async (file) => {
  if (!file) {
    throw new GraphQLError('No file uploaded');
  }

  const { filename, mimetype, createReadStream } = await file;

  // Validate file type
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    throw new GraphQLError('Invalid file type. Allowed types: PDF, JPEG, PNG, GIF, DOC, DOCX');
  }

  // Validate file extension
  const ext = path.extname(filename).toLowerCase();
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx'];
  if (!allowedExtensions.includes(ext)) {
    throw new GraphQLError('Invalid file extension');
  }

  // Get file size
  const stream = createReadStream();
  let size = 0;
  await new Promise((resolve, reject) => {
    stream.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_FILE_SIZE) {
        reject(new GraphQLError('File size exceeds 5MB limit'));
      }
    });
    stream.on('end', resolve);
    stream.on('error', reject);
  });

  return true;
};

module.exports = validateFile; 