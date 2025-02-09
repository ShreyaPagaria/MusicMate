require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Ensure downloads directory exists
const downloadsDir = path.join(__dirname, "downloads");

if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// Default route to serve index.html
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/style.css"));
// });

// Set up Spotify API credentials
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Spotify token URL and headers
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

// Function to get the Spotify access token
async function getSpotifyAccessToken() {
    const response = await axios.post(
        SPOTIFY_TOKEN_URL,
        "grant_type=client_credentials",
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
            },
        }
    );
    return response.data.access_token;
}

// Function to fetch playlist tracks from Spotify
async function getPlaylistTracks(playlistUrl) {
    const accessToken = await getSpotifyAccessToken();
    const playlistId = playlistUrl.split("/").pop().split("?")[0]; // Extract playlist ID from URL

    const response = await axios.get(`${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    return response.data.items.map(item => item.track.name); // Return list of track names
}

// // Function to download YouTube audio using yt-dlp
// async function downloadYouTubeAudio(songName) {
//     const searchQuery = `${songName} site:youtube.com`;
//     const outputFilePath = path.join(__dirname, "downloads", `${songName}.mp3`); // Save to the "downloads" folder

//     return new Promise((resolve, reject) => {
//         // Run yt-dlp command to download the audio as mp3
//         exec(`yt-dlp -x --audio-format mp3 -o "${outputFilePath}" "${searchQuery}"`, (err, stdout, stderr) => {
//             if (err) {
//                 console.error(`Error downloading song: ${songName}`, err);
//                 reject(err);
//             } else {
//                 console.log(`Downloaded ${songName}`);
//                 resolve(outputFilePath);
//             }
//         });
//     });
// }
// Function to download YouTube audio using yt-dlp
async function downloadYouTubeAudio(songName) {
    const outputFilePath = path.join(downloadsDir, `${songName}.mp3`);

    return new Promise((resolve, reject) => {
        // Use ytsearch to find the best match on YouTube
        exec(
            `yt-dlp -x --audio-format mp3 -o "${outputFilePath}" "ytsearch:${songName}"`,
            (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error downloading song: ${songName}`, err);
                    reject(err);
                } else {
                    console.log(`Downloaded ${songName}`);
                    resolve(outputFilePath);
                }
            }
        );
    });
}


// Route to convert the playlist
app.get("/convert-playlist", async (req, res) => {
    const playlistUrl = req.query.url;

    if (!playlistUrl) {
        return res.status(400).send({ error: "Please provide a valid playlist URL." });
    }

    try {
        const songNames = await getPlaylistTracks(playlistUrl);
        const downloadLinks = [];

        for (const songName of songNames) {
            const filePath = await downloadYouTubeAudio(songName);
            downloadLinks.push(`/downloads/${songName}.mp3`);
        }

        res.json({ mp3Links: downloadLinks });
    } catch (error) {
        console.error("Error processing playlist:", error);
        res.status(500).send({ error: "Error processing the playlist." });
    }
});

// Serve downloaded MP3 files
app.use("/downloads", express.static("downloads"));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
