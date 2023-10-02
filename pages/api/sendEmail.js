import nodemailer from 'nodemailer';

export default async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Cambia esto al servicio de correo que desees usar
      auth: {
        user: 'frank4notification@gmail.com', // Tu dirección de correo electrónico
        pass: 'vcwc pgkz nmas oovf', // Tu contraseña de correo electrónico
      },
    });

    const mailOptions = {
      from: 'frank4notification@gmail.com',
      to: 'franco.j.cejas@gmail.com',
      subject: 'Nuevo ticket creado',
      text: `Se ha creado un nuevo ticket`,
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo electrónico enviado correctamente', info });
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    res.status(500).json({ error: 'Error al enviar el correo electrónico' });
  }
};