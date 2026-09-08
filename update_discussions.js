const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'DiscussionsModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// I will write a custom script or just use multi_edit_file to replace the relevant sections.
