const pool = require('../config/database');

// Obtener todas las celdas
const getCeldas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM CELDA');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener celda por ID
const getCeldaById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM CELDA WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Celda no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener celdas por tipo (Carro/Moto)
const getCeldasByTipo = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM CELDA WHERE tipo = ?', [req.params.tipo]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener celdas por estado (Libre/Ocupado)
const getCeldasByEstado = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM CELDA WHERE estado = ?', [req.params.estado]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener estadísticas de celdas
const getEstadisticasCeldas = async (req, res) => {
    try {
        const [stats] = await pool.query(`
            SELECT 
                tipo,
                estado,
                COUNT(*) as cantidad
            FROM CELDA 
            GROUP BY tipo, estado
        `);
        
        const [total] = await pool.query('SELECT COUNT(*) as total FROM CELDA');
        const [libres] = await pool.query("SELECT COUNT(*) as libres FROM CELDA WHERE estado = 'Libre'");
        const [ocupadas] = await pool.query("SELECT COUNT(*) as ocupadas FROM CELDA WHERE estado = 'Ocupado'");
        
        res.json({
            total: total[0].total,
            libres: libres[0].libres,
            ocupadas: ocupadas[0].ocupadas,
            detalle: stats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear celda
const createCelda = async (req, res) => {
    try {
        const { tipo, estado } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO CELDA (tipo, estado) VALUES (?, ?)
        `, [tipo, estado || 'Libre']);
        
        res.status(201).json({ id: result.insertId, message: 'Celda creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar celda
const updateCelda = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, estado } = req.body;
        
        const [result] = await pool.query(`
            UPDATE CELDA SET tipo = ?, estado = ? WHERE id = ?
        `, [tipo, estado, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Celda no encontrada' });
        }
        res.json({ message: 'Celda actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cambiar estado de celda
const cambiarEstadoCelda = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        const [result] = await pool.query(`
            UPDATE CELDA SET estado = ? WHERE id = ?
        `, [estado, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Celda no encontrada' });
        }
        res.json({ message: 'Estado de celda actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar celda
const deleteCelda = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM CELDA WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Celda no encontrada' });
        }
        res.json({ message: 'Celda eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCeldas,
    getCeldaById,
    getCeldasByTipo,
    getCeldasByEstado,
    getEstadisticasCeldas,
    createCelda,
    updateCelda,
    cambiarEstadoCelda,
    deleteCelda
};
