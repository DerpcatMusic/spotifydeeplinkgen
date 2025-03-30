document.addEventListener("DOMContentLoaded", function() {
    const playlistLinkInput = document.getElementById("playlistLink");
    const trackLinkInput = document.getElementById("trackLink");
    const generateButton = document.getElementById("generateButton");
    const deeplinkInput = document.getElementById("deeplink");
    const copyButton = document.getElementById("copyButton");
    const errorMessageDiv = document.getElementById("error-message");
    const experimentalOffButton = document.getElementById("experimentalOffButton"); // Get Experimental Off button
    const experimentalOnButton = document.getElementById("experimentalOnButton");   // Get Experimental On button
    const httpButton = document.getElementById("httpButton");          // Get HTTP Button
    const uriButton = document.getElementById("uriButton");            // Get URI Button
    const indicatorTextSpan = document.getElementById("indicator-text");

    let isExperimentalOn = false; // Track experimental state (default: off)
    let isHttpLinkType = true;    // Track link type state (default: HTTP)


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

    function updateIndicatorText(linkType, experimentalState) {
        let indicatorText = `(Link Type: ${linkType === "http" ? "Browser" : "Spotify URI App"})`;
        if (experimentalState) {
            indicatorText += " (Experimental: On)";
        } else {
            indicatorText += " (Experimental: Off)";
        }
        indicatorTextSpan.textContent = indicatorText;
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

        const linkType = isHttpLinkType ? "http" : "uri"; // Determine link type from button state
        const isExperimental = isExperimentalOn;         // Determine experimental state

        let deeplink = "";
        if (linkType === "uri") {
            const randomSi = generateRandomString(10);
            deeplink = `spotify://track/${trackId}?context=spotify:playlist:${playlistId}&si=${randomSi}`;
        } else {
            const randomSi = generateRandomString(10);
            if (isExperimental) {
                deeplink = `https://open.spotify.com/track/${trackId}?context=spotify:playlist:${playlistId}&si=${randomSi}`;
            } else {
                deeplink = `http://open.spotify.com/track/${trackId}?context=spotify:playlist:${playlistId}&si=${randomSi}`;
            }
        }

        deeplinkInput.value = deeplink;
        updateIndicatorText(linkType, isExperimental); // Update indicator text
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

    // Link Type Button Event Listeners
    httpButton.addEventListener("click", function() {
        isHttpLinkType = true;
        httpButton.classList.add("active");
        uriButton.classList.remove("active");
        updateIndicatorText(isHttpLinkType ? "http" : "uri", isExperimentalOn); // Update indicator text
    });

    uriButton.addEventListener("click", function() {
        isHttpLinkType = false;
        uriButton.classList.add("active");
        httpButton.classList.remove("active");
        updateIndicatorText(isHttpLinkType ? "http" : "uri", isExperimentalOn); // Update indicator text
    });

    // Experimental Button Event Listeners
    experimentalOffButton.addEventListener("click", function() {
        isExperimentalOn = false;
        experimentalOffButton.classList.add("active");
        experimentalOnButton.classList.remove("active");
        updateIndicatorText(isHttpLinkType ? "http" : "uri", isExperimentalOn); // Update indicator text
    });

    experimentalOnButton.addEventListener("click", function() {
        isExperimentalOn = true;
        experimentalOnButton.classList.add("active");
        experimentalOffButton.classList.remove("active");
        updateIndicatorText(isHttpLinkType ? "http" : "uri", isExperimentalOn); // Update indicator text
    });

    updateIndicatorText(isHttpLinkType ? "http" : "uri", isExperimentalOn); // Set initial indicator text
});
