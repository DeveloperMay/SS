<?php
/*
{
	"AUTHOR":"Matheus Mayana",
	"CREATED_DATA": "22/11/2018",
	"MODEL": "Validacão",
	"LAST EDIT": "22/11/2018",
	"VERSION":"0.0.1"
}
*/

class Model_Pluggs_Validacao{

	function __construct(){

	}

	function loginEntrar($id, $senha){

		/* Valida LOGIN */

		$error = 0;
		$mensagem = '';

		if($id === ''){
			$error = 1;
			$mensagem = 'Informe o seu ID';

		}

		if($senha === ''){
			$error = 1;
			$mensagem = 'Informe sua senha';

		}

		/* SE HOUVER ERRO, EXIBIR */
		if($error > 0){

			return $mensagem;
		}

		return true;

	}

	function _criarLogin($dados){

		$error 		= 0;
		$mensagem 	= '';

		/* VALIDAÇÃO DE CPF */
		$cpf 	= $dados['cpf'] ?? '';

		if(empty($cpf)){

			$error = 1;
			$mensagem = 'Informe seu CPF, ou você não tem!?';

		}elseif(!preg_match('/[0-9]*/', $cpf)){

			$error = 1;
			$mensagem = 'Informe seu CPF somente números!';

		}

		/* SE HOUVER ERRO, EXIBIR */
		if($error > 0){

			return $mensagem;
		}

		/* VALIDAÇÃO EMAIL */
		/*$email 		= $dados['email'];
		$matchEmail = '/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!\.)){0,61}[a-zA-Z0-9_-]?\.)+[a-zA-Z0-9_](?:[a-zA-Z0-9_\-](?!$)){0,61}[a-zA-Z0-9_]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/';
		
		if(empty($email)){

			$error = 1;
			$mensagem = 'Informe seu e-mail caralho!';

		}elseif(!preg_match($matchEmail, $email)){

			$error = 1;
			$mensagem = 'Esse e-mail é inválido, está tentando enganar quem ?';

		}elseif(strlen($email) > 50){

			$error = 1;
			$mensagem = 'Seu e-mail é muito grande! arruma outro aí..';
		}

		/* SE HOUVER ERRO, EXIBIR */
		/*if($error > 0){

			return $mensagem;
		}*/


		/* VALIDAÇÃO SENHA */
		$senha 	= $dados['senha'];
		if(empty($senha)){

			$error = 1;
			$mensagem = 'Informe sua senha, como pretende ser identificado se não for por senha?';
		
		}elseif(strlen($senha) < 8){

			$error = 1;
			$mensagem = 'Sua senha precisa ter mais de 8 digitos, capricha ae!';

		}elseif(strlen($senha) > 20){

			$error = 1;
			$mensagem = 'Sua senha não pode ser muito longa, você é muito exagerado!';
		}

		/* SE HOUVER ERRO, EXIBIR */
		if($error > 0){

			return $mensagem;
		}

		if($error === 0){
			return true;
		}

	}
}