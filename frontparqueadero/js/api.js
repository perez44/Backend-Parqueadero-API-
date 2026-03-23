// ========================================
// PARKING LOT - API CONNECTION
// ========================================

const API_BASE_URL = 'http://localhost:3000/api';

const API = {
    // ========================================
    // UTILITY METHODS
    // ========================================
    
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || data.message || 'Error en la solicitud');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // ========================================
    // USUARIOS
    // ========================================
    usuarios: {
        async getAll() {
            return API.request('/usuarios');
        },
        
        async getById(id) {
            return API.request(`/usuarios/${id}`);
        },
        
        async create(userData) {
            return API.request('/usuarios', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
        },
        
        async login(correo, contrasena) {
            return API.request('/usuarios/login', {
                method: 'POST',
                body: JSON.stringify({ correo, contrasena })
            });
        },
        
        async update(id, userData) {
            return API.request(`/usuarios/${id}`, {
                method: 'PUT',
                body: JSON.stringify(userData)
            });
        },
        
        async delete(id) {
            return API.request(`/usuarios/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // ========================================
    // VEHÍCULOS
    // ========================================
    vehiculos: {
        async getAll() {
            return API.request('/vehiculos');
        },
        
        async getById(id) {
            return API.request(`/vehiculos/${id}`);
        },
        
        async getByPlaca(placa) {
            return API.request(`/vehiculos/placa/${placa}`);
        },
        
        async getByUsuario(usuarioId) {
            return API.request(`/vehiculos/usuario/${usuarioId}`);
        },
        
        async create(vehiculoData) {
            return API.request('/vehiculos', {
                method: 'POST',
                body: JSON.stringify(vehiculoData)
            });
        },
        
        async update(id, vehiculoData) {
            return API.request(`/vehiculos/${id}`, {
                method: 'PUT',
                body: JSON.stringify(vehiculoData)
            });
        },
        
        async delete(id) {
            return API.request(`/vehiculos/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // ========================================
    // CELDAS
    // ========================================
    celdas: {
        async getAll() {
            return API.request('/celdas');
        },
        
        async getEstadisticas() {
            return API.request('/celdas/estadisticas');
        },
        
        async getById(id) {
            return API.request(`/celdas/${id}`);
        },
        
        async getByTipo(tipo) {
            return API.request(`/celdas/tipo/${tipo}`);
        },
        
        async getByEstado(estado) {
            return API.request(`/celdas/estado/${estado}`);
        },
        
        async create(celdaData) {
            return API.request('/celdas', {
                method: 'POST',
                body: JSON.stringify(celdaData)
            });
        },
        
        async update(id, celdaData) {
            return API.request(`/celdas/${id}`, {
                method: 'PUT',
                body: JSON.stringify(celdaData)
            });
        },
        
        async cambiarEstado(id, estado) {
            return API.request(`/celdas/${id}/estado`, {
                method: 'PATCH',
                body: JSON.stringify({ estado })
            });
        },
        
        async delete(id) {
            return API.request(`/celdas/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // ========================================
    // ACCESOS
    // ========================================
    accesos: {
        async getAll() {
            return API.request('/accesos');
        },
        
        async getById(id) {
            return API.request(`/accesos/${id}`);
        },
        
        async getByVehiculo(vehiculoId) {
            return API.request(`/accesos/vehiculo/${vehiculoId}`);
        },
        
        async getByMovimiento(movimiento) {
            return API.request(`/accesos/movimiento/${movimiento}`);
        },
        
        async getByFecha(fechaInicio, fechaFin) {
            return API.request(`/accesos/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
        },
        
        async registrarEntrada(data) {
            return API.request('/accesos/entrada', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async registrarSalida(data) {
            return API.request('/accesos/salida', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async create(accesoData) {
            return API.request('/accesos', {
                method: 'POST',
                body: JSON.stringify(accesoData)
            });
        },
        
        async update(id, accesoData) {
            return API.request(`/accesos/${id}`, {
                method: 'PUT',
                body: JSON.stringify(accesoData)
            });
        },
        
        async delete(id) {
            return API.request(`/accesos/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // ========================================
    // INCIDENCIAS
    // ========================================
    incidencias: {
        async getAll() {
            return API.request('/incidencias');
        },
        
        async getById(id) {
            return API.request(`/incidencias/${id}`);
        },
        
        async create(incidenciaData) {
            return API.request('/incidencias', {
                method: 'POST',
                body: JSON.stringify(incidenciaData)
            });
        },
        
        async update(id, incidenciaData) {
            return API.request(`/incidencias/${id}`, {
                method: 'PUT',
                body: JSON.stringify(incidenciaData)
            });
        },
        
        async delete(id) {
            return API.request(`/incidencias/${id}`, {
                method: 'DELETE'
            });
        },
        
        // Reportes de incidencias
        async getAllReportes() {
            return API.request('/incidencias/reportes/todos');
        },
        
        async getReportesByVehiculo(vehiculoId) {
            return API.request(`/incidencias/reportes/vehiculo/${vehiculoId}`);
        },
        
        async crearReporte(reporteData) {
            return API.request('/incidencias/reportes', {
                method: 'POST',
                body: JSON.stringify(reporteData)
            });
        },
        
        async deleteReporte(vehiculoId, incidenciaId) {
            return API.request(`/incidencias/reportes/${vehiculoId}/${incidenciaId}`, {
                method: 'DELETE'
            });
        }
    },

    // ========================================
    // PICO Y PLACA
    // ========================================
    picoPlaca: {
        async getAll() {
            return API.request('/pico-placa');
        },
        
        async verificar(placa, tipo_vehiculo) {
            return API.request(`/pico-placa/verificar?placa=${placa}&tipo_vehiculo=${tipo_vehiculo}`);
        },
        
        async getById(id) {
            return API.request(`/pico-placa/${id}`);
        },
        
        async getByDia(dia) {
            return API.request(`/pico-placa/dia/${dia}`);
        },
        
        async getByTipo(tipo) {
            return API.request(`/pico-placa/tipo/${tipo}`);
        },
        
        async create(reglaData) {
            return API.request('/pico-placa', {
                method: 'POST',
                body: JSON.stringify(reglaData)
            });
        },
        
        async update(id, reglaData) {
            return API.request(`/pico-placa/${id}`, {
                method: 'PUT',
                body: JSON.stringify(reglaData)
            });
        },
        
        async delete(id) {
            return API.request(`/pico-placa/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // ========================================
    // HISTORIAL DE PARQUEO
    // ========================================
    historialParqueo: {
        async getAll() {
            return API.request('/historial-parqueo');
        },
        
        async getByCelda(celdaId) {
            return API.request(`/historial-parqueo/celda/${celdaId}`);
        },
        
        async getByVehiculo(vehiculoId) {
            return API.request(`/historial-parqueo/vehiculo/${vehiculoId}`);
        },
        
        async crear(data) {
            return API.request('/historial-parqueo', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async delete(celdaId, vehiculoId) {
            return API.request(`/historial-parqueo/${celdaId}/${vehiculoId}`, {
                method: 'DELETE'
            });
        }
    },

    // ========================================
    // PERFILES
    // ========================================
    perfiles: {
        async getAll() {
            return API.request('/perfiles');
        },
        
        async getById(id) {
            return API.request(`/perfiles/${id}`);
        },
        
        async create(perfilData) {
            return API.request('/perfiles', {
                method: 'POST',
                body: JSON.stringify(perfilData)
            });
        },
        
        async update(id, perfilData) {
            return API.request(`/perfiles/${id}`, {
                method: 'PUT',
                body: JSON.stringify(perfilData)
            });
        },
        
        async delete(id) {
            return API.request(`/perfiles/${id}`, {
                method: 'DELETE'
            });
        }
    }
};

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
