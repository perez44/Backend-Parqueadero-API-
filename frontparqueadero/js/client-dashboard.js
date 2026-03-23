// ========================================
// CLIENT DASHBOARD - MAIN SCRIPT
// ========================================

// ========================================
// STATE MANAGEMENT
// ========================================
let currentUser = null;
let currentFloor = 1;
let parkingCells = [];
let userVehicles = [];
let parkingHistory = [];

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    const session = getSession();
    if (!session) {
        window.location.href = '../index.html';
        return;
    }
    
    // Initialize user data
    await initializeUserData(session);
    
    // Load parking data
    await loadParkingData();
    
    // Close profile menu when clicking outside
    document.addEventListener('click', function(e) {
        const profileDropdown = document.querySelector('.profile-dropdown');
        const profileMenu = document.getElementById('profileMenu');
        
        if (profileDropdown && !profileDropdown.contains(e.target)) {
            profileMenu.classList.remove('active');
        }
    });
    
    // Auto-refresh parking data every 30 seconds
    setInterval(loadParkingData, 30000);
});

// ========================================
// SESSION MANAGEMENT
// ========================================
function getSession() {
    const session = localStorage.getItem('currentSession');
    return session ? JSON.parse(session) : null;
}

async function initializeUserData(session) {
    try {
        // Try to get user from API
        const userData = await API.usuarios.getById(session.userId);
        currentUser = userData;
    } catch (error) {
        console.warn('Could not fetch user from API, using session data:', error);
        // Use session data as fallback
        currentUser = {
            id_usuario: session.userId,
            nombre: session.fullName,
            correo: session.email || 'usuario@email.com',
            telefono: session.phone || '',
            tipo_documento: session.documentType || 'CC',
            documento: session.documentNumber
        };
    }
    
    updateUserUI();
}

function updateUserUI() {
    const name = currentUser.nombre || currentUser.fullName || 'Usuario';
    const email = currentUser.correo || currentUser.email || 'usuario@email.com';
    const initials = getInitials(name);
    
    // Update welcome message
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) {
        welcomeName.textContent = name.split(' ')[0]; // First name only
    }
    
    // Update avatar initials
    const avatarElements = ['avatarInitials', 'menuAvatarInitials', 'editAvatarInitials'];
    avatarElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = initials;
    });
    
    // Update profile info
    const profileName = document.getElementById('profileName');
    if (profileName) profileName.textContent = name;
    
    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) profileEmail.textContent = email;
}

