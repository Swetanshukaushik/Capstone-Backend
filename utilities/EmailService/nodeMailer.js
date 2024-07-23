const nodeMailer = require('nodemailer');
const dotEnv = require('dotenv');
dotEnv.config();


const techDetails = {
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true, // for port 465
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
    }
};
// gmailtechDetails = {
//     service: "gmail",
//     host: "smtp.gmail.com",
//     secure: true,
//     auth: {
//         user: "pepcodingdev@gmail.com",
//         // different from your login password 
//         pass: APP_PASSWORD
//     }
// }
const transporter = nodeMailer.createTransport(techDetails);
let emailObject = {
    to: 'f20160145@bits.alumni.co.in',
    from: 'swetanshu9722@gmail.com',
    subject: "Send email via nodeMailer",
    text: 'mail beeing sent through nodemailer',
    html: "<strong> THough node mailer<strong>"
}
transporter.sendMail(emailObject)
    .then(() => console.log("Email sent through node mailer"))
    .catch((err) => console.log(err.message));
