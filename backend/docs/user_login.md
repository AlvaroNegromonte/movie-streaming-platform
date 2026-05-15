# User Login

## Objetivo

Implementar a autenticação de usuários cadastrados na plataforma por meio de e-mail e senha, além de preparar o contrato para login via Google SSO.

## Endpoint de login com e-mail e senha

POST /login

## Request body

```json
{
  "email": "alvaro@teste.com",
  "password": "Senha@123"
}

{
  "authenticated": true,
  "message": "Login realizado com sucesso",
  "redirect": "home",
  "session": {
    "active": true
  },
  "user": {
    "id": "user-id",
    "name": "Usuário de Teste",
    "email": "alvaro@teste.com"
  }
}

{
  "authenticated": false,
  "error": "Preencha todos os campos obrigatórios"
}

{
  "email": "alvaro@teste.com",
  "googleId": "google-alvaro@teste.com"
}

{
  "authenticated": true,
  "message": "Login com Google realizado com sucesso",
  "redirect": "home",
  "session": {
    "active": true
  },
  "user": {
    "id": "user-id",
    "name": "Usuário de Teste",
    "email": "alvaro@teste.com"
  }
}