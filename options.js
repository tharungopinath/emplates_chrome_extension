document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('templateGrid');
    const newWindow = document.getElementById('editorWindow');
    const createButton = document.getElementById('createNewButton');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');

    let currentEditingIndex = null; 

    function render() {
        chrome.storage.sync.get("myTemplates", (data) => {
            let templates = data.myTemplates;
            if (!Array.isArray(templates)) {
                templates = [];
            }

            grid.innerHTML = '';
            templates.slice().reverse().forEach((template, index) => {
                const card = document.createElement('div');
                card.className = 'templateCard';
                const actualIndex = templates.length - 1 - index;

                card.innerHTML = `
                    <div class="cardClickArea cardContent">
                        <strong>${template.name}</strong>
                        <p>${template.body}</p>
                    </div>
                    <div class="cardActions">
                        <button class="deleteButton">Delete</button>
                    </div>
                `;

                card.querySelector('.cardClickArea').onclick = () => {
                    openWindow(template.name, template.body, actualIndex);
                };

                card.querySelector('.deleteButton').onclick = () => {
                    templates.splice(actualIndex, 1);
                    chrome.storage.sync.set({myTemplates: templates}, () => {
                        render();
                    });
                };
                grid.appendChild(card);
            });
        });
    }

    function openWindow(name, body, index = null) {
        document.getElementById('tempName').value = name;
        document.getElementById('tempBody').value = body;
        
        if (name == '') {
            document.getElementById("windowTitle").innerText = "New Emplate";
        }
        else {
            document.getElementById("windowTitle").innerText = "Edit Emplate";
        }

        currentEditingIndex = index; 
        newWindow.style.display = "flex";
    }

    createButton.onclick = () => {
        openWindow('', '');
    };

    cancelButton.onclick = () => {
        newWindow.style.display = 'none';
    };

    saveButton.onclick = () => {
        const nameInput = document.getElementById('tempName').value;
        const bodyInput = document.getElementById('tempBody').value;

        if (nameInput !== '' && bodyInput !== '') {
            chrome.storage.sync.get("myTemplates", (data) => {
                let templates = Array.isArray(data.myTemplates) ? data.myTemplates : [];
                
                const newEntry = { name: nameInput, body: bodyInput };

                if (currentEditingIndex !== null) {
                    templates[currentEditingIndex] = newEntry;
                } else {
                    templates.push(newEntry); 
                }

                chrome.storage.sync.set({myTemplates: templates}, () => {
                    newWindow.style.display = 'none';
                    render();
                });
            });
        }
    };

    render();
});