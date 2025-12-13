package com.drapz.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Réinitialisation du mot de passe");
        message.setText("Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant : \n" 
                + "https://drapz.com/reset-password?token=" + token);
        mailSender.send(message);
    }
}
