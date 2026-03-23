const pool = require('../config/database');

// Obtener todos los accesos/salidas
const getAccesos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT a.*, v.placa, v.tipo as tipo_vehiculo, v.marca, v.color
            FROM ACCESO_SALIDAS a 
            JOIN VEHICULO v ON a.VEHICULO_id = v.id
            ORDER BY a.fecha_hora DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener acceso por ID
const getAccesoById = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT a.*, v.placa, v.tipo as tipo_vehiculo, v.marca, v.color
            FROM ACCESO_SALIDAS a 
            JOIN VEHICULO v ON a.VEHICULO_id = v.id
            WHERE a.id = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener accesos por vehículo
const getAccesosByVehiculo = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM ACCESO_SALIDAS 
            WHERE VEHICULO_id = ?
            ORDER BY fecha_hora DESC
        `, [req.params.vehiculoId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener accesos por tipo de movimiento (Entrada/Salida)
const getAccesosByMovimiento = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT a.*, v.placa, v.tipo as tipo_vehiculo, v.marca, v.color
            FROM ACCESO_SALIDAS a 
            JOIN VEHICULO v ON a.VEHICULO_id = v.id
            WHERE a.movimiento = ?
            ORDER BY a.fecha_hora DESC
        `, [req.params.movimiento]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener accesos por rango de fechas
const getAccesosByFecha = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const [rows] = await pool.query(`
            SELECT a.*, v.placa, v.tipo as tipo_vehiculo, v.marca, v.color
            FROM ACCESO_SALIDAS a 
            JOIN VEHICULO v ON a.VEHICULO_id = v.id
            WHERE a.fecha_hora BETWEEN ? AND ?
            ORDER BY a.fecha_hora DESC
        `, [fechaInicio, fechaFin]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Registrar entrada
const registrarEntrada = async (req, res) => {
    try {
        const { puerta, VEHICULO_id } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO ACCESO_SALIDAS (movimiento, fecha_hora, puerta, tiempo_estadia, VEHICULO_id)
            VALUES ('Entrada', NOW(), ?, 0, ?)
        `, [puerta, VEHICULO_id]);
        
        res.status(201).json({ id: result.insertId, message: 'Entrada registrada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Registrar salida
const registrarSalida = async (req, res) => {
    try {
        const { puerta, tiempo_estadia, VEHICULO_id } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO ACCESO_SALIDAS (movimiento, fecha_hora, puerta, tiempo_estadia, VEHICULO_id)
            VALUES ('Salida', NOW(), ?, ?, ?)
        `, [puerta, tiempo_estadia || 0, VEHICULO_id]);
        
        res.status(201).json({ id: result.insertId, message: 'Salida registrada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear acceso genérico
const createAcceso = async (req, res) => {
    try {
        const { movimiento, puerta, tiempo_estadia, VEHICULO_id } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO ACCESO_SALIDAS (movimiento, fecha_hora, puerta, tiempo_estadia, VEHICULO_id)
            VALUES (?, NOW(), ?, ?, ?)
        `, [movimiento, puerta, tiempo_estadia || 0, VEHICULO_id]);
        
        res.status(201).json({ id: result.insertId, message: 'Acceso registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar acceso
const updateAcceso = async (req, res) => {
    try {
        const { id } = req.params;
        const { movimiento, fecha_hora, puerta, tiempo_estadia, VEHICULO_id } = req.body;
        
        const [result] = await pool.query(`
            UPDATE ACCESO_SALIDAS SET 
                movimiento = ?, fecha_hora = ?, puerta = ?, tiempo_estadia = ?, VEHICULO_id = ?
            WHERE id = ?
        `, [movimiento, fecha_hora, puerta, tiempo_estadia, VEHICULO_id, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Acceso actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar acceso
const deleteAcceso = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM ACCESO_SALIDAS WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Acceso eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAccesos,
    getAccesoById,
    getAccesosByVehiculo,
    getAccesosByMovimiento,
    getAccesosByFecha,
    registrarEntrada,
    registrarSalida,
    createAcceso,
    updateAcceso,
    deleteAcceso
};
