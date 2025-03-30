document.addEventListener("DOMContentLoaded", function() {
    const playlistLinkInput = document.getElementById("playlistLink");
    const trackLinkInput = document.getElementById("trackLink");
    const generateButton = document.getElementById("generateButton");
    const deeplinkInput = document.getElementById("deeplink");
    const copyButton = document.getElementById("copyButton");
    const errorMessageDiv = document.getElementById("error-message");
    const experimentalToggle = document.getElementById("experimentalToggle");
    const indicatorTextSpan = document.getElementById("indicator-text"); // Get the indicator span

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
        const playlistLink = playlistLinkInput.value.trim();
        const trackLink = trackLinkInput.value.trim();

        const playlistId = extractPlaylistIdFromUrl(playlistLink);
        const trackId = extractTrackIdFromUrl(trackLink);

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

        errorMessageDiv.textContent = "";

        const linkTypeToggle = document.getElementById("linkTypeToggle");
        const linkType = linkTypeToggle.checked ? "http" : "uri";
        const isExperimental = experimentalToggle.checked;

        let deeplink = "";
        let indicatorText = ""; // Text for indicator

        if (linkType === "uri") {
            const randomSi = generateRandomString(10);
            deeplink = `spotify://track/${trackId}?context=spotify:playlist:${playlistId}&si=${randomSi}`;
            indicatorText = "(Link Type: Spotify URI App)";
        } else {
            const randomSi = generateRandomString(10);
            if (isExperimental) {
                deeplink = `https://open.spotify.com/track/${trackId}?context=spotify:playlist:${playlistId}&si=${randomSi}`;
                indicatorText = "(Link Type: HTTP Browser) (Experimental: On)";
            } else {
                deeplink = `http://open.spotify.com/track/${trackId}?context=spotify:playlist:${playlistId}&si=${randomSi}`;
                indicatorText = "(Link Type: HTTP Browser) (Experimental: Off)";
            }
        }

        deeplinkInput.value = deeplink;
        indicatorTextSpan.textContent = indicatorText; // Set the indicator text
    });

    copyButton.addEventListener("click", function() {
        deeplinkInput.select();
        deeplinkInput.setSelectionRange(0, 99999);

        try {
            document.execCommand('copy');
        } catch (err) {
            errorMessageDiv.textContent = "Failed to copy deep link. Please copy manually.";
        }
    });
});
