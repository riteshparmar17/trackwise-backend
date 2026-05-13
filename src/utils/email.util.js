const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
    try {
        const msg = {
            to: to,
            from: { email: process.env.EMAIL_FROM },
            subject: subject,
            html: html,
        };

        const response = await sgMail.send(msg);
        return response;
    } catch (error) {
        throw error;
    }
};

module.exports = { sendEmail };