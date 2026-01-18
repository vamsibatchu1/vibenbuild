const fs = require('fs');
const svgContent = fs.readFileSync('public/images/pokedex.svg', 'utf8');

// Extract all paths, circles, and other elements
const paths = svgContent.match(/<path[^>]*>/g) || [];
const circles = svgContent.match(/<circle[^>]*>/g) || [];
const rects = svgContent.match(/<rect[^>]*>/g) || [];
const groups = svgContent.match(/<g[^>]*>[\s\S]*?<\/g>/g) || [];
const defs = svgContent.match(/<defs>[\s\S]*?<\/defs>/g) || [];

console.log(`Found ${paths.length} paths, ${circles.length} circles, ${rects.length} rects, ${groups.length} groups, ${defs.length} defs`);
