import usersService from "../services/users.service.js";

class UsersController {
    async findAllUsers(req, res) {
        try {
            const result = await usersService.findAll();
            res.status(200).json(result);
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }

    async findAllUsersSimple(_, res) {
        try {
            const result = await usersService.findAllSimple();
            res.status(200).json(result);
        }catch(error){
            res.status(500).send(error.toString());
        }
    }

    async deleteAllUsersByInactivity(_, res) {
        try {
            await usersService.deleteAllByInactivity();
            res.status(200);
        }catch(error){
            res.status(500).send(error.toString());
        }
    }

    async findUsersById(req, res) {
        try {
            const result = await usersService.findById(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }

    async createUsers(req, res) {
        // aqui hay que hacer validaciones de los datos que vienen en el body
        try {
            const result = await usersService.create(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }

    async updateUsers(req, res) {
        try {
            const result = await usersService.update(req.params.id, req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }

    async deleteUsers(req, res) {
        try {
            const result = await usersService.delete(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }

    async deleteSoftUsers(req, res) {
        try {
            const result = await usersService.deleteSoft(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }

    async loginUsers(req, res) {
        // aqui hay que hacer validaciones de los datos que vienen en el body
        try {
            const result = await usersService.login(req.body);
            res.cookie("token", result, { httpOnly: true });
            res.status(200).json(`Token: ${result}`);
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }

    async logoutUsers(req, res) {
        try {
            res.clearCookie("token");
            res.status(200).json("Logout OK");
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }

    async currentUsers(req, res) {
        try {
            const tokenUser = req.cookies.token;
            const result = await usersService.current(tokenUser);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }

    async forgotPasswordUsers(req, res) {
        try {
            const result = await usersService.forgotPassword(req.body.email);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }

    async validateResetPasswordToken(req, res) {
        try {
            const result = await usersService.validateToken(req.params.token);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }

    async resetPasswordUsers(req, res) {
        try {
            const result = await usersService.resetPassword(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }

    async premiumUsersRole(req, res) {
        try {
            const result = await usersService.changeRole(req.params.uid);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).send(error.toString());
        }
    }
}

const usersController = new UsersController();

export default usersController;