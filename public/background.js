chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.local.get(["firstTab", "secondTab"], (data) => {
        const isFirstTab = data.firstTab && data.firstTab.id === tabId;
        const isSecondTab = data.secondTab && data.secondTab.id === tabId;

        if (!isFirstTab && !isSecondTab) return;

        const isSpotify = tab.url && tab.url.includes("spotify.com");

        if (isSpotify && changeInfo.title) {
            if (isFirstTab) chrome.storage.local.set({ firstTab: tab });
            else chrome.storage.local.set({ secondTab: tab });
            return;
        }

        if (!isSpotify && changeInfo.status === "complete") {
            const oldTitle = isFirstTab ? data.firstTab.title : data.secondTab.title;
            const interval = setInterval(() => {
                chrome.tabs.get(tabId, (updatedTab) => {
                    if (chrome.runtime.lastError) { clearInterval(interval); return; }
                    if (updatedTab.title !== oldTitle) {
                        clearInterval(interval);
                        if (isFirstTab) chrome.storage.local.set({ firstTab: updatedTab });
                        else chrome.storage.local.set({ secondTab: updatedTab });
                    }
                });
            }, 300);
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === "titleChanged") {
        chrome.storage.local.get(["firstTab", "secondTab"], (data) => {
            if (data.firstTab && data.firstTab.id === sender.tab.id) {
                chrome.storage.local.set({ firstTab: { ...data.firstTab, title: message.title } });
            }
            else if (data.secondTab && data.secondTab.id === sender.tab.id) {
                chrome.storage.local.set({ secondTab: { ...data.secondTab, title: message.title } });
            }
        });
        return;
    }

    chrome.storage.local.get(
        ["firstTab", "secondTab", "isExtensionActive"], (data) => {
            const senderTabId = sender.tab.id;
            const firstTabId = data.firstTab?.id;
            const secondTabId = data.secondTab?.id;
            const isOn = data.isExtensionActive;

            if (!isOn) return;

            if (message.action === "paused") {
                if (senderTabId === firstTabId) {
                    chrome.tabs.sendMessage(secondTabId, { action: "play" }, () => {
                        if (chrome.runtime.lastError) return;
                    });
                }
                else if (senderTabId === secondTabId) {
                    chrome.tabs.sendMessage(firstTabId, { action: "play" }, () => {
                        if (chrome.runtime.lastError) return;
                    });
                }
            }

            if (message.action === "played") {
                if (senderTabId === firstTabId) {
                    chrome.tabs.sendMessage(secondTabId, { action: "pause" }, () => {
                        if (chrome.runtime.lastError) return;
                    });
                }
                else if (senderTabId === secondTabId) {
                    chrome.tabs.sendMessage(firstTabId, { action: "pause" }, () => {
                        if (chrome.runtime.lastError) return;
                    });
                }
            }
        }
    );
});

chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.storage.local.get(["firstTab", "secondTab"], (data) => {
        if (data.firstTab?.id === tabId) chrome.storage.local.remove("firstTab");
        if (data.secondTab?.id === tabId) chrome.storage.local.remove("secondTab");
    });
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.remove(["firstTab", "secondTab"]);
});