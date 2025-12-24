function checkForCompose() {
    chrome.storage.sync.get("isEnabled", (data) => {
        if (data.isEnabled === false) {
            const existingButtons = document.querySelectorAll(".myTemplates");
            existingButtons.forEach(btn => btn.remove());
            return; 
        }
        const gmailToolbar = document.querySelectorAll(".btC");
        gmailToolbar.forEach((toolbar) => {
            if (!toolbar.querySelector(".myTemplates")) {
                toolbar.appendChild(createButton());
            }
        });
        
        const outlookSendButton = document.querySelectorAll("[data-testid='ComposeSendButton']");
        outlookSendButton.forEach((sendButton) => {
            if (sendButton && sendButton.parentElement){
                const toolbar = sendButton.parentElement;
                if (!toolbar.querySelector(".myTemplates")) {
                    toolbar.appendChild(createButton());
                }
            }
        });
    });
}

function createButton() {
    const templateButton = document.createElement("button");
    templateButton.innerText = "Emplates";
    templateButton.className = "myTemplates";

    templateButton.onclick = (e) => {
        e.preventDefault();
        const existingMenu = document.querySelector(".templateMenu");
        if (existingMenu) { existingMenu.remove(); return; }

        chrome.storage.sync.get("myTemplates", (data) => {
            const templates = Array.isArray(data.myTemplates) ? data.myTemplates : []; 
            const menu = document.createElement("div");
            menu.className = "templateMenu";
            menu.style.visibility = "hidden";
            document.body.appendChild(menu);

            templates.slice().reverse().forEach((template) => {
                const item = document.createElement("button");
                item.className = "templateItem";
                item.innerText = template.name;
                
                item.onclick = () => {
                    const emailBox = templateButton.closest("div[role='region']") || 
                     templateButton.closest("div[role='main']");

                    if (emailBox) {
                        const body = emailBox.querySelector("div[role='textbox'][aria-label='Message body']") || 
                                    emailBox.querySelector("div[contenteditable='true']");
                        if (body) {
                            body.focus();
                            document.execCommand("insertText", false, template.body);
                        }
                    }
                    menu.remove();
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
        });
    };
    return templateButton;
}

const observer = new MutationObserver(() => {
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