<?php
/*
	{
		"AUTHOR":"Matheus Maydana",
		"CREATED_DATA": "10/12/2018",
		"CONTROLADOR": "Abigor",
		"LAST EDIT": "10/12/2018",
		"VERSION":"0.0.1"
	}
*/
class Abigor {

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
	}

	function index(){

		$mustache = array();
		$this->metas['title'] = 'Abigor - fotos';

		if($this->_push === false){

			echo $this->_cor->_visao($this->_cor->_layout('abigor', 'abigor', $this->metas), $mustache);

		}else{

			echo $this->_cor->push('abigor', 'abigor', $mustache, $this->metas);
		}
	}

	function termos(){

		$mustache = array();
		$this->metas['title'] = 'Abigor - fotos';

		if($this->_push === false){

			echo $this->_cor->_visao($this->_cor->_layout('abigor', 'termos', $this->metas), $mustache);

		}else{

			echo $this->_cor->push('abigor', 'termos', $mustache, $this->metas);
		}
	}

	function privacidade(){

		$mustache = array();
		$this->metas['title'] = 'Abigor - fotos';

		if($this->_push === false){

			echo $this->_cor->_visao($this->_cor->_layout('abigor', 'privacidade', $this->metas), $mustache);

		}else{

			echo $this->_cor->push('abigor', 'privacidade', $mustache, $this->metas);
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