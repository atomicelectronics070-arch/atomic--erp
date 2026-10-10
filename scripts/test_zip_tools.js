// Check what zip or compression tools are available
try {
  const jszip = require('jszip');
  console.log('jszip is available');
} catch (e) {
  console.log('jszip is not available');
}

try {
  const xlsx = require('xlsx');
  console.log('xlsx is available. Has zip?', !!xlsx.ZIP);
} catch (e) {
  console.log('xlsx is not available');
}

const zlib = require('zlib');
console.log('zlib is available');
