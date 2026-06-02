const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const enviarCorreo = async (destinatario, asunto, contenidoHtml) => {
  try {
    await transporter.sendMail({
      from: `"Sistema Interno" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: asunto,
      html: contenidoHtml,
    });
    console.log(`Correo enviado a ${destinatario}`);
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
};

module.exports = { enviarCorreo };