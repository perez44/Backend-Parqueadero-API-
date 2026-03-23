const pool = require('../config/database');

// Obtener todas las incidencias
const getIncidencias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM INCIDENCIA');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener incidencia por ID
const getIncidenciaById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM INCIDENCIA WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Incidencia no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear incidencia
const createIncidencia = async (req, res) => {
    try {
        const { nombre } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO INCIDENCIA (nombre) VALUES (?)
        `, [nombre]);
        
        res.status(201).json({ id: result.insertId, message: 'Incidencia creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar incidencia
const updateIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        
        const [result] = await pool.query(`
            UPDATE INCIDENCIA SET nombre = ? WHERE id = ?
        `, [nombre, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Incidencia no encontrada' });
        }
        res.json({ message: 'Incidencia actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar incidencia
const deleteIncidencia = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM INCIDENCIA WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Incidencia no encontrada' });
        }
        res.json({ message: 'Incidencia eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== REPORTES DE INCIDENCIA ====================

// Obtener todos los reportes de incidencia
const getReportesIncidencia = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT ri.*, v.placa, v.marca, v.color, i.nombre as incidencia_nombre
            FROM REPORTE_INCIDENCIA ri
            JOIN VEHICULO v ON ri.VEHICULO_id = v.id
            JOIN INCIDENCIA i ON ri.INCIDENCIA_id = i.id
            ORDER BY ri.fecha_hora DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener reportes por vehículo
const getReportesByVehiculo = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT ri.*, i.nombre as incidencia_nombre
            FROM REPORTE_INCIDENCIA ri
            JOIN INCIDENCIA i ON ri.INCIDENCIA_id = i.id
            WHERE ri.VEHICULO_id = ?
            ORDER BY ri.fecha_hora DESC
        `, [req.params.vehiculoId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear reporte de incidencia
const createReporteIncidencia = async (req, res) => {
    try {
        const { VEHICULO_id, INCIDENCIA_id } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO REPORTE_INCIDENCIA (VEHICULO_id, INCIDENCIA_id, fecha_hora)
            VALUES (?, ?, NOW())
        `, [VEHICULO_id, INCIDENCIA_id]);
        
        res.status(201).json({ message: 'Reporte de incidencia creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar reporte de incidencia
const deleteReporteIncidencia = async (req, res) => {
    try {
        const { vehiculoId, incidenciaId } = req.params;
        const [result] = await pool.query(`
            DELETE FROM REPORTE_INCIDENCIA 
            WHERE VEHICULO_id = ? AND INCIDENCIA_id = ?
        `, [vehiculoId, incidenciaId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }
        res.json({ message: 'Reporte eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getIncidencias,
    getIncidenciaById,
    createIncidencia,
    updateIncidencia,
    deleteIncidencia,
    getReportesIncidencia,
    getReportesByVehiculo,
    createReporteIncidencia,
    deleteReporteIncidencia
};
