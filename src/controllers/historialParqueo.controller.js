const pool = require('../config/database');

// Obtener todo el historial de parqueo
const getHistorialParqueo = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT hp.*, c.tipo as celda_tipo, c.estado as celda_estado,
                   v.placa, v.marca, v.color, v.tipo as vehiculo_tipo
            FROM HISTORIAL_PARQUEO hp
            JOIN CELDA c ON hp.CELDA_id = c.id
            JOIN VEHICULO v ON hp.VEHICULO_id = v.id
            ORDER BY hp.fecha_hora DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener historial por celda
const getHistorialByCelda = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT hp.*, v.placa, v.marca, v.color
            FROM HISTORIAL_PARQUEO hp
            JOIN VEHICULO v ON hp.VEHICULO_id = v.id
            WHERE hp.CELDA_id = ?
            ORDER BY hp.fecha_hora DESC
        `, [req.params.celdaId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener historial por vehículo
const getHistorialByVehiculo = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT hp.*, c.tipo as celda_tipo
            FROM HISTORIAL_PARQUEO hp
            JOIN CELDA c ON hp.CELDA_id = c.id
            WHERE hp.VEHICULO_id = ?
            ORDER BY hp.fecha_hora DESC
        `, [req.params.vehiculoId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear registro de historial
const createHistorialParqueo = async (req, res) => {
    try {
        const { CELDA_id, VEHICULO_id } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO HISTORIAL_PARQUEO (CELDA_id, VEHICULO_id, fecha_hora)
            VALUES (?, ?, NOW())
        `, [CELDA_id, VEHICULO_id]);
        
        // Actualizar estado de la celda a Ocupado
        await pool.query(`UPDATE CELDA SET estado = 'Ocupado' WHERE id = ?`, [CELDA_id]);
        
        res.status(201).json({ message: 'Historial de parqueo registrado y celda ocupada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar registro de historial
const deleteHistorialParqueo = async (req, res) => {
    try {
        const { celdaId, vehiculoId } = req.params;
        
        const [result] = await pool.query(`
            DELETE FROM HISTORIAL_PARQUEO 
            WHERE CELDA_id = ? AND VEHICULO_id = ?
        `, [celdaId, vehiculoId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        
        // Liberar la celda
        await pool.query(`UPDATE CELDA SET estado = 'Libre' WHERE id = ?`, [celdaId]);
        
        res.json({ message: 'Historial eliminado y celda liberada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getHistorialParqueo,
    getHistorialByCelda,
    getHistorialByVehiculo,
    createHistorialParqueo,
    deleteHistorialParqueo
};
