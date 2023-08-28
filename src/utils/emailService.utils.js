import mailer from 'nodemailer';
import config from '../config/config.js';

class EmailService {
    constructor() {
        this.transport = mailer.createTransport({
            service: config.mailing_service,
            auth: {
                user: config.mailing_user,
                pass: config.mailing_password
            }
        });
    }

    async sendEmail(email, subject, message) {
        await this.transport.sendMail({
            from: config.mailing_user,
            to: email,
            subject,
            html: message
        });
    }

    async sendEmailResetPassword(email, subject, message) {
        await this.transport.sendMail({
            from: config.mailing_user,
            to: email,
            subject,
            html: message
        });
    }

    async sendEmailUserDeleted(email, username) {
        await this.transport.sendMail({
            from: config.mailing_user,
            to: email,
            subject:`${username} your account has been deleted`,
            html: `<h1>Dear ${username}</h1><br/><p>Your account has been deleted due two days of inactivity.\nRegards.</p>`
        });
    }
}

const emailService = new EmailService();

export default emailService;