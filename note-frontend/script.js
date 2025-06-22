// Arquivo: script.js (Versão Final para a página de Adicionar/Editar)

const API_BASE_URL = 'http://localhost:8081/notemanagement';

const form = document.getElementById('note-form');
const notesContainer = document.getElementById('notes-container');
const formTitle = document.getElementById('form-title');
const submitButton = document.getElementById('submit-button');
const cancelEditButton = document.getElementById('cancel-edit-button');
const editModeInput = document.getElementById('edit-mode-name');

// --- FUNÇÕES DA API ---

async function loadNotes() {
    try {
        const response = await fetch(`${API_BASE_URL}/all`);
        if (!response.ok) throw new Error('Erro ao carregar anotações.');
        const notes = await response.json();
        renderNotes(notes);
    } catch (error) {
        console.error(error);
        notesContainer.innerHTML = '<p>Não foi possível carregar as anotações.</p>';
    }
}

async function createNote(note) {
    try {
        const response = await fetch(`${API_BASE_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note),
        });
        if (!response.ok) throw new Error('Erro ao criar anotação.');
        resetForm();
        loadNotes();
    } catch (error) {
        console.error(error);
    }
}

async function updateNote(originalName, note) {
    try {
        const response = await fetch(`${API_BASE_URL}/update/${encodeURIComponent(originalName)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note),
        });
        if (!response.ok) throw new Error('Erro ao atualizar anotação.');
        // Após atualizar com sucesso, redireciona para a lista
        window.location.href = 'list.html';
    } catch (error) {
        console.error(error);
    }
}

async function deleteNote(name) {
    if (!confirm(`Tem certeza que deseja deletar "${name}"?`)) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/delete/${encodeURIComponent(name)}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao deletar anotação.');
        loadNotes();
    } catch (error) {
        console.error(error);
    }
}

// --- FUNÇÕES DA INTERFACE ---

function renderNotes(notes) {
    notesContainer.innerHTML = ''; 
    if (notes.length === 0) {
        notesContainer.innerHTML = '<p>Nenhuma anotação encontrada. Adicione uma!</p>';
        return;
    }
    const recentNotes = notes.slice(-5).reverse();
    recentNotes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        const tagsString = Array.isArray(note.tags) ? note.tags.join(', ') : '';
        card.innerHTML = `
            ${note.imageUrl ? `<img src="${note.imageUrl}" alt="Imagem de ${note.name}" onerror="this.style.display='none'">` : ''}
            <div class="note-info">
                <div class="note-name">${note.name}</div>
                <div><strong>Nota:</strong> ${note.rating} / 10</div>
                <div><strong>Status:</strong> ${note.status}</div>
            </div>
            <div class="card-actions">
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Deletar</button>
            </div>
        `;
        card.querySelector('.edit-btn').addEventListener('click', () => startEdit(note));
        card.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note.name));
        notesContainer.appendChild(card);
    });
}

function resetForm() {
    form.reset();
    editModeInput.value = '';
    formTitle.textContent = 'Adicionar Nova Anotação';
    submitButton.textContent = 'Salvar';
    cancelEditButton.classList.add('hidden');
    window.history.replaceState({}, document.title, window.location.pathname);
}

function startEdit(note) {
    editModeInput.value = note.name;
    form.name.value = note.name;
    form.rating.value = note.rating;
    form.status.value = note.status;
    form.tags.value = Array.isArray(note.tags) ? note.tags.join(', ') : '';
    form.progress.value = note.progress || '';
    form.imageUrl.value = note.imageUrl || '';
    formTitle.textContent = `Editando: ${note.name}`;
    submitButton.textContent = 'Atualizar';
    cancelEditButton.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkForEditParams() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    if (name) {
        const noteToEdit = {
            name: name,
            rating: parseFloat(params.get('rating')),
            status: params.get('status'),
            tags: params.get('tags') ? params.get('tags').split(',') : [],
            progress: parseInt(params.get('progress')),
            imageUrl: params.get('imageUrl')
        };
        startEdit(noteToEdit);
    }
}

// --- EVENT LISTENERS ---

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const noteData = {
        name: form.name.value,
        rating: parseFloat(form.rating.value) || 0,
        status: form.status.value,
        tags: form.tags.value ? form.tags.value.split(',').map(tag => tag.trim()) : [],
        progress: parseInt(form.progress.value) || 0,
        imageUrl: form.imageUrl.value,
    };
    const originalName = editModeInput.value;
    if (originalName) {
        await updateNote(originalName, noteData);
    } else {
        await createNote(noteData);
    }
});

cancelEditButton.addEventListener('click', resetForm);

document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    checkForEditParams();
});