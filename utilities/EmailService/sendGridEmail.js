const sgMail = require('@sendgrid/mail');
const dotenv = require("dovenv");
dotenv.config();
// eslint-disable-next-line no-undef
process.env.SENDGRID_API_KEY;
// eslint-disable-next-line no-undef
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const message = {
    to: 'f20160145@bits',
    from: 'swetanshu9722@gmail.com',
    subject: 'testing sendgrid to send Emails',
    text: 'First easy text saying Hi!',
    //SMTP server is not able to parse HTML
    html: '<strong> First easy text saying Hi!<strong>'
}

sgMail.send(message)
        .then(()=> console.log('email sent'))
        .catch((err)=> console.log(err));