function getInitials(name) {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

// ========================================
// PARKING DATA
// ========================================
async function loadParkingData() {
    try {
        // Load cells
        await loadCells();
        
        // Load user vehicles
        await loadUserVehicles();
        
        // Update stats
        updateStats();
        
        // Render parking map
        renderParkingMap();
        
        // Render vehicles preview
        renderVehiclesPreview();
        
    } catch (error) {
        console.error('Error loading parking data:', error);
        showAlert('No se pudo cargar los datos del parqueadero. Usando datos de ejemplo.', 'warning');
        
        // Use mock data if API fails
        loadMockData();
    }
}

async function loadCells() {
    try {
        const response = await API.celdas.getAll();
        parkingCells = response.data || response || [];
        
        // Normalize cell data
        parkingCells = parkingCells.map(cell => ({
            id: cell.id_celda || cell.id,
            codigo: cell.codigo || cell.code || `${cell.piso || 1}${cell.area || 'A'}${String(cell.numero || cell.id).padStart(2, '0')}`,
            piso: cell.piso || cell.floor || 1,
            area: cell.area || 'A',
            tipo: cell.tipo || cell.type || 'Carro',
            estado: cell.estado || cell.status || 'Libre',
            vehiculoId: cell.VEHICULO_id || cell.vehiculoId || null
        }));
    } catch (error) {
        console.error('Error loading cells:', error);
        throw error;
    }
}

async function loadUserVehicles() {
    if (!currentUser) {
        userVehicles = [];
        return;
    }
    
    try {
        const userId = currentUser.id_usuario || currentUser.id;
        const documento = currentUser.documento || currentUser.documentNumber;
        
        // Intentar cargar vehículos por ID de usuario
        let response;
        try {
            response = await API.vehiculos.getByUsuario(userId);
        } catch (e) {
            console.warn('Could not load by userId, trying alternative methods');
            // Si falla, intentar obtener todos y filtrar por documento/usuario
            const allVehicles = await API.vehiculos.getAll();
            const vehicleList = allVehicles.data || allVehicles || [];
            response = vehicleList.filter(v => 
                v.USUARIO_id_usuario === userId || 
                v.usuario_id === userId ||
                v.ownerId === userId
            );
        }
        
        const vehicleData = response.data || response || [];
        
        // Normalize vehicle data - solo vehículos reales del usuario
        userVehicles = vehicleData.map(v => ({
            id: v.id_vehiculo || v.id,
            placa: v.placa || v.plate,
            color: v.color,
            marca: v.marca || v.brand,
            modelo: v.modelo || v.model,
            tipo: v.tipo || v.type || 'Carro',
            usuarioId: v.USUARIO_id_usuario || v.usuario_id || v.ownerId
        }));
        
        console.log(`Vehículos cargados para usuario ${documento}:`, userVehicles.length);
    } catch (error) {
        console.error('Error loading user vehicles:', error);
        userVehicles = []; // Sin vehículos mock, solo datos reales
    }
}

function loadMockData() {
    // Generate mock cells - solo celdas, sin vehículos mock
    parkingCells = [];
    const areas = ['A', 'B'];
    let id = 1;
    
    for (let floor = 1; floor <= 3; floor++) {
        for (const area of areas) {
            for (let i = 1; i <= 10; i++) {
                const isMoto = i > 8;
                parkingCells.push({
                    id: id,
                    codigo: `${floor}${area}${String(i).padStart(2, '0')}`,
                    piso: floor,
                    area: area,
                    tipo: isMoto ? 'Moto' : 'Carro',
                    estado: 'Libre',
                    vehiculoId: null
                });
                id++;
            }
        }
    }
    
    // No mock vehicles - solo mostrar vehículos reales del usuario desde la API
    // userVehicles se carga desde la API con la cédula del usuario
    
    updateStats();
    renderParkingMap();
    renderVehiclesPreview();
}

// ========================================
// STATS
// ========================================
function updateStats() {
    const currentFloorCells = parkingCells.filter(c => c.piso === currentFloor);
    
    const available = currentFloorCells.filter(c => c.estado === 'Libre' || c.estado === 'Disponible').length;
    const occupied = currentFloorCells.filter(c => c.estado === 'Ocupado').length;
    const carCells = currentFloorCells.filter(c => c.tipo === 'Carro').length;
    const motoCells = currentFloorCells.filter(c => c.tipo === 'Moto').length;
    
    document.getElementById('statAvailable').textContent = available;
    document.getElementById('statOccupied').textContent = occupied;
    document.getElementById('statCars').textContent = carCells;
    document.getElementById('statMotos').textContent = motoCells;
}

// ========================================
// FLOOR SELECTION
// ========================================
function selectFloor(floor) {
    currentFloor = floor;
    
    // Update tabs
    document.querySelectorAll('.floor-tab').forEach(tab => {
        tab.classList.toggle('active', parseInt(tab.dataset.floor) === floor);
    });
    
    // Update stats and map
    updateStats();
    renderParkingMap();
}

// ========================================
// PARKING MAP RENDERING
// ========================================
function renderParkingMap() {
    const areaA = document.getElementById('parkingGridAreaA');
    const areaB = document.getElementById('parkingGridAreaB');
    const areaACount = document.getElementById('areaACount');
    const areaBCount = document.getElementById('areaBCount');
    
    if (!areaA || !areaB) return;
    
    areaA.innerHTML = '';
    areaB.innerHTML = '';
    
    const floorCells = parkingCells.filter(c => c.piso === currentFloor);
    const cellsAreaA = floorCells.filter(c => c.area === 'A');
    const cellsAreaB = floorCells.filter(c => c.area === 'B');
    
    // Update area counts
    const availableA = cellsAreaA.filter(c => c.estado === 'Libre' || c.estado === 'Disponible').length;
    const availableB = cellsAreaB.filter(c => c.estado === 'Libre' || c.estado === 'Disponible').length;
    
    if (areaACount) areaACount.textContent = `${availableA} disponibles`;
    if (areaBCount) areaBCount.textContent = `${availableB} disponibles`;
    
    renderCellsHTML(areaA, cellsAreaA);
    renderCellsHTML(areaB, cellsAreaB);
}

function renderCellsHTML(container, cells) {
    cells.forEach((cell) => {
        // Determine cell status
        const isAvailable = cell.estado === 'Libre' || cell.estado === 'Disponible';
        const isMyVehicle = userVehicles.some(v => v.id === cell.vehiculoId);
        const isMoto = cell.tipo === 'Moto';
        
        // Build class list
        let cellClasses = ['parking-cell-modern'];
        if (!isAvailable && isMyVehicle) {
            cellClasses.push('my-vehicle');
        } else if (!isAvailable) {
            cellClasses.push('occupied');
        } else if (isMoto) {
            cellClasses.push('available', 'moto-cell');
        } else {
            cellClasses.push('available');
        }
        
        // Create cell element
        const cellDiv = document.createElement('div');
        cellDiv.className = cellClasses.join(' ');
        cellDiv.dataset.cellId = cell.id;
        cellDiv.onclick = () => showCellDetail(cell);
        
        // Determine icon and status text
        let iconSVG, statusText;
        
        if (!isAvailable) {
            if (isMoto) {
                iconSVG = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="5" cy="17" r="3"/>
                        <circle cx="19" cy="17" r="3"/>
                        <path d="M9 17h6l3-8h-3l-2-4H7l-2 4"/>
                    </svg>
                `;
            } else {
                iconSVG = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                        <circle cx="6.5" cy="16.5" r="2.5"/>
                        <circle cx="16.5" cy="16.5" r="2.5"/>
                    </svg>
                `;
            }
            statusText = isMyVehicle ? 'Mi Auto' : 'Ocupado';
        } else {
            if (isMoto) {
                iconSVG = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="5" cy="17" r="3"/>
                        <circle cx="19" cy="17" r="3"/>
                        <path d="M9 17h6l3-8h-3l-2-4H7l-2 4"/>
                    </svg>
                `;
            } else {
                iconSVG = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                `;
            }
            statusText = 'Libre';
        }
        
        cellDiv.innerHTML = `
            <span class="cell-type-badge">${isMoto ? 'MOTO' : 'CARRO'}</span>
            <span class="cell-status-modern">${statusText}</span>
            <div class="cell-icon-modern">
                ${iconSVG}
            </div>
            <span class="cell-code-modern">${cell.codigo}</span>
        `;
        
        container.appendChild(cellDiv);
    });
}

// ========================================
// CELL DETAIL
// ========================================
function showCellDetail(cell) {
    const modal = document.getElementById('cellDetailModal');
    const title = document.getElementById('cellDetailTitle');
    const content = document.getElementById('cellDetailContent');
    
    title.textContent = `Celda ${cell.codigo}`;
    
    const isAvailable = cell.estado === 'Libre' || cell.estado === 'Disponible';
    const isMyVehicle = userVehicles.some(v => v.id === cell.vehiculoId);
    const vehicle = userVehicles.find(v => v.id === cell.vehiculoId);
    
    content.innerHTML = `
        <div class="cell-detail-grid">
            <div class="cell-detail-item">
                <label>Código</label>
                <span>${cell.codigo}</span>
            </div>
            <div class="cell-detail-item">
                <label>Piso</label>
                <span>${cell.piso}</span>
            </div>
            <div class="cell-detail-item">
                <label>Área</label>
                <span>${cell.area}</span>
            </div>
            <div class="cell-detail-item">
                <label>Tipo</label>
                <span>${cell.tipo}</span>
            </div>
            <div class="cell-detail-item">
                <label>Estado</label>
                <span class="badge ${isAvailable ? 'badge-success' : 'badge-danger'}">
                    ${isAvailable ? 'Disponible' : 'Ocupado'}
                </span>
            </div>
            ${!isAvailable && isMyVehicle && vehicle ? `
                <div class="cell-detail-item">
                    <label>Tu Vehículo</label>
                    <span>${vehicle.placa}</span>
                </div>
            ` : ''}
        </div>
        ${isMyVehicle ? `
            <div class="alert alert-info" style="margin-top: 1rem;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>Este es tu vehículo estacionado</span>
            </div>
        ` : ''}
    `;
    
    modal.classList.add('active');
}

function closeCellDetailModal() {
    document.getElementById('cellDetailModal').classList.remove('active');
}

// ========================================
// VEHICLES
// ========================================
function renderVehiclesPreview() {
    const grid = document.getElementById('myVehiclesGrid');
    if (!grid) return;
    
    const documento = currentUser?.documento || currentUser?.documentNumber || 'tu cédula';
    
    if (userVehicles.length === 0) {
        grid.innerHTML = `
            <div class="vehicle-card-placeholder" style="grid-column: 1 / -1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                    <circle cx="6.5" cy="16.5" r="2.5"/>
                    <circle cx="16.5" cy="16.5" r="2.5"/>
                </svg>
                <span style="font-size: 1rem; color: var(--text-secondary);">No tienes vehículos registrados</span>
                <span style="font-size: 0.85rem; color: var(--text-muted);">Cuando registres un vehículo con tu cédula (${documento}), aparecerá aquí.</span>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = userVehicles.map(vehicle => {
        const parkedCell = parkingCells.find(c => c.vehiculoId === vehicle.id && (c.estado === 'Ocupado'));
        const isParked = !!parkedCell;
        const isMoto = vehicle.tipo === 'Moto';
        
        return `
            <div class="vehicle-card">
                <div class="vehicle-card-header">
                    <div class="vehicle-icon ${isMoto ? 'moto' : ''}">
                        ${isMoto ? `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="5" cy="17" r="3"/>
                                <circle cx="19" cy="17" r="3"/>
                                <path d="M9 17h6l3-8h-3l-2-4H7l-2 4"/>
                            </svg>
                        ` : `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                                <circle cx="6.5" cy="16.5" r="2.5"/>
                                <circle cx="16.5" cy="16.5" r="2.5"/>
                            </svg>
                        `}
                    </div>
                    <div class="vehicle-plate">${vehicle.placa}</div>
                </div>
                <div class="vehicle-info">
                    <div class="vehicle-info-item">
                        <span>Marca:</span>
                        <span>${vehicle.marca || 'N/A'}</span>
                    </div>
                    <div class="vehicle-info-item">
                        <span>Modelo:</span>
                        <span>${vehicle.modelo || 'N/A'}</span>
                    </div>
                    <div class="vehicle-info-item">
                        <span>Color:</span>
                        <span>${vehicle.color || 'N/A'}</span>
                    </div>
                    <div class="vehicle-info-item">
                        <span>Tipo:</span>
                        <span>${vehicle.tipo}</span>
                    </div>
                </div>
                <div class="vehicle-status">
                    <span class="vehicle-status-badge ${isParked ? 'parked' : 'not-parked'}">
                        ${isParked ? '● Estacionado' : '○ No Estacionado'}
                    </span>
                    ${isParked ? `<span class="vehicle-cell">Celda: ${parkedCell.codigo}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// PROFILE MANAGEMENT
// ========================================
function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    menu.classList.toggle('active');
}

function openProfileModal() {
    toggleProfileMenu();
    
    // Fill form with current user data
    document.getElementById('editDocType').value = currentUser.tipo_documento || currentUser.documentType || 'CC';
    document.getElementById('editDocNumber').value = currentUser.documento || currentUser.documentNumber || '';
    document.getElementById('editFullName').value = currentUser.nombre || currentUser.fullName || '';
    document.getElementById('editEmail').value = currentUser.correo || currentUser.email || '';
    document.getElementById('editPhone').value = currentUser.telefono || currentUser.phone || '';
    
    document.getElementById('profileModal').classList.add('active');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('active');
}

async function saveProfile() {
    const userId = currentUser.id_usuario || currentUser.id;
    
    const updatedData = {
        tipo_documento: document.getElementById('editDocType').value,
        nombre: document.getElementById('editFullName').value,
        correo: document.getElementById('editEmail').value,
        telefono: document.getElementById('editPhone').value
    };
    
    try {
        await API.usuarios.update(userId, updatedData);
        
        // Update local user data
        currentUser = { ...currentUser, ...updatedData };
        updateUserUI();
        
        closeProfileModal();
        showAlert('Perfil actualizado correctamente', 'success');
    } catch (error) {
        console.error('Error updating profile:', error);
        showAlert('Error al actualizar el perfil: ' + error.message, 'danger');
    }
}

function changeProfilePhoto() {
    showAlert('Función de cambio de foto próximamente disponible', 'info');
}

// ========================================
// VEHICLES MODAL
// ========================================
function openVehiclesModal() {
    toggleProfileMenu();
    
    const list = document.getElementById('vehiclesList');
    const documento = currentUser?.documento || currentUser?.documentNumber || 'tu cédula';
    
    if (userVehicles.length === 0) {
        list.innerHTML = `
            <div class="vehicle-card-placeholder" style="padding: 3rem; text-align: center;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 64px; height: 64px; margin-bottom: 1rem;">
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                    <circle cx="6.5" cy="16.5" r="2.5"/>
                    <circle cx="16.5" cy="16.5" r="2.5"/>
                </svg>
                <p style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 0.5rem;">No tienes vehículos registrados</p>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Los vehículos registrados con tu cédula (${documento}) aparecerán aquí.</p>
            </div>
        `;
    } else {
        list.innerHTML = userVehicles.map(v => {
            const isMoto = v.tipo === 'Moto';
            return `
                <div class="vehicle-list-item">
                    <div class="vehicle-icon ${isMoto ? 'moto' : ''}">
                        ${isMoto ? `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="5" cy="17" r="3"/>
                                <circle cx="19" cy="17" r="3"/>
                                <path d="M9 17h6l3-8h-3l-2-4H7l-2 4"/>
                            </svg>
                        ` : `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                                <circle cx="6.5" cy="16.5" r="2.5"/>
                                <circle cx="16.5" cy="16.5" r="2.5"/>
                            </svg>
                        `}
                    </div>
                    <div class="vehicle-list-info">
                        <h4>${v.placa}</h4>
                        <p>${v.marca} ${v.modelo} - ${v.color}</p>
                    </div>
                    <span class="badge ${isMoto ? 'badge-info' : 'badge-primary'}">${v.tipo}</span>
                </div>
            `;
        }).join('');
    }
    
    document.getElementById('vehiclesModal').classList.add('active');
}

function closeVehiclesModal() {
    document.getElementById('vehiclesModal').classList.remove('active');
}

// ========================================
// HISTORY MODAL
// ========================================
async function openHistoryModal() {
    toggleProfileMenu();
    
    const list = document.getElementById('historyList');
    list.innerHTML = '<div class="loading"><div class="loading-spinner"></div>Cargando historial...</div>';
    
    document.getElementById('historyModal').classList.add('active');
    
    try {
        // Get history for each user vehicle
        let allHistory = [];
        
        for (const vehicle of userVehicles) {
            try {
                const response = await API.accesos.getByVehiculo(vehicle.id);
                const vehicleHistory = response.data || response || [];
                allHistory = allHistory.concat(vehicleHistory.map(h => ({
                    ...h,
                    vehiclePlate: vehicle.placa
                })));
            } catch (e) {
                console.warn(`Could not load history for vehicle ${vehicle.id}:`, e);
            }
        }
        
        // Sort by date (most recent first)
        allHistory.sort((a, b) => new Date(b.fecha_hora || b.fecha) - new Date(a.fecha_hora || a.fecha));
        
        renderHistory(allHistory.slice(0, 20)); // Show last 20 entries
    } catch (error) {
        console.error('Error loading history:', error);
        // Show mock history
        renderHistory(generateMockHistory());
    }
}

function renderHistory(history) {
    const list = document.getElementById('historyList');
    
    if (history.length === 0) {
        list.innerHTML = `
            <div class="vehicle-card-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>No hay historial de parqueo</span>
            </div>
        `;
        return;
    }
    
    list.innerHTML = history.map(h => {
        const isEntry = h.movimiento === 'Entrada' || h.tipo === 'entrada';
        const date = new Date(h.fecha_hora || h.fecha);
        
        return `
            <div class="history-item">
                <div class="history-icon ${isEntry ? 'entry' : 'exit'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${isEntry ? 
                            '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>' :
                            '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>'
                        }
                    </svg>
                </div>
                <div class="history-info">
                    <h4>${isEntry ? 'Entrada' : 'Salida'} - ${h.vehiclePlate || h.placa || 'Vehículo'}</h4>
                    <p>${h.puerta || 'Puerta Principal'}</p>
                </div>
                <div class="history-date">
                    ${date.toLocaleDateString('es-CO')}<br>
                    ${date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        `;
    }).join('');
}

function generateMockHistory() {
    const movements = [];
    const plates = userVehicles.map(v => v.placa);
    
    if (plates.length === 0) plates.push('ABC123');
    
    for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(i / 2));
        date.setHours(8 + Math.floor(Math.random() * 12));
        
        movements.push({
            movimiento: i % 2 === 0 ? 'Entrada' : 'Salida',
            fecha_hora: date.toISOString(),
            vehiclePlate: plates[Math.floor(Math.random() * plates.length)],
            puerta: `Puerta ${Math.floor(Math.random() * 2) + 1}`
        });
    }
    
    return movements;
}

function closeHistoryModal() {
    document.getElementById('historyModal').classList.remove('active');
}

// ========================================
// UTILITIES
// ========================================
function showAlert(message, type = 'info') {
    const container = document.getElementById('alertContainer');
    if (!container) return;
    
    const icons = {
        success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        danger: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
        warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
        info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
    };
    
    container.innerHTML = `
        <div class="alert alert-${type}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${icons[type] || icons.info}
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

function logout() {
    localStorage.removeItem('currentSession');
    window.location.href = '../index.html';
}

// Close modals on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProfileModal();
        closeVehiclesModal();
        closeHistoryModal();
        closeCellDetailModal();
    }
});

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});
