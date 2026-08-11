package com.caraivatours.hub.mail;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Redefinição de senha");
        message.setText(
            "Você solicitou a redefinição de senha.\n\n" +
            "Clique no link abaixo (válido por 15 minutos):\n" +
            buildPasswordLink(token) + "\n\n" +
            "Se você não solicitou isso, ignore este e-mail."
        );

        mailSender.send(message);
    }

    public void sendPasswordSetupEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Defina sua senha de acesso");
        message.setText(
                "Sua conta no Caraíva Tours Hub foi criada.\n\n" +
                "Defina sua senha pelo link abaixo (válido por 15 minutos):\n" +
                buildPasswordLink(token) + "\n\n" +
                "Se você não reconhece este cadastro, entre em contato com o administrador."
        );

        mailSender.send(message);
    }

    private String buildPasswordLink(String token) {
        return "http://localhost:4600/reset-password?token=" + token;
    }
}
