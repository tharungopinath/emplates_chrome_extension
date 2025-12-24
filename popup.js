document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle");
    const manageButton = document.getElementById("manageButton");

    chrome.storage.sync.get("isEnabled", (data) => {
        if (toggle) {
            toggle.checked = data.isEnabled !== false;
        }
    });

    if (toggle) {
        toggle.addEventListener("change", () => {
            chrome.storage.sync.set({ isEnabled: toggle.checked });
        });
    }

    if (manageButton) {
        manageButton.addEventListener("click", () => {
            chrome.runtime.openOptionsPage();
        });
    }
});