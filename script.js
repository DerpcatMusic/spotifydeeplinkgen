document.addEventListener("DOMContentLoaded", function() {
    const playlistIdInput = document.getElementById("playlistId");
    const generateButton = document.getElementById("generateButton");
    const deeplinkInput = document.getElementById("deeplink");
    const copyButton = document.getElementById("copyButton");
    const errorMessageDiv = document.getElementById("error-message");

    generateButton.addEventListener("click", function() {
        const playlistId = playlistIdInput.value.trim();

        if (!playlistId) {
            errorMessageDiv.textContent = "Please enter a Playlist ID.";
            deeplinkInput.value = "";
            return;
        }

        // Basic Playlist ID Validation (Alphanumeric characters, minimum length)
        if (!/^[a-zA-Z0-9]{10,}$/.test(playlistId)) {
            errorMessageDiv.textContent = "Invalid Playlist ID format. Must be alphanumeric with at least 10 characters.";
            deeplinkInput.value = "";
            return;
        }

        errorMessageDiv.textContent = ""; // Clear any previous errors

        const deeplinkURI = "spotify:playlist:" + playlistId;
        const deeplinkHTTP = "https://open.spotify.com/playlist/" + playlistId;

        deeplinkInput.value = deeplinkURI; // Use URI scheme by default

        // Optional:  You could try to detect if Spotify is installed and use URI.
        // Otherwise default to https://open.spotify...

    });

    copyButton.addEventListener("click", function() {
        deeplinkInput.select();
        deeplinkInput.setSelectionRange(0, 99999); /* For mobile devices */

        try {
            document.execCommand('copy');
            //Optional:  Notify user that the copy went ok
            //alert("Copied the link: " + deeplinkInput.value);
        } catch (err) {
            errorMessageDiv.textContent = "Failed to copy deep link.  Please copy manually.";
        }
    });
});
