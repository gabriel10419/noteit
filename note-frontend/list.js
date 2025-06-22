// Arquivo: list.js (Versão Final)

const API_BASE_URL = 'http://localhost:8081/notemanagement';
const notesListContainer = document.getElementById('notes-list-container');
const tagFilterInput = document.getElementById('tag-filter');
const statusFilterInput = document.getElementById('status-filter');
const sortFilterInput = document.getElementById('sort-filter');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const resetFiltersBtn = document.getElementById('reset-filters-btn');

let allNotes = [];

async function initializePage() {
    try {
        const response = await fetch(`${API_BASE_URL}/all`);
        if (!response.ok) throw new Error('Erro ao carregar anotações.');
        allNotes = await response.json();
        renderNotes(allNotes);
    } catch (error) {
        console.error(error);
        notesListContainer.innerHTML = '<p>Não foi possível carregar as anotações.</p>';
    }

    applyFiltersBtn.addEventListener('click', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
}

function renderNotes(notes) {
    notesListContainer.innerHTML = '';
    if (notes.length === 0) {
        notesListContainer.innerHTML = '<p>Nenhuma anotação encontrada com os filtros aplicados.</p>';
        return;
    }

    notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        const tagsString = Array.isArray(note.tags) ? note.tags.join(', ') : '';

        card.innerHTML = `
            ${note.imageUrl ? `<img src="${note.imageUrl}" alt="Imagem de ${note.name}" onerror="this.style.display='none'">` : ''}
            <div class="note-info">
                <div class="note-name">${note.name}</div>
                <div><strong>Nota:</strong> ${note.rating} / 10</div>
                <div><strong>Status:</strong> ${note.status}</div>
                <div><strong>Progresso:</strong> ${note.progress || 0}</div>
                <div class="note-tags"><strong>Tags:</strong> ${tagsString}</div>
            </div>
             <div class="card-actions">
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Deletar</button>
            </div>
        `;
        
        // [MUDANÇA IMPORTANTE AQUI]
        card.querySelector('.edit-btn').addEventListener('click', () => {
            // Cria um objeto URLSearchParams para montar a string de consulta
            const params = new URLSearchParams();
            params.append('name', note.name);
            params.append('rating', note.rating);
            params.append('status', note.status);
            params.append('tags', Array.isArray(note.tags) ? note.tags.join(',') : '');
            params.append('progress', note.progress);
            params.append('imageUrl', note.imageUrl);
            
            // Redireciona para o index.html com os parâmetros
            window.location.href = `index.html?${params.toString()}`;
        });

        card.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note.name));

        notesListContainer.appendChild(card);
    });
}

function applyFilters() {
    let filteredNotes = [...allNotes];

    const tag = tagFilterInput.value.trim().toLowerCase();
    const status = statusFilterInput.value;
    const sort = sortFilterInput.value;

    if (tag) {
        filteredNotes = filteredNotes.filter(note => 
            note.tags.some(t => t.toLowerCase().includes(tag))
        );
    }

    if (status) {
        filteredNotes = filteredNotes.filter(note => note.status === status);
    }

    if (sort) {
        switch (sort) {
            case 'rating_desc':
                filteredNotes.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating_asc':
                filteredNotes.sort((a, b) => a.rating - b.rating);
                break;
            case 'name_asc':
                filteredNotes.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }
    
    renderNotes(filteredNotes);
}

function resetFilters() {
    tagFilterInput.value = '';
    statusFilterInput.value = '';
    sortFilterInput.value = '';
    renderNotes(allNotes);
}

async function deleteNote(name) {
    if (!confirm(`Tem certeza que deseja deletar "${name}"?`)) return;

    try {
        const response = await fetch(`${API_BASE_URL}/delete/${encodeURIComponent(name)}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao deletar anotação.');
        initializePage();
    } catch (error) {
        console.error(error);
        alert('Falha ao deletar a anotação.');
    }
}

document.addEventListener('DOMContentLoaded', initializePage);