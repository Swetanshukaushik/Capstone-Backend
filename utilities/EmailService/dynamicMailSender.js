const nodeMailer = require('nodemailer');
const dotEnv = require('dotenv');
dotEnv.config();

const techDetails = {
    host: 'smtp.sendgrid.net',  //for nodemailer
    port: 465,
    secure: true,
    service:"gmail", //put only service n auth for gmail
    auth: {
        user: process.env.SENDER_EMAIL,
        password: process.env.SENDGRID_API_KEY
    }
}

const transporter = nodeMailer.createTransport(techDetails);

const fs = require('fs');
// const htmlFileTemplate = fs.readFileSync('./', 'utf-8');

async function emailSender(to, subject, html, text) {
    try {
        console.log(process.env.SENDER_EMAIL, "subject", subject, "text", text);

        const emailObjectToSend = {
            to: to,
            from: from,
            html: html,
            text: text,
            subject: subject
        }
        await transporter.sendMail(emailObjectToSend);
    } catch (err) {
        console.log(err.message);
        throw new Error(err);
    }
}

async function sendEmailHelper(to, htmlTemplate, otp, userName, subject) {
    try {
        console.log(to, otp, userName);
        const usernameUpdatedHtml = htmlTemplate.replace('#{USER_NAME}', userName);
        const otpUpdatedHtml = htmlTemplate.replace('#{OTP}', otp);

        const emailObjToSend = {
            to: to,
            from: process.env.SENDER_EMAIL,
            subject: subject,
            html: otpUpdatedHtml,
            text: `
            Hi ${userName}
            Your otp to reset your password is ${otp}`
        };
        console.log("hi");
        await transporter.sendMail(emailObjToSend);
    } catch (err) {
        // console.log(err);
        throw new Error(err);
    }
}

module.exports = {sendEmailHelper, emailSender}