console.log("Email Templates Extension has started!");

function checkForCompose() {
    chrome.storage.sync.get("isEnabled", (data) => {
        if (data.isEnabled === false) {
            // If OFF, find and remove any existing buttons
            const existingButtons = document.querySelectorAll(".myTemplates");
            existingButtons.forEach(btn => btn.remove());
            return; 
        }
        const gmailToolbar = document.querySelectorAll(".btC");
        gmailToolbar.forEach((toolbar) => {
            if (!toolbar.querySelector(".myTemplates")) {
                console.log("Found a new Gmail window!");
                toolbar.appendChild(createButton());
            }
        });
        
        const outlookSendButton = document.querySelectorAll("[data-testid='ComposeSendButton']");
        outlookSendButton.forEach((sendButton) => {
            if (sendButton && sendButton.parentElement){
                const toolbar = sendButton.parentElement;
                if (!toolbar.querySelector(".myTemplates")) {
                    console.log("Found a new Outlook window!");
                    toolbar.appendChild(createButton());
                }
            }
        });
    });
}

function  createButton () {
    const templateButton = document.createElement("button");
    templateButton.innerText = "Emplates";
    templateButton.className = "myTemplates";
    const templates = {
        "Intro": "Hi, my name is ____. Nice to meet you!",
        "Follow Up": "Just following up on our previous conversation.",
        "Thanks": "Thanks for your help! Best, ____"
    };
    

    templateButton.onclick = (e) => {
        e.preventDefault();

        const existingMenu = document.querySelector(".templateMenu");
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement("div");
        menu.className = "templateMenu";
        menu.style.visibility = "hidden";
        document.body.appendChild(menu);       

        Object.keys(templates).forEach((key) => {
            const item = document.createElement("button");
            item.className = "templateItem";
            item.innerText = key;

            item.onclick = () => {
                // This is your original paste logic!
                const emailBox = templateButton.closest("div[role='region']") || 
                                 templateButton.closest("div[role='dialog']") || 
                                 templateButton.closest("div[role='main']") || 
                                 templateButton.closest("table");

                if (emailBox) {
                    const body = emailBox.querySelector('div[aria-label^="Message body" i][contenteditable="true"]') || 
                                 emailBox.querySelector('div[role="textbox"][contenteditable="true"]');
                    
                    if (body) {
                        body.focus();
                        document.execCommand("insertText", false, templates[key]);
                    }
                }
                menu.remove(); // Close menu after pasting
            };
            menu.appendChild(item);
        });

        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        const rect = templateButton.getBoundingClientRect();

        if (rect.left + menuWidth + 30 > window.innerWidth) {
            menu.style.left = `${rect.right - menuWidth}px`;
        } else {
            menu.style.left = `${rect.left}px`;
        }

        if (rect.top - menuHeight - 30 < 0) {
            menu.style.top = `${rect.bottom + 5}px`;
        } else {
            menu.style.top = `${rect.top - menuHeight - 5}px`;
        }

        menu.style.visibility = "visible";

        setTimeout(() => {
            window.onclick = () => {
                menu.remove();
                window.onclick = null;
            };
        }, 0);

        //const clicked = e.target;
        // const emailBox = clicked.closest("div[role='region']") || 
        //                 clicked.closest("div[role='dialog']") || 
        //                 clicked.closest("div[role='main']") || 
        //                 clicked.closest("table");

        // if (emailBox) {
        //     let body = emailBox.querySelector('div[aria-label^="Message body" i][contenteditable="true"]');

        //     if (!body) {
        //         body = emailBox.querySelector('div[role="textbox"][contenteditable="true"]');
        //     }

        //     if (body) {
        //         body.focus(); 
        //         const template = "Hi, my name is ____\n\nI wanted to reach out regarding...";
        //         document.execCommand("insertText", false, template);
        //     } else {
        //         console.log("found the window, but couldnt find the body");
        //     }
        // }
        // else {
        //     console.log("couldnt find window for email composition");
        // }/
    }

    return templateButton;
}

const observer = new MutationObserver((mutation) => {
    checkForCompose();
});

observer.observe(document.body, {
    childList:true,
    subtree: true
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.isEnabled) {
        checkForCompose();
    }
});
//setInterval(checkForCompose, 2000);