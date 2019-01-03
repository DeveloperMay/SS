<?php
/*
	{
		"AUTHOR":"Matheus Maydana",
		"CREATED_DATA": "13/12/2018",
		"CONTROLADOR": "Conta",
		"LAST EDIT": "13/12/2018",
		"VERSION":"0.0.1"
	}
*/
class Conta {

	private $_cor;

	private $_push = false;

	private $_url;

	private $_lang;

	private $metas = array();

	function __construct(){

		$this->_cor = new Model_GOD;

		if(isset($_POST['push']) and $_POST['push'] == 'push'){
			$this->_push = true;
		}

		$this->_url = $this->_cor->getUrl();

		$this->_lang = $this->_cor->getLang();

		header('Access-Control-Allow-Origin: *');
	}

	function index(){

		$mustache = array();
		$this->metas['title'] = 'Conta - Abigor';

		if($this->_push === false){

			echo $this->_cor->_visao($this->_cor->_layout('conta', 'conta', $this->metas), $mustache);

		}else{

			echo $this->_cor->push('conta', 'conta', $mustache, $this->metas);
		}
	}

	function criar(){

		$mustache = array();
		$this->metas['title'] = 'Criar conta';

		if($this->_push === false){

			echo $this->_cor->_visao($this->_cor->_layout('conta', 'criar', $this->metas), $mustache);

		}else{

			echo $this->_cor->push('conta', 'criar', $mustache, $this->metas);
		}
	}

	function login(){

		$mustache = array();
		$this->metas['title'] = 'Login conta';

		if($this->_push === false){

			echo $this->_cor->_visao($this->_cor->_layout('conta', 'login', $this->metas), $mustache);

		}else{

			echo $this->_cor->push('conta', 'login', $mustache, $this->metas);
		}
	}

	function regras(){

		$mustache = array();
		$this->metas['title'] = 'Abigor - fotos';

		if($this->_push === false){

			echo $this->_cor->_visao($this->_cor->_layout('abigor', 'regras', $this->metas), $mustache);

		}else{

			echo $this->_cor->push('abigor', 'regras', $mustache, $this->metas);
		}
	}
}