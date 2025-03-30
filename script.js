document.addEventListener("DOMContentLoaded", function() {
    const playlistLinkInput = document.getElementById("playlistLink");
    const trackLinkInput = document.getElementById("trackLink");
    const generateButton = document.getElementById("generateButton");
    const deeplinkInput = document.getElementById("deeplink");
    const copyButton = document.getElementById("copyButton");
    const errorMessageDiv = document.getElementById("error-message");

    function extractPlaylistId(playlistLink) {
        // Try to extract playlist ID from various formats (URI or URL)
        let playlistId = null;

        // Spotify URI (spotify:playlist:...)
        const uriRegex = /spotify:playlist:([a-zA-Z0-9]+)/;
        const uriMatch = playlistLink.match(uriRegex);
        if (uriMatch && uriMatch[1]) {
            playlistId = uriMatch[1];
        } else {
            // Spotify URL (https:\/\/open\.spotify\.com\/playlist\/...)
            const urlRegex = /https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/;
            const urlMatch = playlistLink.match(urlRegex);
            if (urlMatch && urlMatch[1]) {
                playlistId = urlMatch[1];
            }
        }

        return playlistId;
    }

   function extractTrackId(trackLink) {
        // Try to extract track ID from various formats (URI or URL)
        let trackId = null;

        // Spotify URI (spotify:track:...)
        const uriRegex = /spotify:track:([a-zA-Z0-9]+)/;
        const uriMatch = trackLink.match(uriRegex);
        if (uriMatch && uriMatch[1]) {
            trackId = uriMatch[1];
        } else {
            // Spotify URL (https:\/\/open\.spotify\.com\/track\/...)
            const urlRegex = /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
            const urlMatch = trackLink.match(urlRegex);
            if (urlMatch && urlMatch[1]) {
                trackId = urlMatch[1];
            }
        }

        return trackId;
    }

    generateButton.addEventListener("click", function() {
        const playlistLink = playlistLinkInput.value.trim();
        const trackLink = trackLinkInput.value.trim();

        const playlistId = extractPlaylistId(playlistLink);
        const trackId = extractTrackId(trackLink);

        if (!playlistId) {
            errorMessageDiv.textContent = "Please enter a valid Playlist Link or URI.";
            deeplinkInput.value = "";
            return;
        }

        if (!trackId) {
            errorMessageDiv.textContent = "Please enter a valid Track Link or URI.";
            deeplinkInput.value = "";
            return;
        }

        errorMessageDiv.textContent = ""; // Clear any previous errors

        // Construct the full deep link URI and HTTP for the track
        const deeplinkURI = `spotify:track:${trackId}`;
        const deeplinkHTTP = `https://open.spotify.com/track/${trackId}`;

        //For opening inside the app
        //deeplinkInput.value = deeplinkURI;
        //For opening in browser
        deeplinkInput.value = deeplinkHTTP;


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
