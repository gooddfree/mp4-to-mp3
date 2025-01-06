const express = require('express');
const fileUpload = require('express-fileupload');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(fileUpload());

// Endpoint to handle video upload and conversion
app.post('/convert', (req, res) => {
    if (!req.files || !req.files.video) {
        return res.status(400).send('No video file uploaded.');
    }

    const video = req.files.video;
    const inputPath = path.join(__dirname, 'uploads', video.name);
    const outputPath = path.join(__dirname, 'uploads', 'converted.mp3');

    // Save the uploaded video
    video.mv(inputPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Convert video to MP3 using ffmpeg
        ffmpeg(inputPath)
            .output(outputPath)
            .on('end', () => {
                // Send the converted MP3 file to the client
                res.download(outputPath, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                        res.status(500).send('Error sending file.');
                    }

                    // Clean up uploaded and converted files
                    fs.unlinkSync(inputPath);
                    fs.unlinkSync(outputPath);
                });
            })
            .on('error', (err) => {
                console.error('Error during conversion:', err);
                res.status(500).send('Conversion failed.');
            })
            .run();
    });
});

// Serve the frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
