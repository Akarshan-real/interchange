const isYouTube = window.location.hostname.includes("youtube.com");
const isSpotify = window.location.hostname.includes("spotify.com");

if (isYouTube) {
    let currentVideo = null;

    const youtubeObserver = new MutationObserver(() => {
        const video = document.querySelector("video");
        if (video && video !== currentVideo) {
            currentVideo = video;

            video.addEventListener("pause", () => {
                if (chrome.runtime && chrome.runtime.id) {
                    chrome.runtime.sendMessage({ action: "paused" });
                }
            });

            video.addEventListener("play", () => {
                if (chrome.runtime && chrome.runtime.id) {
                    chrome.runtime.sendMessage({ action: "played" });
                }
            });
        }
    });

    youtubeObserver.observe(document.body, { childList: true, subtree: true });
}

if (isSpotify) {
    const titleObserver = new MutationObserver(() => {
        if (chrome.runtime && chrome.runtime.id) {
            chrome.runtime.sendMessage({ action: "titleChanged", title: document.title });
        }
    });
    titleObserver.observe(document.querySelector("title"), { childList: true });

    const spotifyObserver = new MutationObserver(() => {
        const btn = document.querySelector('[data-testid="control-button-playpause"]');
        if (!btn) return;

        const label = btn.getAttribute("aria-label");
        if (label === "Play") {
            if (chrome.runtime && chrome.runtime.id) {
                chrome.runtime.sendMessage({ action: "paused" });
            }
        } else if (label === "Pause") {
            if (chrome.runtime && chrome.runtime.id) {
                chrome.runtime.sendMessage({ action: "played" });
            }
        }
    });

    spotifyObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
}

chrome.runtime.onMessage.addListener((message) => {
    if (isYouTube) {
        const video = document.querySelector("video");
        if (!video) return;
        if (message.action === "play") video.play();
        if (message.action === "pause") video.pause();
    }

    if (isSpotify) {
        const btn = document.querySelector('[data-testid="control-button-playpause"]');
        if (!btn) return;
        if (message.action === "play" && btn.getAttribute("aria-label") === "Play") btn.click();
        if (message.action === "pause" && btn.getAttribute("aria-label") === "Pause") btn.click();
    }
});