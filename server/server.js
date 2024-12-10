const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route pour envoyer un email
app.post('/api/contact/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // Envoi de l'email
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Nouveau message de ${name} - MNBM-Shop`,
      text: `
        Nom: ${name}
        Email: ${email}
        Téléphone: ${phone || 'Non spécifié'}
        
        Message:
        ${message}
      `
    });

    res.status(200).json({ 
      message: 'Votre message a été envoyé avec succès !' 
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'envoi du message',
      error: error.toString()
    });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
