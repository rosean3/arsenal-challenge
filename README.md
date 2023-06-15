# Desafio Ténico Arsenal
O desafio consiste em desenvolver uma pequena aplicação web utilizando ReactJS/Native, HTML, CSS e Git. O objetivo é criar uma página de cadastro de usuários, onde será possível preencher campos como nome, e-mail e senha. Além disso, a página deve ter validações básicas nos campos e exibir uma mensagem de sucesso ao final do cadastro.

# Tecnologias principais

 - ReactNative
 - Firebase
 - React Hook Form

# Branches

Eu trabalhei em duas branches:

 - `main`: onde está a parte básica do código | fácil testagem.
 - `google-sign-in`: feature de sign in com google implementada para android.

## main

### como rodar
1. É preciso ter `npm`, `npx` e `yarn` instalados na sua máquina.
2. Clonar o repositório e navegar até a sua pasta.
3. No terminal:
	- `yarn install`
	- `npx expo start`
4. Escanear o QR code disponível no seu celular e/ou usar um emulador de Android.

## google-sign-in
### como rodar

1. É preciso ter `npm`, `npx` e `yarn` instalados na sua máquina.
2. Clonar o repositório e navegar até a sua pasta.
3. No terminal:
	- `yarn install`
	- `npx expo start`
4. Baixar a versão do build no seu celular a partir do link: [build](https://expo.dev/accounts/rosean3/projects/arsenal-challenge/builds/1ce157aa-9836-476b-b14a-b9f64015b0c6).
5. No terminal:
	`npx expo start --dev-client`
6. Escanear código no celular ou emular com Android Studio.

Obs.: é possível que o seu celular tente te impedir de instalar o aplicativo, mas é só clicar em "instalar mesmo assim".

## Como testar

 1. Crie uma conta.
	 - Tente se cadastrar sem colocar algumas informações para ver os erros.
	 - Tente colocar um email inváido.
	 - Tente colocar uma senha inválida. 
 2. Saia da conta clicando em "sign out".
 3. Faça login com a conta criada.
	 - Tente entrar com a senha errada.
4. Tente criar uma conta com o mesmo email.
 

Na branch google-sign-in:

 1. Faça sign in com Google.
 2. Faça sign out após isso.

Teste outras coisas que você acha que vale a pena testar.
