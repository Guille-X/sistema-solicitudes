const nodemailer = require('nodemailer');

// Proveedor: 'gmail' (por defecto) o 'sendgrid'
const provider = (process.env.EMAIL_PROVIDER || 'gmail').toLowerCase();

let transporter = null;
let sgMail = null;

if (provider === 'sendgrid') {
  sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      // Quita los espacios por si la contraseña de aplicación se pegó con ellos
      pass: (process.env.EMAIL_PASS || '').replace(/\s/g, ''),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Enviar correo electrónico
 * @param {string} destinatario - Dirección de correo del receptor
 * @param {string} asunto - Asunto del correo
 * @param {string} contenidoHtml - Contenido HTML del correo
 */
const enviarCorreo = async (destinatario, asunto, contenidoHtml) => {
  const remitente = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  try {
    if (provider === 'sendgrid') {
      await sgMail.send({
        to: destinatario,
        from: remitente,
        subject: asunto,
        html: contenidoHtml,
      });
    } else {
      await transporter.sendMail({
        from: `"Sistema de Solicitudes INTERCOP" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: asunto,
        html: contenidoHtml,
      });
    }
    console.log(`Correo enviado a ${destinatario} (${provider})`);
  } catch (error) {
    console.error('Error enviando correo:', error.response?.body || error.message);
  }
};

module.exports = { enviarCorreo };