<?php
/*
	{
		"AUTHOR":"Matheus Maydana",
		"CREATED_DATA": "26/12/2018",
		"CONTROLADOR": "Login",
		"LAST EDIT": "26/12/2018",
		"VERSION":"0.0.1"
	}
*/
class Login {

	private $_cor;

	private $_push = false;

	public $_valida;

	public $_conexao;

	private $_url;

	private $_lang;

	private $metas = array();

	function __construct(){

		$this->_cor = new Model_GOD;

		$this->_valida = new Model_Pluggs_Validacao;

		$conexao = new Model_Bancodados_Conexao;

		$this->_conexao = $conexao->conexao();

		if(isset($_POST['push']) and $_POST['push'] == 'push'){
			$this->_push = true;
		}

		$this->_url = $this->_cor->getUrl();

		$this->_lang = $this->_cor->getLang();
	}

	function index(){

		$this->metas['title'] = 'Login';

		/* Gera token para login */	
		$token = $this->_cor->_TokenForm('login');
		$mustache = array(
			'{{ token }}' => $token
		);

		if($this->_push === false){

			echo $this->_cor->_visao($this->_cor->_layout('login', 'login', $this->metas), $mustache);

		}else{

			echo $this->_cor->push('login', 'login', $mustache, $this->metas);
		}
	}

	function entrar(){

		if(isset($_POST['token'], $_POST['id'], $_POST['senha']) and !empty($_POST['id']) and !empty($_POST['senha'])){

			/* Checa se o Token passado é o mesmo salvo em sessão UNICA */
			$checkToken = $this->_cor->_verificaToken('login', $_POST['token']);

			/* Se for válido */
			if($checkToken === true){

				$id 	= $_POST['id'] ?? '';
				$senha 	= $_POST['senha'] ?? '';

				/* Valida ID e senha */
				$validacaoLogin = $this->_valida->loginEntrar($id, $senha);

				/* Se houver NENHUM erro */
				if($validacaoLogin === true){

					
				}

				// Retorna mensagem de erro
				echo json_encode(array('res' => 'no', 'info' => $validacaoLogin));
				exit;
			}

			// Token Invalido
			echo json_encode(array('res' => 'no', 'info' => 'Ops, algo de errado não está certo..'));
			exit;
		}
		
		// Não há posts
		echo json_encode(array('res' => 'no', 'info' => 'Você não deveria estar vendo esta mensagem, hmm..'));
		exit;
	}
}