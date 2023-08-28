import usersMongo from '../DAL/DAOs/usersDaos/usersMongo.js'
import { hashData, compareData } from '../utils/bcrypt.utils.js';
import { generateToken, verifyToken, generateTokenResetPassword, verifyTokenResetPassword, decodeTokenResetPassword } from '../utils/jwt.utils.js';
import { UsersDTO, UsersViewDTO } from '../DAL/DTOs/users.dto.js';
import config from '../config/config.js';
import emailService from '../utils/emailService.utils.js';

class UsersService {
    async findAll() {
        return await usersMongo.findAll();
    }
    // funcion para retornar todos los usuario pero solo con datos principales.
    async findAllSimple() {
        const result = await this.findAll();
        // podria usarse una proyeccion de mongo para evitar este mapeo.
        return result.map(({ name, mail, role }) => ({ name, mail, role }));
    }

    async deleteAllByInactivity(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        usersMongo.deleteMany({ "status": "inactive", "deleteAt": { $gt: date } })
    }

    async findById(id) {
        return await usersMongo.findById(id);
    }

    async create(users) {
        const { password } = users;
        const hashPassword = await hashData(password);
        const newUsers = { ...users, password: hashPassword };
        const usersDTO = new UsersDTO(newUsers);
        const result = await usersMongo.create(usersDTO);
        return result;
    }

    async update(id, users) {
        return await usersMongo.update(id, users);
    }

    async delete(id) {
        return await usersMongo.delete(id);
    }

    async deleteSoft(id) {
        return await usersMongo.deleteSoft(id);
    }

    async login(users) {
        const { password, email } = users;
        if (email === config.admin_email && password === config.admin_password) {
            const userAdmin = {
                email,
                role: "admin"
            }
            const token = generateToken(userAdmin);
            return token;
        }

        const result = await usersMongo.findByField('email', email);
        const { password: hashPassword } = result[0];
        const isMatch = await compareData(password, hashPassword);
        if (isMatch) {
            const token = generateToken(result[0]);
            return token;
        }
    }

    async current(token) {
        const { id, email, role } = verifyToken(token);

        if (role === "admin") {
            const userAdmin = {
                email,
                role
            }
            return userAdmin;
        }

        const result = await usersMongo.findById(id);
        const usersViewDTO = new UsersViewDTO(result);
        return usersViewDTO;
    }

    async forgotPassword(email) {
        const result = await usersMongo.findByField('email', email);
        const token = generateTokenResetPassword(result[0]);
        const url = `${config.url_frontend}/reset-password/${token}`;
        const emailBody = {
            to: email,
            subject: 'Reset Password',
            html: `<h1>Reset Password</h1>
                    <p>Click this <a href="${url}">link</a> to reset your password.</p>`
        }
        const emailResult = await emailService.sendEmail(emailBody.to, emailBody.subject, emailBody.html);
        return emailResult;
    }

    async validateToken(token) {
        return verifyTokenResetPassword(token);
    }

    async resetPassword(data) {
        const { token, password } = data;

        //verificar que el token sea valido y que no haya expirado

        const isValid = verifyTokenResetPassword(token);
        if (!isValid) {
            return null;
        }

        const { id } = decodeTokenResetPassword(token);
        const hashPassword = await hashData(password);

        //verificar que la contraseña no sea igual a la anterior

        const user = await usersMongo.findById(id);
        const { password: hashPasswordOld } = user;
        const isMatch = await compareData(hashPassword, hashPasswordOld);

        if (isMatch) {
            return;
        }

        return await usersMongo.update(id, { password: hashPassword });;
    }

    //funcionalidad para cambiar el rol de un usuario de user a premium y viceversa

    async changeRole(id) {
        const result = await usersMongo.findById(id);
        const { role } = result;
        let newRole = "";
        if (role === "user") {
            newRole = "premium";
        } else {
            newRole = "user";
        }
        const resultUpdate = await usersMongo.update(id, { role: newRole });
        return resultUpdate;
    }

}

const usersService = new UsersService();

export default usersService;