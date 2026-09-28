import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function addDirectoryToZip(zip: JSZip, rootDir: string, currentDir: string = '') {
  const fullPath = path.join(rootDir, currentDir);
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  for (const entry of entries) {
    const relPath = currentDir ? `${currentDir}/${entry.name}` : entry.name;
    const entryFullPath = path.join(rootDir, relPath);

    if (entry.isDirectory()) {
      zip.folder(relPath);
      await addDirectoryToZip(zip, rootDir, relPath);
    } else {
      const fileData = fs.readFileSync(entryFullPath);
      zip.file(relPath, fileData);
    }
  }
}

async function createDeployZip() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const publicDir = path.resolve(process.cwd(), 'public');
  const outputFile = path.join(publicDir, 'rawf_deploy_package.zip');

  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist. Run npm run build first.');
    process.exit(1);
  }

  // Ensure .htaccess is also inside dist
  const htaccessSrc = path.join(publicDir, '.htaccess');
  const htaccessDest = path.join(distDir, '.htaccess');
  if (fs.existsSync(htaccessSrc)) {
    fs.copyFileSync(htaccessSrc, htaccessDest);
  }

  const zip = new JSZip();

  // Add all dist files recursively
  await addDirectoryToZip(zip, distDir);

  // Add required upload directory structures
  zip.file('uploads/officers/.gitkeep', '');
  zip.file('uploads/evidence/.gitkeep', '');
  zip.file('uploads/banners/.gitkeep', '');

  // Generate ZIP file
  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  fs.writeFileSync(outputFile, content);
  console.log(`✅ Successfully generated deployment ZIP: ${outputFile} (${content.length} bytes)`);
}

createDeployZip().catch((err) => {
  console.error('Error creating deploy package:', err);
  process.exit(1);
});
