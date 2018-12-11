<?php
/*
	{
		"AUTHOR":"Matheus Maydana",
		"CREATED_DATA": "22/11/2018",
		"CONTROLADOR": "Index",
		"LAST EDIT": "22/11/2018",
		"VERSION":"0.0.1"
	}
*/
class Index {

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
		$this->metas['title'] = 'Início';

		if($this->_push === false){

			echo $this->_cor->_visao($this->_cor->_layout('index', 'index', $this->metas), $mustache);

		}else{

			echo $this->_cor->push('index', 'index', $mustache, $this->metas);
		}
	}
}