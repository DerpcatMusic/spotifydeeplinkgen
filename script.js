document.addEventListener("DOMContentLoaded", function() {
    const playlistLinkInput = document.getElementById("playlistLink");
    const trackLinkInput = document.getElementById("trackLink");
    const generateButton = document.getElementById("generateButton");
    const deeplinkInput = document.getElementById("deeplink");
    const copyButton = document.getElementById("copyButton");
    const errorMessageDiv = document.getElementById("error-message");

    function extractTrackIdFromUrl(trackUrl) {
        const trackIdRegex = /track\/([a-zA-Z0-9]+)/;
        const trackIdMatch = trackUrl.match(trackIdRegex);
        if (trackIdMatch && trackIdMatch[1]) {
            return trackIdMatch[1];
        }
        return null;
    }

    function extractPlaylistIdFromUrl(playlistUrl) {
        const playlistIdRegex = /playlist\/([a-zA-Z0-9]+)/;
        const playlistIdMatch = playlistUrl.match(playlistIdRegex);
        if (playlistIdMatch && playlistIdMatch[1]) {
            return playlistIdMatch[1];
        }
        return null;
    }

    function generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
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

        const linkType = document.querySelector('input[name="linkType"]:checked').value; // Assuming radio buttons are still there

        let deeplink = "";
        if (linkType === "uri") {
            // Correct Deep Link format: spotify://track/{trackId}?context=spotify:playlist:{playlistId}&si={randomString}
            const randomSi = generateRandomString(10); // Generate a random 'si' string
            deeplink = `spotify://track/${trackId}?context=spotify:playlist:${playlistId}&si=${randomSi}`;
        } else {
            // HTTP Fallback (similar format for consistency, though 'si' might not be needed for HTTP)
            deeplink = `https://open.spotify.com/track/${trackId}?context=spotify:playlist:${playlistId}`;
        }

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
