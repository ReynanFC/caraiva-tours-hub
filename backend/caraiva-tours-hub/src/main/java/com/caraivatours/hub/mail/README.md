# Envio de e-mails

`EmailService` envia mensagens transacionais de primeiro acesso e recuperação de senha por `JavaMailSender`.

- `sendPasswordSetupEmail`: informa que a conta foi criada e envia o link para definir a primeira senha;
- `sendResetEmail`: envia o link solicitado em “esqueci minha senha”;
- `buildPasswordLink`: monta a URL com o token como query parameter.

O serviço não valida, armazena nem expira tokens; isso pertence a `PasswordResetService`. Essa separação permite trocar template ou provedor SMTP sem alterar a regra de segurança.

As mensagens são texto simples. Host, porta e credenciais SMTP vêm da configuração Spring. A URL do frontend está atualmente fixa em `http://localhost:4600/reset-password` e deve ser externalizada por ambiente antes da implantação em produção.
