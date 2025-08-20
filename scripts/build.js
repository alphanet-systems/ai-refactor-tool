#!/usr/bin/env node

// scripts/build.js
// Simple build script for the AI Refactor Tool

const fs = require('fs');
const path = require('path');

console.log('🔨 Building AI Refactor Tool...');

// Ensure src/index.js has proper shebang for CLI usage
const indexPath = path.join(__dirname, '..', 'src', 'index.js');
if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Add shebang if not present
    if (!content.startsWith('#!/usr/bin/env node')) {
        content = '#!/usr/bin/env node\n\n' + content;
        fs.writeFileSync(indexPath, content);
        console.log('✅ Added shebang to src/index.js');
    }
    
    // Make executable
    fs.chmodSync(indexPath, '755');
    console.log('✅ Made src/index.js executable');
} else {
    console.log('⚠️  src/index.js not found - skipping shebang setup');
}

// Create any missing directories
const dirs = ['tests/unit', 'tests/integration', 'tests/fixtures', 'examples', 'docs'];
dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    }
});

console.log('🎉 Build completed successfully!');
console.log('\nNext steps:');
console.log('1. Run: npm test');
console.log('2. Try: ./src/index.js --help');
console.log('3. Test with: ./src/index.js analyze ./examples');
