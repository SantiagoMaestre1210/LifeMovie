const motivationalQuotes = [
    "Cada día es una nueva oportunidad para crear la vida que deseas.",
    "Tus sueños están esperando que tomes acción.",
    "El futuro pertenece a quienes creen en la belleza de sus sueños.",
    "No cuentes los días, haz que los días cuenten.",
    "La mejor forma de predecir el futuro es crearlo.",
    "Pequeños pasos cada día te llevan a grandes logros.",
    "Tu única limitación es la que te impones a ti mismo.",
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "Cree en ti mismo y todo será posible.",
    "La motivación es lo que te pone en marcha, el hábito es lo que te mantiene en el camino.",
    "Hoy es el día perfecto para comenzar.",
    "Convierte tus metas en planes y tus planes en realidad.",
    "La vida es una película y tú eres el director.",
    "Cada meta alcanzada es un paso más hacia tu mejor versión.",
    "El progreso, no la perfección, es lo que importa.",
    "Las grandes cosas nunca vienen de zonas de confort.",
    "Tu potencial es ilimitado. Cree en él.",
    "Los sueños no funcionan a menos que tú lo hagas.",
    "Cada logro comienza con la decisión de intentarlo.",
    "La persistencia es el camino al éxito."
];

const badges = [
    { id: 'first', icon: '🌟', name: 'Primera Meta', condition: (stats) => stats.total >= 1 },
    { id: 'five', icon: '🎯', name: '5 Metas', condition: (stats) => stats.total >= 5 },
    { id: 'ten', icon: '🏆', name: '10 Metas', condition: (stats) => stats.total >= 10 },
    { id: 'complete', icon: '✅', name: 'Primera Completada', condition: (stats) => stats.completed >= 1 },
    { id: 'five_complete', icon: '💎', name: '5 Completadas', condition: (stats) => stats.completed >= 5 },
    { id: 'progress', icon: '🚀', name: 'Progresando', condition: (stats) => stats.inProgress >= 3 },
    { id: 'balanced', icon: '⚖️', name: 'Vida Balanceada', condition: (stats) => stats.categories >= 3 },
    { id: 'dedicated', icon: '💪', name: 'Dedicado', condition: (stats) => stats.total >= 20 }
];

let goals = [];
let currentEditId = null;
let musicPlaying = false;
let currentModalGoalId = null;
let currentTheme = 'light';

let particles = [];
let confetti = [];

function init() {
    loadGoals();
    loadTheme();
    displayRandomQuote();
    renderGoals();
    updateStats();
    updateBadges();
    setupEventListeners();
    setupMusicPlayer();
    initParticles();
    animateParticles();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('lifeMovieTheme') || 'light';
    currentTheme = savedTheme;
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('lifeMovieTheme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
}

function setupEventListeners() {
    const goalForm = document.getElementById('goalForm');
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const themeToggle = document.getElementById('themeToggle');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFileInput = document.getElementById('importFileInput');
    const searchInput = document.getElementById('searchInput');
    const filterCategory = document.getElementById('filterCategory');
    const filterProgress = document.getElementById('filterProgress');
    const sortBy = document.getElementById('sortBy');
    const closeModal = document.getElementById('closeModal');
    const addNoteBtn = document.getElementById('addNoteBtn');

    if (goalForm) goalForm.addEventListener('submit', handleFormSubmit);
    if (newQuoteBtn) newQuoteBtn.addEventListener('click', displayRandomQuote);
    if (playBtn) playBtn.addEventListener('click', playMusic);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseMusic);
    if (volumeSlider) volumeSlider.addEventListener('input', changeVolume);
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (exportBtn) exportBtn.addEventListener('click', exportData);
    if (importBtn) importBtn.addEventListener('click', () => importFileInput.click());
    if (importFileInput) importFileInput.addEventListener('change', importData);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterCategory) filterCategory.addEventListener('change', applyFilters);
    if (filterProgress) filterProgress.addEventListener('change', applyFilters);
    if (sortBy) sortBy.addEventListener('change', applyFilters);
    if (closeModal) closeModal.addEventListener('click', closeNotesModal);
    if (addNoteBtn) addNoteBtn.addEventListener('click', addNoteToGoal);
}

function setupMusicPlayer() {
    const audio = document.getElementById('relaxingMusic');
    if (audio) {
        audio.volume = 0.5;
    }
}

