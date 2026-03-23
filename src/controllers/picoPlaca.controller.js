const pool = require('../config/database');

// Obtener todas las reglas de pico y placa
const getPicoPlaca = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM PICO_PLACA ORDER BY dia, numero');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener pico y placa por ID
const getPicoPlacaById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM PICO_PLACA WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener pico y placa por día
const getPicoPlacaByDia = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM PICO_PLACA WHERE dia = ?', [req.params.dia]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener pico y placa por tipo de vehículo
const getPicoPlacaByTipo = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM PICO_PLACA WHERE tipo_vehiculo = ?', [req.params.tipo]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verificar si una placa tiene pico y placa hoy
const verificarPicoPlaca = async (req, res) => {
    try {
        const { placa, tipo_vehiculo } = req.query;
        
        // Obtener el último dígito de la placa
        const ultimoDigito = placa.slice(-1);
        
        // Obtener el día actual en español
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        const diaActual = dias[new Date().getDay()];
        
        const [rows] = await pool.query(`
            SELECT * FROM PICO_PLACA 
            WHERE numero = ? AND dia = ? AND tipo_vehiculo = ?
        `, [ultimoDigito, diaActual, tipo_vehiculo || 'Carro']);
        
        const tienePicoPlaca = rows.length > 0;
        
        res.json({
            placa,
            ultimoDigito,
            diaActual,
            tipo_vehiculo: tipo_vehiculo || 'Carro',
            tienePicoPlaca,
            mensaje: tienePicoPlaca 
                ? `El vehículo con placa ${placa} tiene pico y placa hoy (${diaActual})`
                : `El vehículo con placa ${placa} NO tiene pico y placa hoy (${diaActual})`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear regla de pico y placa
const createPicoPlaca = async (req, res) => {
    try {
        const { tipo_vehiculo, numero, dia } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO PICO_PLACA (tipo_vehiculo, numero, dia) VALUES (?, ?, ?)
        `, [tipo_vehiculo, numero, dia]);
        
        res.status(201).json({ id: result.insertId, message: 'Regla de pico y placa creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar regla de pico y placa
const updatePicoPlaca = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_vehiculo, numero, dia } = req.body;
        
        const [result] = await pool.query(`
            UPDATE PICO_PLACA SET tipo_vehiculo = ?, numero = ?, dia = ? WHERE id = ?
        `, [tipo_vehiculo, numero, dia, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Regla actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar regla de pico y placa
const deletePicoPlaca = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM PICO_PLACA WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.json({ message: 'Regla eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPicoPlaca,
    getPicoPlacaById,
    getPicoPlacaByDia,
    getPicoPlacaByTipo,
    verificarPicoPlaca,
    createPicoPlaca,
    updatePicoPlaca,
    deletePicoPlaca
};
