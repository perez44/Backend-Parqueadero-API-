const pool = require('../config/database');

// Obtener todos los vehículos
const getVehiculos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT v.*, u.primer_nombre, u.primer_apellido, u.direccion_correo
            FROM VEHICULO v 
            JOIN USUARIO u ON v.USUARIO_id_usuario = u.id_usuario
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener vehículo por ID
const getVehiculoById = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT v.*, u.primer_nombre, u.primer_apellido, u.direccion_correo
            FROM VEHICULO v 
            JOIN USUARIO u ON v.USUARIO_id_usuario = u.id_usuario
            WHERE v.id = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener vehículo por placa
const getVehiculoByPlaca = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT v.*, u.primer_nombre, u.primer_apellido, u.direccion_correo
            FROM VEHICULO v 
            JOIN USUARIO u ON v.USUARIO_id_usuario = u.id_usuario
            WHERE v.placa = ?
        `, [req.params.placa]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener vehículos por usuario
const getVehiculosByUsuario = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM VEHICULO WHERE USUARIO_id_usuario = ?
        `, [req.params.usuarioId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear vehículo
const createVehiculo = async (req, res) => {
    try {
        const { placa, color, modelo, marca, tipo, USUARIO_id_usuario } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO VEHICULO (placa, color, modelo, marca, tipo, USUARIO_id_usuario)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [placa, color, modelo, marca, tipo, USUARIO_id_usuario]);
        
        res.status(201).json({ id: result.insertId, message: 'Vehículo creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar vehículo
const updateVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const { placa, color, modelo, marca, tipo, USUARIO_id_usuario } = req.body;
        
        const [result] = await pool.query(`
            UPDATE VEHICULO SET placa = ?, color = ?, modelo = ?, marca = ?, tipo = ?, USUARIO_id_usuario = ?
            WHERE id = ?
        `, [placa, color, modelo, marca, tipo, USUARIO_id_usuario, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        res.json({ message: 'Vehículo actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar vehículo
const deleteVehiculo = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM VEHICULO WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        res.json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getVehiculos,
    getVehiculoById,
    getVehiculoByPlaca,
    getVehiculosByUsuario,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo
};
