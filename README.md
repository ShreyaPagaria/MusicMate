# MusicMate
Let's you download your Spotify playlists to mp3 files
# Spotify to MP3 Converter

A simple web application that allows users to convert their Spotify playlists into downloadable MP3 files. This project uses **Node.js**, **Express**, and **yt-dlp** to fetch and convert Spotify tracks to MP3 format.

## Features

- Fetch playlist tracks from Spotify using Spotify's Web API.
- Search and download YouTube audio for each track using **yt-dlp**.
- Provides MP3 download links for each track in the playlist.
- Simple frontend built with HTML, CSS, and JavaScript.

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript
- **API**: Spotify Web API, YouTube (via yt-dlp)
- **Other Tools**: dotenv (for environment variables)

## Installation

1. **Clone the repository** to your local machine:

    ```bash
    git clone https://github.com/your-username/spotify-to-mp3.git
    ```

2. **Navigate into the project directory**:

    ```bash
    cd spotify-to-mp3
    ```

3. **Install dependencies** for both frontend and backend:

    ```bash
    npm install
    ```

4. **Set up environment variables** by creating a `.env` file at the root of the project and adding your Spotify credentials:

    ```bash
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    ```

5. **Install yt-dlp** for downloading YouTube audio:

    ```bash
    pip install yt-dlp
    ```

## Running the Project

1. **Start the server**:

    ```bash
    node server.js
    ```

2. Open your browser and navigate to `http://localhost:3000` to use the app.

## Usage

1. On the homepage, **paste a valid Spotify playlist URL** in the input field.
2. Click **Convert Playlist** to fetch the tracks from the playlist and generate MP3 download links.
3. **Click the "Download MP3"** links to download individual tracks from the playlist.

## Folder Structure

