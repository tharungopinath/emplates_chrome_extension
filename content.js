console.log("Email Templates Extension has started!");

function checkForCompose() {
    const gmailToolbar = document.querySelector(".btC");
    
    const outlookSendButton = document.querySelector("[data.testid='ComposeSendButton']");
    const outlookToolbar = outlookSendButton ? outlookSendButton.parentElement : null;

    if (gmailToolbar && !document.querySelector(".myTemplates")) {
        console.log("Found gmail compose window!");
    }

    if (outlookToolbar && !document.querySelector(".myTemplates")){
        console.log("Found outlook compose window!");
    }
}

setInterval(checkForCompose, 2000);