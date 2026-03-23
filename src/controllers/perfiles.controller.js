const pool = require('../config/database');

// Obtener todos los perfiles
const getPerfiles = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM PERFIL_USUARIO');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener perfil por ID
const getPerfilById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM PERFIL_USUARIO WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear perfil
const createPerfil = async (req, res) => {
    try {
        const { perfil } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO PERFIL_USUARIO (perfil) VALUES (?)
        `, [perfil]);
        
        res.status(201).json({ id: result.insertId, message: 'Perfil creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar perfil
const updatePerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { perfil } = req.body;
        
        const [result] = await pool.query(`
            UPDATE PERFIL_USUARIO SET perfil = ? WHERE id = ?
        `, [perfil, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }
        res.json({ message: 'Perfil actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar perfil
const deletePerfil = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM PERFIL_USUARIO WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Perfil no encontrado' });
        }
        res.json({ message: 'Perfil eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPerfiles,
    getPerfilById,
    createPerfil,
    updatePerfil,
    deletePerfil
};
