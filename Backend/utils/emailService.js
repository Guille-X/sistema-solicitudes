const sgMail = require('@sendgrid/mail');

// Configura la API Key de SendGrid desde variables de entorno
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Enviar correo con SendGrid
 * @param {string} destinatario - Dirección de correo del receptor
 * @param {string} asunto - Asunto del correo
 * @param {string} contenidoHtml - Contenido HTML del correo
 */
const enviarCorreo = async (destinatario, asunto, contenidoHtml) => {
  const msg = {
    to: destinatario,
    from: process.env.EMAIL_FROM, // remitente verificado en SendGrid
    subject: asunto,
    html: contenidoHtml,
  };

  try {
    await sgMail.send(msg);
    console.log(`Correo enviado a ${destinatario}`);
  } catch (error) {
    console.error('Error enviando correo:', error.response?.body || error.message);
  }
};

module.exports = { enviarCorreo };
