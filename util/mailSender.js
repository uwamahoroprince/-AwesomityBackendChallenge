const nodemailer = require("nodemailer");

const mailSender = async (options, redirectLink, position, status) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const message = {
    from: '"Awesomity Backend Challenge" <leasonwetech66@gmail.com', // sender address
    to: options.email, // email receivers
    subject: process.env.subject, // Subject line
    text:
      position === "MANAGER"
        ? `Hello ${options.name}\n
    please click to this link to confirm you account ${redirectLink}`
        : status === "resetPassword"
        ? `click here to reset your password ${redirectLink}`
        : `Hello ${options.name}\n
    this is to inform you that you are now part of our huge team,\n     All about next moves will be communicated to you very soon.
    \n Thanks`, // plain text body
  };
  const info = await transporter.sendMail(message);
  console.log("Message sent: %s", info.messageId);
};
module.exports = mailSender;
