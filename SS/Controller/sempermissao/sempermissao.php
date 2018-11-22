<?php
/*
	{
		"AUTHOR":"Matheus Maydana",
		"CREATED_DATA": "22/11/2018",
		"CONTROLADOR": "Sem Permissao",
		"LAST EDIT": "22/11/2018",
		"VERSION":"0.0.1"
	}
*/
class Sempermissao {

	public $_cor;

	private $_push = false;

	private $metas = array();

	function __construct(){

		$this->_cor = new Model_GOD;

		if(isset($_POST['push']) and $_POST['push'] == 'push'){
			$this->_push = true;
		}
	}

	function index(){

		$mustache = array();

		$this->metas['title'] = 'Sem permissão para acessar este conteúdo - '.$_SESSION['login'][LOG_CODIGO]['log_nome'];

		if($this->_push === false){

			echo $this->_cor->_visao($this->_cor->_layout('sempermissao', 'sempermissao', $this->metas), $mustache);

		}else{

			echo $this->_cor->push('sempermissao', 'sempermissao', $mustache, $this->metas);
		}
	}
}