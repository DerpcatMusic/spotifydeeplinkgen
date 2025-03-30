document.addEventListener("DOMContentLoaded", function() {
    const playlistLinkInput = document.getElementById("playlistLink");
    const trackLinkInput = document.getElementById("trackLink");
    const generateButton = document.getElementById("generateButton");
    const deeplinkInput = document.getElementById("deeplink");
    const copyButton = document.getElementById("copyButton");
    const errorMessageDiv = document.getElementById("error-message");
    const experimentalButton = document.getElementById("experimentalButton"); // Get Experimental button
    const linkTypeButton = document.getElementById("linkTypeButton");       // Get Link Type button
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

    // Link Type Button Event Listener (Single Button Toggle)
    linkTypeButton.addEventListener("click", function() {
        isHttpLinkType = !isHttpLinkType; // Toggle Link Type state
        if (isHttpLinkType) {
            linkTypeButton.textContent = "Browser (HTTP)";
            linkTypeButton.classList.add("active-green");
            linkTypeButton.classList.remove("active-red"); // Remove red class if present
        } else {
            linkTypeButton.textContent = "URI (Spotify App)";
            linkTypeButton.classList.add("active-red"); // Use red class for URI (can change color if needed)
            linkTypeButton.classList.remove("active-green");
        }
        updateIndicatorText(isHttpLinkType ? "http" : "uri", isExperimentalOn); // Update indicator text
    });


    // Experimental Button Event Listener (Single Button Toggle)
    experimentalButton.addEventListener("click", function() {
        isExperimentalOn = !isExperimentalOn; // Toggle Experimental state
        if (isExperimentalOn) {
            experimentalButton.textContent = "On";
            experimentalButton.classList.add("active-green"); // Use active-green for "On" state (you can change to red if desired)
            experimentalButton.classList.remove("active-red");
        } else {
            experimentalButton.textContent = "Off";
            experimentalButton.classList.add("active-red"); // Use active-red for "Off" state (you can change color)
            experimentalButton.classList.remove("active-green");
        }
        updateIndicatorText(isHttpLinkType ? "http" : "uri", isExperimentalOn); // Update indicator text
    });


    updateIndicatorText(isHttpLinkType ? "http" : "uri", isExperimentalOn); // Set initial indicator text
});
