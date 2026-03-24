// Simple static file server using only core Node.js modules
// Serves files from the current directory and prevents directory traversal

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

// Root directory for serving files (current working directory)
const ROOT_DIR = process.cwd();

// Basic MIME type mapping
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.pdf': 'application/pdf'
};

// Helper to send an error response
function sendError(res, code, message) {
    res.writeHead(code, { 'Content-Type': 'text/plain' });
    res.end(message);
}

// Helper to render the directory listing at "/"
function renderDirectoryListing(res) {
    fs.readdir(ROOT_DIR, function (err, files) {
        if (err) {
            sendError(res, 500, '500 Server Error');
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>File Listing</title></head><body>');
        res.write('<h1>Files in current directory</h1>');
        res.write('<ul>');

        files.forEach(function (file) {
            // Generate links like /file?name=filename
            const href = '/file?name=' + encodeURIComponent(file);
            res.write('<li><a href="' + href + '">' + file + '</a></li>');
        });

        res.write('</ul>');
        res.write('</body></html>');
        res.end();
    });
}

// Helper to serve a single file
function serveFile(res, requestedPath) {
    // Normalize the path to remove .. and . segments
    const normalizedPath = path.normalize(requestedPath);

    // Build an absolute path under ROOT_DIR
    const absolutePath = path.join(ROOT_DIR, normalizedPath);

    // Prevent directory traversal by ensuring the resolved path starts with ROOT_DIR
    if (!absolutePath.startsWith(ROOT_DIR)) {
        sendError(res, 403, '403 Forbidden');
        return;
    }

    fs.stat(absolutePath, function (err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                sendError(res, 404, '404 Not Found');
            } else {
                sendError(res, 500, '500 Server Error');
            }
            return;
        }

        if (!stats.isFile()) {
            sendError(res, 404, '404 Not Found');
            return;
        }

        const ext = path.extname(absolutePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        const stream = fs.createReadStream(absolutePath);

        stream.on('open', function () {
            res.writeHead(200, { 'Content-Type': contentType });
            stream.pipe(res);
        });

        stream.on('error', function () {
            sendError(res, 500, '500 Server Error');
        });
    });
}

const server = http.createServer(function (req, res) {
    try {
        const parsedUrl = url.parse(req.url, true);

        // Root path: list all files in current directory
        if (parsedUrl.pathname === '/' || parsedUrl.pathname === '') {
            renderDirectoryListing(res);
            return;
        }

        // /file?name=FILENAME - serve that file
        if (parsedUrl.pathname === '/file') {
            const fileName = parsedUrl.query.name;

            if (!fileName) {
                sendError(res, 400, '400 Bad Request');
                return;
            }

            // Only allow files directly in ROOT_DIR
            serveFile(res, fileName);
            return;
        }

        // Any other path: 404
        sendError(res, 404, '404 Not Found');
    } catch (e) {
        sendError(res, 500, '500 Server Error');
    }
});

server.listen(1800, function () {
    console.log('Static file server running at http://localhost:1800');
});

