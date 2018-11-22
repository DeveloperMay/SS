<?php
/*
{
	"AUTHOR":"Matheus Maydana",
	"CREATED_DATA": "22/11/2018",
	"MODEL": "Conexao",
	"LAST EDIT": "22/11/2018",
	"VERSION":"0.0.1"
}
*/

require_once 'Pssw.php';

class Model_Bancodados_Conexao {

	function __construct(){

	}

	function conexao(){

		try{

			$banco = BANCO_DADOS;
			if($banco == 'pgsql'){
				// POSTGRES
				$PDO = new PDO('pgsql:host='.DB_HOST.' dbname='.DB_NAME.' user='.DB_USER.' password='.DB_PASS.' port='.DB_PORT.'');
				return $PDO;

			}else{

				// MYSQL
				$PDO = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8', DB_USER, DB_PASS, array(
					PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
					PDO::ATTR_EMULATE_PREPARES => false
				));

				return $PDO;
			}

		}catch(PDOException $e){

			$controller  = 'erro404';
			$action 	 = 'erro404';
			$visao 	  	 = 'erro404';

			try{

				require_once (DIR.SUBDOMINIO.'/Controller/erro404/erro404.php');

			}catch(PDOException $e){

				/**
				** Caso controlador não seja encontrado
				**/
			}
			//$this->controlador = new Model_error404;

		}
	}
}

