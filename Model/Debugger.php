<?php
/*
	{
		"AUTHOR":"Matheus Maydana",
		"CREATED_DATA": "22/11/2018",
		"CONTROLADOR": "Debugger",
		"LAST EDIT": "22/11/2018",
		"VERSION":"0.1.1"
	}
*/
class Model_Debugger {

	private $_hoje = HOJE;

	private $_agora = AGORA;

	private $_ip = IP;

	private $_PDO;

	/* CLASSE DE DEBUGGER, FAZER ALGO COM ISSO! É SÓ ALTERAR AQUI, MUDA EM TUDO!*/
	function __construct($e, $method){

		/* SE E FOR UM OBJETO (OBJETO EXEPTION DA QUERY - Exception $e) */
		if(is_object($e)){

			/* SETA VARIAVEIS */
			$cliente = 'Desconhecido';
			if(defined('CLIENTE')){
				$cliente = CLIENTE;
			}

			$log_codigo = 'Desconhecido';
			if(defined('LOG_CODIGO')){
				$log_codigo = LOG_CODIGO;
			}

			$dominio_site = 'Desconhecido';
			if(defined('DOMINIO_SITE')){
				$dominio_site = DOMINIO_SITE;
			}

			$uri = 'Desconhecido';
			if(isset($_SERVER['REQUEST_URI']) and !empty($_SERVER['REQUEST_URI'])){
				$uri = $_SERVER['REQUEST_URI'];
			}

			$http_referer = 'Desconhecido';
			if(isset($_SERVER['HTTP_REFERER']) and !empty($_SERVER['HTTP_REFERER'])){
				$http_referer = $_SERVER['HTTP_REFERER'];
			}

			$line 			= $e->getLine();
			$code 			= $e->getCode();
			$file 			= $e->getFile();
			$message 		= $e->getMessage();
			$uri 			= $uri;
			$referer 		= $http_referer;
			$log_codigo 	= $log_codigo;
			$cliente 		= $cliente;
			$dominio_site 	= $dominio_site;

			/* QUANDO ESTIVER ONLINE */
			if(DEV === false){

				$this->_PDO = $this->conexao();

				/* GRAVAR NO BANCO DE DADOS O ERRO - LOG */
				$this->_PDO->beginTransaction();

				try {
				
					$sql = $this->_PDO->prepare('
						INSERT INTO erro_log 
						(
							err_line,
							err_code,
							err_file,
							err_funcao,
							err_message,
							log_codigo,
							err_cliente,
							err_dominio,
							err_uri,
							err_referer,
							err_data,
							err_hora,
							err_ip
						) 
						VALUES
						(
							:err_line,
							:err_code,
							:err_file,
							:err_funcao,
							:err_message,
							:log_codigo,
							:err_cliente,
							:err_dominio,
							:err_uri,
							:err_referer,
							:err_data,
							:err_hora,
							:err_ip
						)
					');
					$sql->bindParam(':err_line', $line);
					$sql->bindParam(':err_code', $code);
					$sql->bindParam(':err_file', $file);
					$sql->bindParam(':err_funcao', $method);
					$sql->bindParam(':err_message', $message);
					$sql->bindParam(':log_codigo', $log_codigo);
					$sql->bindParam(':err_cliente', $cliente);
					$sql->bindParam(':err_dominio', $dominio_site);
					$sql->bindParam(':err_uri', $uri);
					$sql->bindParam(':err_referer', $referer);
					$sql->bindParam(':err_data', $this->_hoje);
					$sql->bindParam(':err_hora', $this->_agora);
					$sql->bindParam(':err_ip', $this->_ip);
					$sql->execute();

					$this->_PDO->commit();

					sleep(2);

				}catch (Exception $e){

					sleep(3);
					// não pera..
				}

			/* QUANDO FOR LOCAL PARA DEBUGGAR - NÃO SALVA LOG EM BANCO */	
			}else{

				new de(
					array(
						'ERRO' => array(
							'LINE' 		=> $e->getLine(),
							'CODE' 		=>  $e->getCode(),
							'FILE' 		=> $e->getFile(),
							'FUNÇÃO' 	=> $method,
							'MESSAGE' 	=> $e->getMessage()
						),
						'MOMENTO' => array(
							'DATA' 	=> $this->_hoje,
							'HORA' 	=> $this->_agora,
							'IP' 	=> $this->_ip
						),
						'ORIGEM' => array(
							'LOG_CODIGO'	=> $log_codigo,
							'CLIENTE' 		=> $cliente,
							'DOMINIO' 		=> $dominio_site,
							'REQUEST_URI' 	=> $uri,
							'HTTP_REFERER' 	=> $http_referer,
						)
					)
				);
			}
		}
	}

	private function conexao(){

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