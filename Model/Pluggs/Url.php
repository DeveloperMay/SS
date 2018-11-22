<?php
/*
{
	"AUTHOR":"Matheus Mayana",
	"CREATED_DATA": "22/11/2018",
	"MODEL": "Utilit",
	"LAST EDIT": "22/11/2018",
	"VERSION":"0.0.1"
}
*/

class Model_Pluggs_Url {

	public function trataURL($string){

		$especiais = array(
			'á', 'à', 'â', 'ã', 'Á', 'À', 'Â', 'Ã',
			'é', 'è','ê', 'É', 'È', 'Ê', 
			'í', 'ì', 'î', 'Í', 'Ì', 'Î',
			'ó', 'ò', 'ô', 'õ', 'Ó', 'Ò', 'Ô', 'Õ',
			'ú', 'ù', 'û', 'Ú', 'Ù', 'Û',
			'ç', 'Ç'
		);
		
		$normais = array(
			'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a',
			'e', 'e', 'e', 'e', 'e', 'e',
			'i', 'i', 'i', 'i', 'i', 'i',
			'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
			'u', 'u', 'u', 'u', 'u', 'u',
			'c', 'c'
		);

		$string = str_replace($especiais, $normais, $string);

		return strtolower(str_replace(' ', '-', $string));
	}

	public function url(){

		// COLOCAR A URL EM UM ARRAY PARA TER CONTROLE MVC
		if(isset($_SERVER['REQUEST_URI']) and !empty($_SERVER['REQUEST_URI'])){

			$url = $this->explodeUrl($_SERVER['REQUEST_URI']);

			return $this->url = $url;
		}
	}

	public function explodeUrl($url){

		$array = explode('/', $url);
		$temp = array();

		foreach ($array as $key => $value) {

			$temp[$key] = preg_replace('/\!.*$|#.*$|\'.*$|\$.*$|&.*$|\*.*$|-.*$|\+.*$|/', '', $value);
		}
		
		return $temp;
	}
}