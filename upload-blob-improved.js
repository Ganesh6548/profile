import { put } from '@vercel/blob';
import { createReadStream, readdirSync, statSync, existsSync } from 'fs';
import { extname, basename } from 'path';

// Token from environment variable
const token = process.env.VERCEL_BLOB_WRITE_TOKEN;

if (!token) {
  console.error('❌ Error: VERCEL_BLOB_WRITE_TOKEN environment variable is not set.');
  process.exit(1);
}

// -------------------------------------------------------
// CONFIG: Set the file(s) you want to upload here
// -------------------------------------------------------
const FILES_TO_UPLOAD = [
  // Add your file paths here, e.g.:
  // 'video.mp4',
  // 'my-resume.pdf',
];

// Auto-discover video/image files if FILES_TO_UPLOAD is empty
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

function discoverFiles() {
  const allFiles = readdirSync('.').filter(f => {
    const ext = extname(f).toLowerCase();
    return VIDEO_EXTENSIONS.includes(ext) || IMAGE_EXTENSIONS.includes(ext);
  });
  return allFiles;
}

async function uploadFile(filePath) {
  const fileName = basename(filePath);
  const fileSize = statSync(filePath).size;
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

  console.log(`\n📤 Uploading: ${fileName} (${fileSizeMB} MB)`);

  try {
    const fileStream = createReadStream(filePath);
    const blob = await put(fileName, fileStream, {
      access: 'public',
      token: token,
    });

    console.log(`✅ Success!`);
    console.log(`   URL:          ${blob.url}`);
    console.log(`   Download URL: ${blob.downloadUrl}`);
    return blob;
  } catch (err) {
    console.error(`❌ Failed to upload ${fileName}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Vercel Blob Uploader');
  console.log('========================');

  let filesToProcess = [...FILES_TO_UPLOAD];

  if (filesToProcess.length === 0) {
    console.log('🔍 No files configured. Scanning current directory for media files...');
    filesToProcess = discoverFiles();

    if (filesToProcess.length === 0) {
      console.log('⚠️  No media files found in the current directory.');
      console.log('   Place video/image files in the same folder as this script,');
      console.log('   or add file paths to the FILES_TO_UPLOAD array in the script.');
      process.exit(0);
    }

    console.log(`📁 Found ${filesToProcess.length} file(s):`);
    filesToProcess.forEach(f => console.log(`   - ${f}`));
  }

  const results = [];
  for (const file of filesToProcess) {
    if (!existsSync(file)) {
      console.error(`❌ File not found: ${file}`);
      continue;
    }
    const result = await uploadFile(file);
    if (result) results.push(result);
  }

  console.log('\n========================');
  console.log(`✅ Upload complete! ${results.length}/${filesToProcess.length} file(s) uploaded.`);

  if (results.length > 0) {
    console.log('\n📋 Public URLs of uploaded files:');
    results.forEach(b => console.log(`   ${b.url}`));
  }
}

main().catch(err => {
  console.error('💥 Unexpected error:', err);
  process.exit(1);
});