function playMusic() {
    try {
        const audio = document.getElementById('relaxingMusic');
        const musicSource = document.getElementById('musicSource');
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');

        if (!musicSource.src) {
            musicSource.src = generateRelaxingTone();
            audio.load();
        }

        audio.play().then(() => {
            musicPlaying = true;
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
        }).catch(error => {
            console.error('Error al reproducir música:', error);
        });
    } catch (error) {
        console.error('Error en playMusic:', error);
    }
}

function pauseMusic() {
    try {
        const audio = document.getElementById('relaxingMusic');
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');

        audio.pause();
        musicPlaying = false;
        playBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
    } catch (error) {
        console.error('Error en pauseMusic:', error);
    }
}

function changeVolume(event) {
    try {
        const audio = document.getElementById('relaxingMusic');
        audio.volume = event.target.value / 100;
    } catch (error) {
        console.error('Error al cambiar volumen:', error);
    }
}

function generateRelaxingTone() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 30;
        const sampleRate = audioContext.sampleRate;
        const numSamples = duration * sampleRate;
        const audioBuffer = audioContext.createBuffer(2, numSamples, sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            for (let i = 0; i < numSamples; i++) {
                const time = i / sampleRate;
                channelData[i] = 
                    Math.sin(2 * Math.PI * 174.61 * time) * 0.1 +
                    Math.sin(2 * Math.PI * 261.63 * time) * 0.08 +
                    Math.sin(2 * Math.PI * 349.23 * time) * 0.06 +
                    Math.sin(2 * Math.PI * 523.25 * time) * 0.05;
            }
        }

        const wavBlob = audioBufferToWav(audioBuffer);
        return URL.createObjectURL(wavBlob);
    } catch (error) {
        console.error('Error generando tono:', error);
        return '';
    }
}

function audioBufferToWav(buffer) {
    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);
    const channels = [];
    let offset = 0;
    let pos = 0;

    function setString(str) {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(pos + i, str.charCodeAt(i));
        }
        pos += str.length;
    }

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }

    setString('RIFF');
    setUint32(36 + length);
    setString('WAVE');
    setString('fmt ');
    setUint32(16);
    setUint16(1);
    setUint16(buffer.numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels);
    setUint16(buffer.numberOfChannels * 2);
    setUint16(16);
    setString('data');
    setUint32(length);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    while (pos < arrayBuffer.byteLength) {
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            const sample = Math.max(-1, Math.min(1, channels[i][offset]));
            view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            pos += 2;
        }
        offset++;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function displayRandomQuote() {
    try {
        const quoteElement = document.getElementById('motivationalQuote');
        if (quoteElement) {
            const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
            quoteElement.textContent = `"${motivationalQuotes[randomIndex]}"`;
        }
    } catch (error) {
        console.error('Error al mostrar frase:', error);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        const title = document.getElementById('goalTitle').value.trim();
        const description = document.getElementById('goalDescription').value.trim();
        const category = document.getElementById('goalCategory').value;
        const emotion = document.getElementById('goalEmotion').value;
        const progress = parseInt(document.getElementById('goalProgress').value);
        const deadline = document.getElementById('goalDeadline').value;
        const priority = document.getElementById('goalPriority').value;
        const visualization = document.getElementById('goalVisualization').value.trim();

        if (!title || !description || !category || !emotion) {
            alert('Por favor completa todos los campos requeridos.');
            return;
        }

        if (currentEditId !== null) {
            updateGoal(currentEditId, title, description, category, emotion, progress, deadline, priority, visualization);
            currentEditId = null;
            document.getElementById('btnText').textContent = '✨ Agregar Meta';
        } else {
            addGoal(title, description, category, emotion, progress, deadline, priority, visualization);
        }

        document.getElementById('goalForm').reset();
        renderGoals();
        updateStats();
        updateBadges();
    } catch (error) {
        console.error('Error al procesar el formulario:', error);
        alert('Hubo un error al guardar la meta. Por favor intenta de nuevo.');
    }
}

function addGoal(title, description, category, emotion, progress, deadline, priority, visualization) {
    try {
        const goal = {
            id: Date.now(),
            title,
            description,
            category,
            emotion,
            progress,
            deadline,
            priority,
            visualization,
            notes: [],
            createdAt: new Date().toISOString()
        };

        goals.push(goal);
        saveGoals();
        
        if (progress === 100) {
            triggerConfetti();
        }
    } catch (error) {
        console.error('Error al agregar meta:', error);
        throw error;
    }
}

