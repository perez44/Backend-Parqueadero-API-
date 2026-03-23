// ========================================
// PARKING LOT - AUTHENTICATION
// ========================================

const Auth = {
    login: function(documentNumber, password, loginType) {
        const user = DataStore.getUserByDocument(documentNumber);
        
        if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        if (user.status !== 'activo') {
            return { success: false, message: 'Usuario inactivo. Contacte al administrador' };
        }

        if (loginType === 'user') {
            // Users only need document number
            if (user.userType !== 'usuario') {
                return { success: false, message: 'Los administradores y operadores deben usar contrasena' };
            }
        } else {
            // Admin and operators need password
            if (user.userType === 'usuario') {
                return { success: false, message: 'Los usuarios deben acceder con solo su documento' };
            }
            
            if (user.password !== password) {
                return { success: false, message: 'Contrasena incorrecta' };
            }
        }

        // Save session
        const session = {
            userId: user.id,
            documentNumber: user.documentNumber,
            fullName: user.fullName,
            userType: user.userType,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentSession', JSON.stringify(session));
        
        return { success: true, user: user };
    },

    logout: function() {
        localStorage.removeItem('currentSession');
        window.location.href = '../index.html';
    },

    getCurrentUser: function() {
        const session = localStorage.getItem('currentSession');
        if (!session) return null;
        
        const sessionData = JSON.parse(session);
        return DataStore.getUserById(sessionData.userId);
    },

    getSession: function() {
        const session = localStorage.getItem('currentSession');
        return session ? JSON.parse(session) : null;
    },

    isLoggedIn: function() {
        return localStorage.getItem('currentSession') !== null;
    },

    isAdmin: function() {
        const session = this.getSession();
        return session && session.userType === 'administrador';
    },

    isOperator: function() {
        const session = this.getSession();
        return session && session.userType === 'operador';
    },

    isUser: function() {
        const session = this.getSession();
        return session && session.userType === 'usuario';
    },

    isAdminOrOperator: function() {
        return this.isAdmin() || this.isOperator();
    },

    checkAuth: function() {
        if (!this.isLoggedIn()) {
            window.location.href = '../index.html';
            return false;
        }
        return true;
    },

    checkAdminAuth: function() {
        if (!this.checkAuth()) return false;
        if (!this.isAdmin()) {
            alert('No tiene permisos para acceder a esta seccion');
            window.location.href = 'dashboard.html';
            return false;
        }
        return true;
    },

    checkAdminOrOperatorAuth: function() {
        if (!this.checkAuth()) return false;
        if (!this.isAdminOrOperator()) {
            alert('No tiene permisos para realizar esta accion');
            return false;
        }
        return true;
    }
};
