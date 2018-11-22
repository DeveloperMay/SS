<?php
/*
{
	"AUTHOR":"MVC_Maydana",
	"CREATED_DATA": "22/11/2018",
	"NUCLEO": "MVC_Maydana",
	"LAST EDIT": "22/11/2018",
	"VERSION":"0.0.1"
}
*/

/**
** Agradecer ao Moisés (https://github.com/themoiza)
** que me ajudou, me auxiliando até aqui.
**/
class MVC_Maydana {

	protected $controller = 'index';
	protected $visao 	  = 'index';
	protected $action 	  = 'index';
	protected $url 		  = array();

	public $lang = '';

	function __construct(){

		// COLOCAR A URL EM UM ARRAY PARA TER CONTROLE MVC
		if(isset($_SERVER['REQUEST_URI']) and !empty($_SERVER['REQUEST_URI'])){

			$url = $this->parseUrl($_SERVER['REQUEST_URI']);
			$this->url = $url;
		}

		foreach (LANGS as $lang => $null){

			if(isset($this->url[1]) and $this->url[1] === $lang){
				// Remove 'Ignora' o langs (br, en, etc..)
				unset($this->url[1]);

				// Salva o leng atual, exp br
				$this->lang = $lang;
				$novaURL = implode('/', $this->url);
				$novaURL = explode('/', $novaURL);

				// AQUI, ignora a lang e remonta a url USAR ESSA PORRA, pro mvc funfa
				$this->url = $novaURL;
			}
		}

		if(empty($this->url[1])){

			// SE NÃO HOUVER NADA NA URL, EXIBE O CONTROLADOR/VISÃO INDEX
			$this->controller = 'index';
			$this->action 	  = 'index';
			$this->visao 	  = 'index';

			try{

				require_once (DIR.SUBDOMINIO.'/Controller/index/index.php');

			}catch(PDOException $e){

				/**
				** Caso controlador não seja encontrado
				**/
			}

			$controlador = new $this->controller;
			$controlador->index();

		}else{

			$controllador = str_replace('-', '', $this->url[1]);

			// EXISTE ALGO NA URL, VERIFICAR SE OQUE TEM NA URL EXISTE UM CONTROLADOR
			if(file_exists(DIR.SUBDOMINIO.'/Controller/'.$controllador.'/'.$controllador.EXTENSAO_CONTROLADOR)){

				// MONTA O CONTROLADOR E ACTION (SE TIVER NA URL)
				$this->controller = $controllador;
				$this->visao 	  = $controllador;

				try{

					if(file_exists(DIR.SUBDOMINIO.'/Controller/'.$controllador.'/'.$controllador.EXTENSAO_CONTROLADOR)){

						require_once (DIR.SUBDOMINIO.'/Controller/'.$controllador.'/'.$controllador.EXTENSAO_CONTROLADOR);
		
					}else{

						require_once (DIR.SUBDOMINIO.'/Controller/index/index'.EXTENSAO_CONTROLADOR);
					}
				

				}catch(PDOException $e){

					/**
					** Caso controlador não seja encontrado
					**/
				}

				$controlador = new $this->controller;

				// VERIFICA SE EXISTE A ACTION NO CONTROLADOR,
				if(isset($this->url[2]) and !empty($this->url[2])){

					$action = str_replace('-', '', $this->url[2]);

					if(method_exists($controlador, $action)){

						$this->action 	  = $action;
						// AQUI EXECUTA A ACTION EXISTENTE NO CONTROLADOR E NA URL
						$controlador->{$this->action}();

					}else{
						// ACTION NÃO ENCONTRADA / 404!
						$this->error404();
					}
				}else{
					// AQUI EXECUTA A ACTION INDEX (TODO CONTROLADOR TEM)
					$controlador->index();

				}

			}else{
				// 404 CONTROLADOR NÃO EXISTE
				$this->error404();
			}
		}
	}
	public function error404(){

		try{

			require_once (DIR.SUBDOMINIO.'/Controller/erro404/erro404'.EXTENSAO_CONTROLADOR);

		}catch(PDOException $e){

			/**
			** Caso controlador não seja encontrado
			**/
		}

		$erro404 = new erro404;

		$erro404->index();
	}

	// "QUEBRA" O URL PARA DEFINIR OQUE É CONTROLADOR, ACTION..
	private function parseUrl($url){

		$array = explode('/', $url);
		$temp = array();

		foreach ($array as $key => $value) {

			$temp[$key] = preg_replace('/\?.*$|\!.*$|#.*$|\'.*$|\@.*$|\$.*$|&.*$|\*.*$|\+.*$|\..*$/', '', $value);
		}
		
		return $temp;
	}
}

function _autoload($classe){

	$php = str_replace('_', '/', $classe);

	try{

		if(is_file(DIR.DIR_CLASS.$php.EXTENSAO_CONTROLADOR)){

			require_once (DIR.DIR_CLASS.$php.EXTENSAO_CONTROLADOR);
		}
		
	}catch(PDOException $e){

		/**
		** @see Remover o ECHO antes de publicar
		**/

		echo $classe.': Classe nao encontrada';
	}
}

spl_autoload_register('_autoload');

/**
** RESPONSAVEL PELO DEBUG, exemplo, new de($variavel); ou new de('allow');
** @see Créditos - Criador : Moises - https://github.com/themoiza
**/
class de{

	function __construct($a){

		if(is_array($a)){

			echo '<pre style="color: lime; background-color: black; width: 100%; min-height: 100vh; margin: auto; font-size: 18px;">';
			print_r($a);
			exit;

		}else{

			echo '<pre style="color: lime; background-color: black; width: 100%; min-height: 100vh; margin: auto; font-size: 18px;">';
			var_dump($a);
			exit;
		}
	}
}