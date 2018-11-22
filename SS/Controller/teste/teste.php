<?php
/*
	{
		"AUTHOR":"Matheus Maydana",
		"CREATED_DATA": "22/11/2018",
		"CONTROLADOR": "Teste",
		"LAST EDIT": "22/11/2018",
		"VERSION":"0.0.1"
	}
*/
class Teste {
	public $_func;

	private $_cor;

	private $_push = false;

	private $metas = array();

	private $_controlador = 'teste';

	private $_conexao;

	private $PDO;

	function __construct(){

		$this->_func = new Model_Functions_Functions;

		$this->_cor = new Model_GOD;

		$this->_conexao = new Model_Bancodados_Conexao;

		$this->PDO = $this->_conexao->conexao();

		if(isset($_POST['push']) and $_POST['push'] == 'push'){
			$this->_push = true;
		}
	}

	function index(){

		$log_nome = 'Teste - '.$_SESSION['login'][LOG_CODIGO]['log_nome'];
		$log_senha = '123';

		$this->PDO->beginTransaction();

		try {

			$sql = "INSERT INTO login (log_nome, log_senha) VALUES (:log_nome, :log_senha)";
			$sql = $this->PDO->prepare($sql);
			$sql->bindParam(':log_nome', $log_nome);
			$sql->bindParam(':log_senha', $log_senha);
			$sql->execute();

			$sql = "INSERT INTO cad_pessoa (pes_nome, pes_cpf) VALUES (:pes_nome, :pes_cpf)";
			$sql = $this->PDO->prepare($sql);
			$sql->bindParam(':pes_nome', $log_nome);
			$sql->bindParam(':pes_cpf', $log_senha);
			$sql->execute();

			$this->PDO->commit();

		}catch (Exception $e){

			echo $e->getMessage();

			$this->PDO->rollBack();

		}


		$mustache = array();

		$this->metas['title'] = 'SS - Teste';

		if($this->_push === false){

			echo $this->_cor->_visao($this->_cor->_layout($this->_controlador, $this->_controlador, $this->metas), $mustache);

		}else{

			echo $this->_cor->push($this->_controlador, $this->_controlador, $mustache, $this->metas);
		}
	}
}