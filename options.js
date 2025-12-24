document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('templateGrid');
    const modal = document.getElementById('editorWindow');
    const createBtn = document.getElementById('createNewButton');
    const saveBtn = document.getElementById('saveButton');
    const cancelBtn = document.getElementById('cancelButton');

    let currentEditingIndex = null; 

    function render() {
        chrome.storage.sync.get("myTemplates", (data) => {
            // FIX: Ensure we handle the old Object format if it exists
            let templates = data.myTemplates;
            if (!Array.isArray(templates)) {
                templates = []; // Reset to array if it was an object
            }

            grid.innerHTML = '';
            
            // Use slice().reverse() to show recently added at the top
            templates.slice().reverse().forEach((template, index) => {
                const card = document.createElement('div');
                card.className = 'templateCard';
                
                // Calculate actual index because we reversed the display order
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
                    openModal(template.name, template.body, actualIndex);
                };

                card.querySelector('.deleteButton').onclick = () => {
                    templates.splice(actualIndex, 1); // Use splice for arrays
                    chrome.storage.sync.set({myTemplates: templates}, () => {
                        render();
                    });
                };
                grid.appendChild(card);
            });
        });
    }

    function openModal(name, body, index = null) {
        document.getElementById('tempName').value = name;
        document.getElementById('tempBody').value = body;
        
        document.getElementById('windowTitle').innerText = (name === '') ? "New Emplate" : "Edit Emplate";

        currentEditingIndex = index; 
        modal.style.display = 'flex';
    }

    createBtn.onclick = () => {
        openModal('', '');
    };

    cancelBtn.onclick = () => {
        modal.style.display = 'none';
    };

    saveBtn.onclick = () => {
        const nameInput = document.getElementById('tempName').value;
        const bodyInput = document.getElementById('tempBody').value;

        if (nameInput !== '' && bodyInput !== '') {
            chrome.storage.sync.get("myTemplates", (data) => {
                let templates = Array.isArray(data.myTemplates) ? data.myTemplates : [];
                
                const newEntry = { name: nameInput, body: bodyInput };

                if (currentEditingIndex !== null) {
                    templates[currentEditingIndex] = newEntry;
                } else {
                    templates.push(newEntry); // Now .push() will work
                }

                chrome.storage.sync.set({myTemplates: templates}, () => {
                    modal.style.display = 'none';
                    render();
                });
            });
        }
    };

    render();
});