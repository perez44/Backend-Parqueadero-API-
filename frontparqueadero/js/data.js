// ========================================
// PARKING LOT - DATA MANAGEMENT
// ========================================

const DataStore = {
    // Initialize default data
    init: function() {
        if (!localStorage.getItem('parkingLotInitialized')) {
            this.setDefaultData();
            localStorage.setItem('parkingLotInitialized', 'true');
        }
    },

    setDefaultData: function() {
        // Default Users
        const defaultUsers = [
            {
                id: 1,
                documentType: 'CC',
                documentNumber: '123456789',
                fullName: 'Administrador Principal',
                email: 'admin@parkinglot.com',
                phone: '3001234567',
                photo: null,
                userType: 'administrador',
                password: 'admin123',
                status: 'activo',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                documentType: 'CC',
                documentNumber: '987654321',
                fullName: 'Operador Sistema',
                email: 'operador@parkinglot.com',
                phone: '3009876543',
                photo: null,
                userType: 'operador',
                password: 'oper123',
                status: 'activo',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                documentType: 'CC',
                documentNumber: '111222333',
                fullName: 'Usuario Prueba',
                email: 'usuario@email.com',
                phone: '3001112223',
                photo: null,
                userType: 'usuario',
                password: null,
                status: 'activo',
                createdAt: new Date().toISOString()
            }
        ];

        // Default Vehicles
        const defaultVehicles = [
            {
                id: 1,
                plate: 'ABC123',
                color: 'Negro',
                brand: 'Toyota',
                model: 'Corolla',
                type: 'carro',
                ownerId: 3,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                plate: 'XYZ789',
                color: 'Blanco',
                brand: 'Honda',
                model: 'Civic',
                type: 'carro',
                ownerId: null,
                createdAt: new Date().toISOString()
            }
        ];

        // Default Parking Cells (3 floors, 20 cells each)
        const defaultCells = [];
        const areas = ['A', 'B'];
        let cellId = 1;
        
        for (let floor = 1; floor <= 3; floor++) {
            for (let area of areas) {
                for (let i = 1; i <= 10; i++) {
                    defaultCells.push({
                        id: cellId,
                        code: `${floor}${area}${String(i).padStart(2, '0')}`,
                        floor: floor,
                        area: area,
                        type: i <= 8 ? 'carro' : 'moto',
                        status: 'disponible',
                        vehicleId: null
                    });
                    cellId++;
                }
            }
        }

        // Default Restrictions (Pico y Placa)
        const defaultRestrictions = [
            { id: 1, day: 'Lunes', digits: ['5', '6'] },
            { id: 2, day: 'Martes', digits: ['7', '8'] },
            { id: 3, day: 'Miercoles', digits: ['9', '0'] },
            { id: 4, day: 'Jueves', digits: ['1', '2'] },
            { id: 5, day: 'Viernes', digits: ['3', '4'] }
        ];

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        localStorage.setItem('vehicles', JSON.stringify(defaultVehicles));
        localStorage.setItem('parkingCells', JSON.stringify(defaultCells));
        localStorage.setItem('restrictions', JSON.stringify(defaultRestrictions));
        localStorage.setItem('accessLogs', JSON.stringify([]));
        localStorage.setItem('incidents', JSON.stringify([]));
        localStorage.setItem('notifications', JSON.stringify([]));
        localStorage.setItem('userIdCounter', '4');
        localStorage.setItem('vehicleIdCounter', '3');
        localStorage.setItem('accessLogIdCounter', '1');
        localStorage.setItem('incidentIdCounter', '1');
    },

    // ========================================
    // USERS
    // ========================================
    getUsers: function() {
        return JSON.parse(localStorage.getItem('users')) || [];
    },

    getUserById: function(id) {
        const users = this.getUsers();
        return users.find(u => u.id === parseInt(id));
    },

    getUserByDocument: function(documentNumber) {
        const users = this.getUsers();
        return users.find(u => u.documentNumber === documentNumber);
    },

    createUser: function(userData) {
        const users = this.getUsers();
        let counter = parseInt(localStorage.getItem('userIdCounter')) || 1;
        
        const newUser = {
            id: counter,
            ...userData,
            status: 'activo',
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('userIdCounter', String(counter + 1));
        
        return newUser;
    },

    updateUser: function(id, userData) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === parseInt(id));
        
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            localStorage.setItem('users', JSON.stringify(users));
            return users[index];
        }
        return null;
    },

    updateUserStatus: function(id, status) {
        return this.updateUser(id, { status });
    },

    // ========================================
    // VEHICLES
    // ========================================
    getVehicles: function() {
        return JSON.parse(localStorage.getItem('vehicles')) || [];
    },

    getVehicleById: function(id) {
        const vehicles = this.getVehicles();
        return vehicles.find(v => v.id === parseInt(id));
    },

    getVehicleByPlate: function(plate) {
        const vehicles = this.getVehicles();
        return vehicles.find(v => v.plate.toUpperCase() === plate.toUpperCase());
    },

    getVehiclesByOwner: function(ownerId) {
        const vehicles = this.getVehicles();
        return vehicles.filter(v => v.ownerId === parseInt(ownerId));
    },

    createVehicle: function(vehicleData) {
        const vehicles = this.getVehicles();
        let counter = parseInt(localStorage.getItem('vehicleIdCounter')) || 1;
        
        const newVehicle = {
            id: counter,
            ...vehicleData,
            createdAt: new Date().toISOString()
        };
        
        vehicles.push(newVehicle);
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        localStorage.setItem('vehicleIdCounter', String(counter + 1));
        
        return newVehicle;
    },

    updateVehicle: function(id, vehicleData) {
        const vehicles = this.getVehicles();
        const index = vehicles.findIndex(v => v.id === parseInt(id));
        
        if (index !== -1) {
            vehicles[index] = { ...vehicles[index], ...vehicleData };
            localStorage.setItem('vehicles', JSON.stringify(vehicles));
            return vehicles[index];
        }
        return null;
    },

    assignVehicleToUser: function(vehicleId, userId) {
        return this.updateVehicle(vehicleId, { ownerId: userId });
    },

    // ========================================
    // PARKING CELLS
    // ========================================
    getParkingCells: function() {
        return JSON.parse(localStorage.getItem('parkingCells')) || [];
    },

    getCellById: function(id) {
        const cells = this.getParkingCells();
        return cells.find(c => c.id === parseInt(id));
    },

    getCellsByFloor: function(floor) {
        const cells = this.getParkingCells();
        return cells.filter(c => c.floor === parseInt(floor));
    },

    getCellsByArea: function(area) {
        const cells = this.getParkingCells();
        return cells.filter(c => c.area === area);
    },

    getAvailableCells: function() {
        const cells = this.getParkingCells();
        return cells.filter(c => c.status === 'disponible');
    },

    getOccupiedCells: function() {
        const cells = this.getParkingCells();
        return cells.filter(c => c.status === 'ocupado');
    },

    updateCellStatus: function(id, status, vehicleId = null) {
        const cells = this.getParkingCells();
        const index = cells.findIndex(c => c.id === parseInt(id));
        
        if (index !== -1) {
            cells[index].status = status;
            cells[index].vehicleId = vehicleId;
            localStorage.setItem('parkingCells', JSON.stringify(cells));
            return cells[index];
        }
        return null;
    },

    // ========================================
    // ACCESS LOGS
    // ========================================
    getAccessLogs: function() {
        return JSON.parse(localStorage.getItem('accessLogs')) || [];
    },

    getEntryLogs: function() {
        const logs = this.getAccessLogs();
        return logs.filter(l => l.type === 'entrada');
    },

    getExitLogs: function() {
        const logs = this.getAccessLogs();
        return logs.filter(l => l.type === 'salida');
    },

    getActiveEntries: function() {
        const logs = this.getAccessLogs();
        return logs.filter(l => l.type === 'entrada' && !l.exitTime);
    },

    createAccessLog: function(logData) {
        const logs = this.getAccessLogs();
        let counter = parseInt(localStorage.getItem('accessLogIdCounter')) || 1;
        
        const newLog = {
            id: counter,
            ...logData,
            timestamp: new Date().toISOString()
        };
        
        logs.push(newLog);
        localStorage.setItem('accessLogs', JSON.stringify(logs));
        localStorage.setItem('accessLogIdCounter', String(counter + 1));
        
        return newLog;
    },

    registerEntry: function(plate, gate) {
        // Check restrictions
        if (this.isPlateRestricted(plate)) {
            return { success: false, message: 'Vehiculo con restriccion de pico y placa' };
        }

        const activeEntry = this.getAccessLogs().find(
            l => l.plate.toUpperCase() === plate.toUpperCase() && l.type === 'entrada' && !l.exitTime
        );

        if (activeEntry) {
            return { success: false, message: 'Este vehiculo ya tiene una entrada activa' };
        }

        const log = this.createAccessLog({
            type: 'entrada',
            plate: plate.toUpperCase(),
            gate: gate,
            entryTime: new Date().toISOString(),
            exitTime: null,
            duration: null
        });

        return { success: true, data: log };
    },

    registerExit: function(plate, gate) {
        const logs = this.getAccessLogs();
        const entryIndex = logs.findIndex(
            l => l.plate.toUpperCase() === plate.toUpperCase() && l.type === 'entrada' && !l.exitTime
        );

        if (entryIndex === -1) {
            return { success: false, message: 'No se encontro entrada activa para este vehiculo' };
        }

        const exitTime = new Date();
        const entryTime = new Date(logs[entryIndex].entryTime);
        const duration = Math.round((exitTime - entryTime) / 1000 / 60); // Duration in minutes

        logs[entryIndex].exitTime = exitTime.toISOString();
        logs[entryIndex].duration = duration;

        // Create exit log
        this.createAccessLog({
            type: 'salida',
            plate: plate.toUpperCase(),
            gate: gate,
            entryTime: logs[entryIndex].entryTime,
            exitTime: exitTime.toISOString(),
            duration: duration
        });

        localStorage.setItem('accessLogs', JSON.stringify(logs));

        return { success: true, duration: duration };
    },

    // ========================================
    // RESTRICTIONS (Pico y Placa)
    // ========================================
    getRestrictions: function() {
        return JSON.parse(localStorage.getItem('restrictions')) || [];
    },

    updateRestriction: function(id, digits) {
        const restrictions = this.getRestrictions();
        const index = restrictions.findIndex(r => r.id === parseInt(id));
        
        if (index !== -1) {
            restrictions[index].digits = digits;
            localStorage.setItem('restrictions', JSON.stringify(restrictions));
            return restrictions[index];
        }
        return null;
    },

    isPlateRestricted: function(plate) {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        const today = days[new Date().getDay()];
        const restrictions = this.getRestrictions();
        const todayRestriction = restrictions.find(r => r.day === today);
        
        if (!todayRestriction) return false;
        
        const lastDigit = plate.slice(-1);
        return todayRestriction.digits.includes(lastDigit);
    },

    getRestrictedVehiclesForDay: function(day) {
        const restrictions = this.getRestrictions();
        const dayRestriction = restrictions.find(r => r.day === day);
        
        if (!dayRestriction) return [];
        
        const vehicles = this.getVehicles();
        return vehicles.filter(v => {
            const lastDigit = v.plate.slice(-1);
            return dayRestriction.digits.includes(lastDigit);
        });
    },

    // ========================================
    // INCIDENTS
    // ========================================
    getIncidents: function() {
        return JSON.parse(localStorage.getItem('incidents')) || [];
    },

    createIncident: function(incidentData) {
        const incidents = this.getIncidents();
        let counter = parseInt(localStorage.getItem('incidentIdCounter')) || 1;
        
        const newIncident = {
            id: counter,
            code: `INC-${String(counter).padStart(5, '0')}`,
            ...incidentData,
            createdAt: new Date().toISOString()
        };
        
        incidents.push(newIncident);
        localStorage.setItem('incidents', JSON.stringify(incidents));
        localStorage.setItem('incidentIdCounter', String(counter + 1));
        
        return newIncident;
    },

    // ========================================
    // NOTIFICATIONS
    // ========================================
    getNotifications: function() {
        return JSON.parse(localStorage.getItem('notifications')) || [];
    },

    createNotification: function(message, type = 'info') {
        const notifications = this.getNotifications();
        const newNotification = {
            id: Date.now(),
            message: message,
            type: type,
            read: false,
            createdAt: new Date().toISOString()
        };
        
        notifications.unshift(newNotification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        return newNotification;
    },

    // ========================================
    // STATISTICS
    // ========================================
    getStats: function() {
        const users = this.getUsers();
        const vehicles = this.getVehicles();
        const cells = this.getParkingCells();
        const incidents = this.getIncidents();
        const activeEntries = this.getActiveEntries();

        return {
            totalUsers: users.length,
            activeUsers: users.filter(u => u.status === 'activo').length,
            totalVehicles: vehicles.length,
            totalCells: cells.length,
            availableCells: cells.filter(c => c.status === 'disponible').length,
            occupiedCells: cells.filter(c => c.status === 'ocupado').length,
            totalIncidents: incidents.length,
            vehiclesInside: activeEntries.length
        };
    },

    // Get most used cells in a time range
    getMostUsedCells: function(startDate, endDate) {
        const logs = this.getAccessLogs();
        const cellUsage = {};

        logs.forEach(log => {
            const logDate = new Date(log.timestamp);
            if (logDate >= new Date(startDate) && logDate <= new Date(endDate)) {
                if (!cellUsage[log.cellId]) {
                    cellUsage[log.cellId] = 0;
                }
                cellUsage[log.cellId]++;
            }
        });

        return Object.entries(cellUsage)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
    },

    // Get vehicles that use parking most
    getMostFrequentVehicles: function() {
        const logs = this.getAccessLogs().filter(l => l.type === 'entrada');
        const vehicleUsage = {};

        logs.forEach(log => {
            if (!vehicleUsage[log.plate]) {
                vehicleUsage[log.plate] = 0;
            }
            vehicleUsage[log.plate]++;
        });

        return Object.entries(vehicleUsage)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
    },

    // Get peak hours
    getPeakHours: function() {
        const logs = this.getAccessLogs().filter(l => l.type === 'entrada');
        const hourUsage = {};

        logs.forEach(log => {
            const hour = new Date(log.timestamp).getHours();
            if (!hourUsage[hour]) {
                hourUsage[hour] = 0;
            }
            hourUsage[hour]++;
        });

        return Object.entries(hourUsage)
            .sort((a, b) => b[1] - a[1]);
    },

    // Get occupancy by date
    getOccupancyByDate: function(date) {
        const logs = this.getAccessLogs();
        const targetDate = new Date(date).toDateString();

        const entries = logs.filter(l => 
            l.type === 'entrada' && 
            new Date(l.timestamp).toDateString() === targetDate
        );

        return entries.length;
    }
};

// Initialize data on load
DataStore.init();
