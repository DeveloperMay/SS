<?php
/*
{
	"AUTHOR":"Matheus Mayana",
	"CREATED_DATA": "22/11/2018",
	"MODEL": "GOD",
	"LAST EDIT": "22/11/2018",
	"VERSION":"0.0.1"
}
*/

class Model_God extends Model_Layout{


	public $_conexao;

	public $_url = '/';

	public $url;

	public $lang = '';

	function __construct(){

		$url = $_SERVER['REQUEST_URI'];

		$this->url = explode('/', $url);

		foreach (LANGS as $lang => $null){

			if(isset($this->url[1]) and $this->url[1] === $lang){
				// Remove 'Ignora' o langs (br, en, etc..)
				unset($this->url[1]);

				// Salva o leng atual, exp br
				$this->lang = $null;
				$this->_url = $this->_url.$null.$this->_url;
				$novaURL = implode('/', $this->url);
				$novaURL = explode('/', $novaURL);

				// AQUI, ignora a lang e remonta a url USAR ESSA PORRA, pro mvc funfa
				$this->url = $novaURL;
			}
		}
	}

	// Retorna URL já ignorando o lang
	function getUrl(){
		return $this->url;
	}

	// Retorna o lang atual
	function getLang(){
		return $this->lang;
	}

	function _layout($controlador, $visao, $metas, $template = LAYOUT){

		$this->setLayout($template);
		$this->setView($controlador, $visao);

		$mustache = array(
			'{{visao}}' => $this->visao()
		);		

		return $this->comprimeHTML(str_replace(array_keys($mustache), array_values($mustache), $this->Layout($metas)));
	}

	function _visao($visao, $bigodim = null){

		if(is_array($bigodim) and $bigodim !== null and $bigodim !== ''){

			@$var = $this->comprimeHTML(str_replace(array_keys($bigodim), array_values($bigodim), $visao));

			return $var;
		
		}else{

			return $this->comprimeHTML(str_replace('{{visao}}', $bigodim, $visao));
		}
	}

	function push($controlador, $visao, $bigodim = null, $metas){
		$this->setView($controlador, $visao);

		if(is_array($bigodim) and $bigodim !== null and $bigodim !== ''){

			@$html = $this->comprimeHTML(str_replace(array_keys($bigodim), array_values($bigodim), $this->visao())); 
			
			$result['html'] = $html;
			$result['metas'] = $metas;

			return json_encode($result);

		}else{

			$html = $this->comprimeHTML(str_replace('{{visao}}', $bigodim, $this->visao()));

			$result['html'] = $html;
			$result['metas'] = $metas;

			return json_encode($result);
		}
	}

	function Erro404($xhr, $mustache = array()){

		if($xhr === false){

			echo $this->_visao($this->_layout('erro404', 'erro404'), $mustache);

		}else{

			echo $this->push('erro404', 'erro404', $mustache);
		}
	}

	function comprimeHTML($html){

		$html = preg_replace(array("/\/\*(.*?)\*\//", "/<!--(.*?)-->/", "/\t+/"), ' ', $html);

		$mustache = array(
			"\t"		=> '',
			""			=> ' ',
			PHP_EOL		=> '',
			'> <'		=> '><',
			'  '		=> '',
			'   '		=> '',
			'    '		=> '',
			'     '		=> '',
			'> <'		=> '><',
			'
'						=> ''
		);
		
		return str_replace(array_keys($mustache), array_values($mustache), $html);
	}

}