document.addEventListener("DOMContentLoaded", function() {
    const playlistLinkInput = document.getElementById("playlistLink");
    const trackLinkInput = document.getElementById("trackLink");
    const generateButton = document.getElementById("generateButton");
    const deeplinkInput = document.getElementById("deeplink");
    const copyButton = document.getElementById("copyButton");
    const errorMessageDiv = document.getElementById("error-message");

    function extractTrackIdFromUrl(trackUrl) {
        // Step 1 & 2: Copy Track URL and Remove Everything After the Question Mark
        let baseUrl = trackUrl.split('?')[0]; // Split at '?' and take the first part
        const trackIdRegex = /track\/([a-zA-Z0-9]+)/;
        const trackIdMatch = baseUrl.match(trackIdRegex);
        if (trackIdMatch && trackIdMatch[1]) {
            return trackIdMatch[1];
        }
        return null;
    }

    function extractPlaylistIdFromUrl(playlistUrl) {
        // Step 4: Copy Playlist URL and Extract the Playlist Code
        const playlistIdRegex = /playlist\/([a-zA-Z0-9]+)/;
        const playlistIdMatch = playlistUrl.match(playlistIdRegex);
        if (playlistIdMatch && playlistIdMatch[1]) {
            return playlistIdMatch[1];
        }
        return null;
    }

    generateButton.addEventListener("click", function() {
        const trackUrl = trackLinkInput.value.trim();
        const playlistUrl = playlistLinkInput.value.trim();

        const trackId = extractTrackIdFromUrl(trackUrl);
        const playlistId = extractPlaylistIdFromUrl(playlistUrl);

        if (!trackId) {
            errorMessageDiv.textContent = "Please enter a valid Track URL.";
            deeplinkInput.value = "";
            return;
        }

        if (!playlistId) {
            errorMessageDiv.textContent = "Please enter a valid Playlist URL.";
            deeplinkInput.value = "";
            return;
        }

        errorMessageDiv.textContent = ""; // Clear any previous errors

        // Step 3: Add the Playlist Context
        let deeplink = `https://open.spotify.com/track/${trackId}?context=spotify:playlist:`;

        // Step 5: Combine the Track and Playlist Codes
        deeplink += playlistId;

        // Step 6:  No need to replace '?' with '&' in this case, as we only have one '?'

        deeplinkInput.value = deeplink;
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