function updateGoal(id, title, description, category, emotion, progress, deadline, priority, visualization) {
    try {
        const goalIndex = goals.findIndex(g => g.id === id);
        if (goalIndex !== -1) {
            const oldProgress = goals[goalIndex].progress;
            
            goals[goalIndex] = {
                ...goals[goalIndex],
                title,
                description,
                category,
                emotion,
                progress,
                deadline,
                priority,
                visualization,
                updatedAt: new Date().toISOString()
            };
            saveGoals();
            
            if (oldProgress < 100 && progress === 100) {
                triggerConfetti();
            }
        }
    } catch (error) {
        console.error('Error al actualizar meta:', error);
        throw error;
    }
}

function deleteGoal(id) {
    try {
        if (confirm('¿Estás seguro de que quieres eliminar esta meta?')) {
            goals = goals.filter(g => g.id !== id);
            saveGoals();
            renderGoals();
            updateStats();
            updateBadges();
        }
    } catch (error) {
        console.error('Error al eliminar meta:', error);
        alert('Hubo un error al eliminar la meta. Por favor intenta de nuevo.');
    }
}

function editGoal(id) {
    try {
        const goal = goals.find(g => g.id === id);
        if (goal) {
            document.getElementById('goalTitle').value = goal.title;
            document.getElementById('goalDescription').value = goal.description;
            document.getElementById('goalCategory').value = goal.category;
            document.getElementById('goalEmotion').value = goal.emotion;
            document.getElementById('goalProgress').value = goal.progress;
            document.getElementById('goalDeadline').value = goal.deadline || '';
            document.getElementById('goalPriority').value = goal.priority || 'Media';
            document.getElementById('goalVisualization').value = goal.visualization || '';

            currentEditId = id;
            document.getElementById('btnText').textContent = '🔄 Actualizar Meta';

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error al editar meta:', error);
        alert('Hubo un error al cargar la meta para editar.');
    }
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    const progressFilter = document.getElementById('filterProgress').value;
    const sortByValue = document.getElementById('sortBy').value;

    let filteredGoals = [...goals];

    if (searchTerm) {
        filteredGoals = filteredGoals.filter(goal => 
            goal.title.toLowerCase().includes(searchTerm) ||
            goal.description.toLowerCase().includes(searchTerm)
        );
    }

    if (categoryFilter) {
        filteredGoals = filteredGoals.filter(goal => goal.category === categoryFilter);
    }

    if (progressFilter) {
        filteredGoals = filteredGoals.filter(goal => {
            if (progressFilter === '0') return goal.progress === 0;
            if (progressFilter === '1-49') return goal.progress >= 1 && goal.progress <= 49;
            if (progressFilter === '50-99') return goal.progress >= 50 && goal.progress <= 99;
            if (progressFilter === '100') return goal.progress === 100;
            return true;
        });
    }

    switch (sortByValue) {
        case 'recent':
            filteredGoals.sort((a, b) => b.id - a.id);
            break;
        case 'oldest':
            filteredGoals.sort((a, b) => a.id - b.id);
            break;
        case 'progress-high':
            filteredGoals.sort((a, b) => b.progress - a.progress);
            break;
        case 'progress-low':
            filteredGoals.sort((a, b) => a.progress - b.progress);
            break;
        case 'deadline':
            filteredGoals.sort((a, b) => {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline) - new Date(b.deadline);
            });
            break;
    }

    renderFilteredGoals(filteredGoals);
}

function renderFilteredGoals(filteredGoals) {
    const timelineContainer = document.getElementById('timelineContainer');
    const emptyState = document.getElementById('emptyState');

    if (filteredGoals.length === 0) {
        timelineContainer.innerHTML = '<div class="empty-state"><p>🔍 No se encontraron metas con esos criterios.</p><p>Intenta ajustar los filtros.</p></div>';
        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }

    timelineContainer.innerHTML = filteredGoals.map(goal => renderGoalCard(goal)).join('');
}

function renderGoals() {
    try {
        const timelineContainer = document.getElementById('timelineContainer');
        const emptyState = document.getElementById('emptyState');

        if (goals.length === 0) {
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            timelineContainer.innerHTML = '<div class="empty-state" id="emptyState"><p>📽️ Aún no has creado ninguna meta.</p><p>¡Comienza tu película de vida ahora!</p></div>';
            return;
        }

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        applyFilters();
    } catch (error) {
        console.error('Error al renderizar metas:', error);
    }
}

