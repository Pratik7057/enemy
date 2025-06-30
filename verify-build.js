const fs = require('fs');
const path = require('path');

// Check potential locations for the frontend build directory
const potentialBuildPaths = [
  path.join(__dirname, 'frontend', 'build'),
  path.join(__dirname, 'backend', 'public', 'frontend-build')
];

let buildDirFound = false;
let buildDir;

for (const dir of potentialBuildPaths) {
  if (fs.existsSync(dir)) {
    buildDir = dir;
    buildDirFound = true;
    console.log('✅ Frontend build directory found at:', buildDir);
    
    // List all files in the build directory
    console.log('\nContents of build directory:');
    const files = fs.readdirSync(buildDir);
    files.forEach(file => {
      const filePath = path.join(buildDir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        console.log(`📁 ${file}/`);
      } else {
        console.log(`📄 ${file} (${stats.size} bytes)`);
      }
    });
    
    // Check if index.html exists
    const indexHtml = path.join(buildDir, 'index.html');
    if (fs.existsSync(indexHtml)) {
      console.log('\n✅ index.html found');
    } else {
      console.log('\n❌ index.html not found!');
    }
    
    // We found a build directory, so we can stop looking
    break;
  }
}

// If no build directory was found
if (!buildDirFound) {
  console.log('❌ Frontend build directory not found at any of these locations:');
  potentialBuildPaths.forEach(dir => console.log(`   - ${dir}`));
  console.log('\nPlease make sure to run the build process before starting the server.');
}
