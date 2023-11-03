import { con } from "../db/atlas.js";
import { Router } from "express";
import bcrypt from 'bcrypt';

const User = Router();
const db = await con();
const users = db.collection("user");

/** -------------------- GET PARA TRAER TODOS LOS USUARIOS -------------------- */
User.get("/users", async(req, res) => {
    try {
        
        const result = await users.find({}).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

/** -------------------- POST PARA BUSCAR USUARIOS POR EMAIL O ROLE -------------------- */

User.post("/users/search", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ mensaje: 'Debes proporcionar una dirección de correo electrónico (email)' });
        }

        const query = { email };

        const projection = {
            id: 1,
            username: 1,
            email: 1,
        };
        const result = await users.find(query).project(projection).toArray();

        if (result.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron usuarios con el correo electrónico proporcionado' });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
});



/** -------------------- POST DE LOG IN -------------------- */

User.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const existingUser = await users.findOne({ email });

      if (!existingUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const passwordMatch = await bcrypt.compare(password, existingUser.password);

      if (passwordMatch) {
        let userType = existingUser.role;

        const userData = {
          id: existingUser.id,
          name: existingUser.name,
          role: existingUser.role,
          userType: userType
        };
        const cookieOptions = {
          httpOnly: true,
          maxAge: 3600,
          domain: "127.10.10.10"
        };

        const userCookie = cookie.serialize('userData', JSON.stringify(userData), cookieOptions);
        res.setHeader('Set-Cookie', userCookie);
        return res.status(200).json({
            id: existingUser.id,
            name: existingUser.name,
            role: existingUser.role,
            userType: userType,
            mensaje: "Inicio de sesión exitoso"
        });
      } else {
        return res.status(401).json({ message: 'Correo o Contraseña incorrecta' });
      }
    } catch (error) {
      console.error('Error al verificar correo electrónico y contraseña:', error);
      return res.status(500).json({ message: 'Error al verificar correo electrónico y contraseña' });
    }
});



/** -------------------- POST PARA EL REGISTRO DEL CLIENTE -------------------- */

User.post('/register/Customer', async (req, res) => {
    try {
        const { username, name, email, password, phone_number } = req.body;

        if (!username || !name || !email || !password || !phone_number) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        


        const lastUser = await users.find().sort({ id: -1 }).limit(1).toArray();

        let nextId = 1; 

        if (lastUser.length > 0) {
            nextId = lastUser[0].id + 1; 
        }

        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ mensaje: 'Ya existe un usuario con este correo electrónico' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            id: nextId, 
            username,
            name,
            email,
            password: hashedPassword,
            phone_number,
            role: 'Customer',
        };

        const result = await users.insertOne(newUser);

        if (result.insertedId) {
            res.status(201).json({ mensaje: 'Registro exitoso', usuario: newUser });
        } else {
            throw new Error('No se pudo insertar el registro');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});

/** -------------------- POST PARA EL ADMIN REGISTRAR PERSONAS -------------------- */

User.post('/register/Admin', async (req, res) => {
    try {
        const { username, name, email, password, phone_number, role } = req.body;

        if (!username || !name || !email || !password || !phone_number || !role) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        


        const lastUser = await users.find().sort({ id: -1 }).limit(1).toArray();

        let nextId = 1; 

        if (lastUser.length > 0) {
            nextId = lastUser[0].id + 1; 
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            id: nextId, 
            username,
            name,
            email,
            password: hashedPassword,
            phone_number,
            role
        };

        const result = await users.insertOne(newUser);

        if (result.insertedId) {
            res.status(201).json({ mensaje: 'Registro exitoso', usuario: newUser });
        } else {
            throw new Error('No se pudo insertar el registro');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
});

/** -------------------- PUT PARA EDITAR LOS DATOS TRAIDOS POR EL POST DE TRAER DATOS -------------------- */

User.put("/edit", async (req, res) => {
    try {
        

        const { id, username, name, email, phone_number, password } = req.body;

        if (!id || typeof id !== 'number') {
            return res.status(400).json({ mensaje: 'ID de usuario no válido' });
        }

        const existingUser = await users.findOne({ id });

        if (!existingUser) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        let changes = false;

        if (username && username !== existingUser.username) {
            existingUser.username = username;
            changes = true;
        }

        if (name && name !== existingUser.name) {
            existingUser.name = name;
            changes = true;
        }

        if (email && email !== existingUser.email) {
            existingUser.email = email;
            changes = true;
        }

        if (phone_number && phone_number !== existingUser.phone_number) {
            existingUser.phone_number = phone_number;
            changes = true;
        }

        if (password) {
            const passwordChanged = await bcrypt.compare(password, existingUser.password);

            if (!passwordChanged) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                existingUser.password = hashedPassword;
                changes = true;
            }
        }

        if (!changes) {
            return res.status(400).json({ mensaje: 'No se realizaron cambios en los datos del usuario' });
        }

        const result = await users.updateOne({ id: existingUser.id }, { $set: existingUser });

        if (result.modifiedCount === 1) {
            res.status(200).json({ mensaje: 'Datos del usuario actualizados correctamente' });
        } else {
            res.status(500).json({ mensaje: 'No se pudo actualizar el usuario' });
        }
    } catch (error) {
        console.error("Error al editar el usuario:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
});

/** -------------------- DELETE PARA ELIMINAR USUARIOS -------------------- */

User.delete("/delete", async (req, res) => {
    try {
        const { id } = req.body; 

        const existingUser = await users.findOne({ id });

        if (!existingUser) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const result = await users.deleteOne({ id });

        if (result.deletedCount === 1) {
            res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
        } else {
            res.status(500).json({ mensaje: 'No se pudo eliminar el usuario' });
        }
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
    }
});


export default User;