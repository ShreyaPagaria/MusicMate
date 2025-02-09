async function convertPlaylist() {
    const playlistUrl = document.getElementById("playlistUrl").value;
    const loadingMessage = document.getElementById("loadingMessage");
    const mp3LinksSection = document.getElementById("mp3Links");
    const downloadList = document.getElementById("downloadList");

    // Show the loading message and hide the download section
    loadingMessage.classList.remove("hidden");
    mp3LinksSection.classList.add("hidden");

    // Clear previous download links
    downloadList.innerHTML = "";

    if (!playlistUrl) {
        alert("Please enter a valid Spotify playlist URL.");
        return;
    }

    // Make an API call to your backend (replace with actual API endpoint)
    try {
        // Simulating the backend processing (replace this with actual backend call)
        const response = await fetch(`/convert-playlist?url=${playlistUrl}`);
        const data = await response.json();

        if (data.mp3Links) {
            // Display the MP3 download links
            data.mp3Links.forEach(link => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = link;
                a.download = true;
                a.textContent = "Download MP3";
                li.appendChild(a);
                downloadList.appendChild(li);
            });
            mp3LinksSection.classList.remove("hidden");
        } else {
            alert("Error processing the playlist.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("There was an error processing the playlist.");
    }

    // Hide the loading message
    loadingMessage.classList.add("hidden");
}
