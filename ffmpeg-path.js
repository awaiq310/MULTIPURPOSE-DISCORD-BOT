const path = require('path');
const ffmpegStatic = require('ffmpeg-static');

// Normalize path for Windows
module.exports = path.normalize(ffmpegStatic);