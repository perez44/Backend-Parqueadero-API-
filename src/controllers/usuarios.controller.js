const pool = require('../config/database');

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT u.*, p.perfil 
            FROM USUARIO u 
            JOIN PERFIL_USUARIO p ON u.PERFIL_USUARIO_id = p.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT u.*, p.perfil 
            FROM USUARIO u 
            JOIN PERFIL_USUARIO p ON u.PERFIL_USUARIO_id = p.id 
            WHERE u.id_usuario = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear usuario
const createUsuario = async (req, res) => {
    try {
        const { 
            tipo_documento, numero_documento, primer_nombre, segundo_nombre,
            primer_apellido, segundo_apellido, direccion_correo, numero_celular,
            foto_perfil, estado, clave, PERFIL_USUARIO_id 
        } = req.body;
        
        const [result] = await pool.query(`
            INSERT INTO USUARIO (tipo_documento, numero_documento, primer_nombre, segundo_nombre,
                primer_apellido, segundo_apellido, direccion_correo, numero_celular,
                foto_perfil, estado, clave, PERFIL_USUARIO_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [tipo_documento, numero_documento, primer_nombre, segundo_nombre,
            primer_apellido, segundo_apellido, direccion_correo, numero_celular,
            foto_perfil, estado, clave, PERFIL_USUARIO_id]);
        
        res.status(201).json({ id: result.insertId, message: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar usuario
const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            tipo_documento, numero_documento, primer_nombre, segundo_nombre,
            primer_apellido, segundo_apellido, direccion_correo, numero_celular,
            foto_perfil, estado, clave, PERFIL_USUARIO_id 
        } = req.body;
        
        const [result] = await pool.query(`
            UPDATE USUARIO SET 
                tipo_documento = ?, numero_documento = ?, primer_nombre = ?, segundo_nombre = ?,
                primer_apellido = ?, segundo_apellido = ?, direccion_correo = ?, numero_celular = ?,
                foto_perfil = ?, estado = ?, clave = ?, PERFIL_USUARIO_id = ?
            WHERE id_usuario = ?
        `, [tipo_documento, numero_documento, primer_nombre, segundo_nombre,
            primer_apellido, segundo_apellido, direccion_correo, numero_celular,
            foto_perfil, estado, clave, PERFIL_USUARIO_id, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar usuario
const deleteUsuario = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM USUARIO WHERE id_usuario = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
const loginUsuario = async (req, res) => {
    try {
        const { direccion_correo, clave } = req.body;
        const [rows] = await pool.query(`
            SELECT u.*, p.perfil 
            FROM USUARIO u 
            JOIN PERFIL_USUARIO p ON u.PERFIL_USUARIO_id = p.id 
            WHERE u.direccion_correo = ? AND u.clave = ?
        `, [direccion_correo, clave]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        res.json({ message: 'Login exitoso', usuario: rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    loginUsuario
};