function renderGoalCard(goal) {
    const categoryIcon = getCategoryIcon(goal.category);
    const priorityColor = getPriorityColor(goal.priority);
    const countdownHtml = goal.deadline ? getCountdownHtml(goal.deadline) : '';
    
    return `
        <div class="goal-card" style="border-left-color: ${priorityColor};">
            <div class="goal-header">
                <h3 class="goal-title">${categoryIcon} ${escapeHtml(goal.title)}</h3>
                <div class="goal-actions">
                    <button class="btn-icon" onclick="openNotesModal(${goal.id})" title="Notas">📝</button>
                    <button class="btn-icon" onclick="editGoal(${goal.id})" title="Editar">✏️</button>
                    <button class="btn-icon" onclick="deleteGoal(${goal.id})" title="Eliminar">🗑️</button>
                </div>
            </div>
            <p class="goal-description">${escapeHtml(goal.description)}</p>
            <div class="goal-meta">
                <span class="meta-item">
                    ${goal.emotion}
                </span>
                <span class="meta-item">
                    📅 ${formatDate(goal.createdAt)}
                </span>
                <span class="meta-item">
                    ${goal.priority}
                </span>
                ${goal.notes && goal.notes.length > 0 ? `<span class="meta-item">📝 ${goal.notes.length} nota${goal.notes.length > 1 ? 's' : ''}</span>` : ''}
            </div>
            ${countdownHtml}
            ${goal.visualization ? `
                <div class="goal-visualization">
                    💭 ${escapeHtml(goal.visualization)}
                </div>
            ` : ''}
            <div class="progress-bar-container">
                <div class="progress-bar ${goal.progress === 100 ? 'completed' : ''}" style="width: ${goal.progress}%"></div>
            </div>
            <p class="progress-text">${goal.progress}% completado ${goal.progress === 100 ? '🎉' : ''}</p>
        </div>
    `;
}

function getCategoryIcon(category) {
    const icons = {
        'Salud': '💪',
        'Carrera': '💼',
        'Relaciones': '❤️',
        'Finanzas': '💰',
        'Desarrollo': '📚',
        'Hobbies': '🎨',
        'Otro': '🌟'
    };
    return icons[category] || '🌟';
}

function getPriorityColor(priority) {
    const colors = {
        'Alta': '#ef5350',
        'Media': '#ffa726',
        'Baja': '#66bb6a'
    };
    return colors[priority] || '#ffa726';
}

function getCountdownHtml(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return `<div class="countdown urgent">⏰ Fecha límite pasada</div>`;
    } else if (diffDays === 0) {
        return `<div class="countdown urgent">⏰ Vence HOY</div>`;
    } else if (diffDays <= 7) {
        return `<div class="countdown urgent">⏰ ${diffDays} día${diffDays > 1 ? 's' : ''} restante${diffDays > 1 ? 's' : ''}</div>`;
    } else {
        return `<div class="countdown">⏰ ${diffDays} días restantes</div>`;
    }
}

function updateStats() {
    try {
        const totalGoals = goals.length;
        const completedGoals = goals.filter(g => g.progress === 100).length;
        const inProgressGoals = goals.filter(g => g.progress > 0 && g.progress < 100).length;
        const avgProgress = totalGoals > 0 
            ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / totalGoals)
            : 0;

        document.getElementById('totalGoals').textContent = totalGoals;
        document.getElementById('completedGoals').textContent = completedGoals;
        document.getElementById('inProgressGoals').textContent = inProgressGoals;
        document.getElementById('avgProgress').textContent = avgProgress + '%';
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
    }
}

