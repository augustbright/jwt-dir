import { config } from 'dotenv';
config();
import nodemailer from 'nodemailer';

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }
    async sendActivationLink(to, link) {
        // this.transporter.sendMail({
        //     from: process.env.SMTP_USER,
        //     to,
        //     subject: `User activation on ${process.env.API_URL}`,
        //     text: '',
        //     html:
        //         `
        //         <h1>To activate user, follow the link</h1>
        //         <div>${link}</div>
        //     `
        // })
    }
};

export default new MailService();