function updateBadges() {
    try {
        const stats = {
            total: goals.length,
            completed: goals.filter(g => g.progress === 100).length,
            inProgress: goals.filter(g => g.progress > 0 && g.progress < 100).length,
            categories: new Set(goals.map(g => g.category)).size
        };

        const earnedBadges = badges.filter(badge => badge.condition(stats));
        const badgesContainer = document.getElementById('badgesContainer');
        const badgesSection = document.getElementById('badgesSection');

        if (earnedBadges.length === 0) {
            badgesSection.style.display = 'none';
            return;
        }

        badgesSection.style.display = 'block';
        badgesContainer.innerHTML = earnedBadges.map(badge => `
            <div class="badge">
                <span class="badge-icon">${badge.icon}</span>
                <span class="badge-text">${badge.name}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al actualizar badges:', error);
    }
}

function openNotesModal(goalId) {
    try {
        currentModalGoalId = goalId;
        const goal = goals.find(g => g.id === goalId);
        if (!goal) return;

        const modal = document.getElementById('notesModal');
        const modalTitle = document.getElementById('notesModalTitle');
        
        modalTitle.textContent = goal.title;
        renderNotes(goal.notes || []);
        modal.classList.add('active');
    } catch (error) {
        console.error('Error al abrir modal de notas:', error);
    }
}

function closeNotesModal() {
    const modal = document.getElementById('notesModal');
    modal.classList.remove('active');
    currentModalGoalId = null;
}

function addNoteToGoal() {
    try {
        const noteInput = document.getElementById('noteInput');
        const noteText = noteInput.value.trim();

        if (!noteText || !currentModalGoalId) return;

        const goalIndex = goals.findIndex(g => g.id === currentModalGoalId);
        if (goalIndex === -1) return;

        if (!goals[goalIndex].notes) {
            goals[goalIndex].notes = [];
        }

        goals[goalIndex].notes.push({
            id: Date.now(),
            text: noteText,
            createdAt: new Date().toISOString()
        });

        saveGoals();
        renderNotes(goals[goalIndex].notes);
        renderGoals();
        noteInput.value = '';
    } catch (error) {
        console.error('Error al agregar nota:', error);
    }
}

function deleteNote(goalId, noteId) {
    try {
        const goalIndex = goals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) return;

        goals[goalIndex].notes = goals[goalIndex].notes.filter(n => n.id !== noteId);
        saveGoals();
        renderNotes(goals[goalIndex].notes);
        renderGoals();
    } catch (error) {
        console.error('Error al eliminar nota:', error);
    }
}

function renderNotes(notes) {
    const notesList = document.getElementById('notesList');
    
    if (!notes || notes.length === 0) {
        notesList.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center;">No hay notas aún.</p>';
        return;
    }

    notesList.innerHTML = notes.map(note => `
        <div class="note-item">
            <div class="note-header">
                <span class="note-date">${formatDate(note.createdAt)}</span>
                <button class="note-delete" onclick="deleteNote(${currentModalGoalId}, ${note.id})">🗑️</button>
            </div>
            <p class="note-text">${escapeHtml(note.text)}</p>
        </div>
    `).join('');
}

function exportData() {
    try {
        const data = {
            goals,
            theme: currentTheme,
            exportDate: new Date().toISOString(),
            version: '2.0'
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `lifemovie-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert('✅ Datos exportados exitosamente!');
    } catch (error) {
        console.error('Error al exportar datos:', error);
        alert('❌ Error al exportar datos.');
    }
}

function importData(event) {
    try {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.goals || !Array.isArray(data.goals)) {
                    alert('❌ Formato de archivo inválido.');
                    return;
                }

                if (confirm('⚠️ Esto reemplazará todos tus datos actuales. ¿Continuar?')) {
                    goals = data.goals;
                    if (data.theme) {
                        currentTheme = data.theme;
                        document.body.setAttribute('data-theme', currentTheme);
                        updateThemeIcon();
                    }
                    
                    saveGoals();
                    renderGoals();
                    updateStats();
                    updateBadges();
                    alert('✅ Datos importados exitosamente!');
                }
            } catch (error) {
                console.error('Error al parsear archivo:', error);
                alert('❌ Error al leer el archivo.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    } catch (error) {
        console.error('Error al importar datos:', error);
        alert('❌ Error al importar datos.');
    }
}

function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function animateParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168, 197, 230, ${particle.opacity})`;
            ctx.fill();
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        });
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const confettiCount = 150;
    const colors = ['#a8c5e6', '#c8b8db', '#b8e6d5', '#ffd700', '#ff69b4', '#87ceeb'];

    confetti = [];
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: (Math.random() - 0.5) * 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }

    animateConfetti(ctx, canvas);
}

function animateConfetti(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti = confetti.filter(c => c.y < canvas.height);

    confetti.forEach(c => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
        ctx.restore();

        c.y += c.speedY;
        c.x += c.speedX;
        c.rotation += c.rotationSpeed;
    });

    if (confetti.length > 0) {
        requestAnimationFrame(() => animateConfetti(ctx, canvas));
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return 'Fecha no disponible';
    }
}

function saveGoals() {
    try {
        localStorage.setItem('lifeMovieGoals', JSON.stringify(goals));
    } catch (error) {
        console.error('Error al guardar metas:', error);
        alert('No se pudieron guardar las metas. Verifica el espacio de almacenamiento.');
    }
}

function loadGoals() {
    try {
        const savedGoals = localStorage.getItem('lifeMovieGoals');
        if (savedGoals) {
            goals = JSON.parse(savedGoals);
        }
    } catch (error) {
        console.error('Error al cargar metas:', error);
        goals = [];
    }
}

document.addEventListener('DOMContentLoaded', init);
