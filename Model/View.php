<?php
/*
{
	"AUTHOR":"Matheus Maydana",
	"CREATED_DATA": "22/11/2018",
	"MODEL": "View",
	"LAST EDIT": "22/11/2018",
	"VERSION":"0.0.1"
}
*/

/**
**
** @see a View precisa ser formato .HTML ou confirgurar no arquivo Setting.php 
**
**/

class Model_View extends Model_Functions_Functions{

	public function setView($controlador, $st_view){

		try{

			if(file_exists(DIR.SUBDOMINIO.'/View'.$this->lang.'/'.$controlador.'/'.$st_view.EXTENSAO_VISAO)){

				$this->st_view = $st_view;
				$this->st_controlador = $controlador;

			}else{
				
				new de('visao não encontrado');
			}

		}catch(PDOException $e){

			/**
			** ERRO, VISÃO NÃO ENCONTRADA
			**/
		}
	}

	function visao(){

		try{
			
			if(isset($this->st_view)) {

				$visao = $this->st_view;
				$controlador = $this->st_controlador;

				if(file_exists(DIR.SUBDOMINIO.'/View'.$this->lang.'/'.$controlador.'/'.$visao.EXTENSAO_VISAO)){


				$mustache = array(
					'{{navegacao}}' => $this->_navegacao()
				);

				$visao = str_replace(array_keys($mustache), array_values($mustache), file_get_contents(DIR.SUBDOMINIO.'/View'.$this->lang.'/'.$controlador.'/'.$visao.EXTENSAO_VISAO));

					return $visao;

				}else{
					/**
					** Erro na visão
					**/
					new de('visao não encontrado');
					//echo 'erro no diretorio da visão';
				}
			}

		}catch(PDOException $e){

			new de('visao não encontrado');
			/**
			** ERRO, ARQUIVO VISÃO NÃO ENCONTRADO
			**/
		}
	}

	private function _navegacao(){

		$controlador = '';
		$acao 		 = '';
		$method 	 = '';
		$descricao	 = '';

		if(isset($this->url[1]) and !empty($this->url[1])){
			$controlador = '<a href="/'.$this->url[1].'">'.$this->url[1].'</a>';
		}
		if(isset($this->url[2]) and !empty($this->url[2])){
			$acao = ' > <a href="/'.$this->url[1].'/'.$this->url[2].'">'.$this->url[2].'</a>';
		}
		if(isset($this->url[3]) and !empty($this->url[3])){
			$method = ' > <a href="/'.$this->url[1].'/'.$this->url[2].'/'.$this->url[3].'">'.$this->url[3].'</a>';
		}
		if(isset($this->url[4]) and !empty($this->url[4])){
			$descricao = ' > '.$this->url[4];
		}

		$navegacao = '<a href="/">início</a> > '.$controlador.$acao.$method.$descricao;

		$html = '<p>'.$navegacao.'</p>';

		return $html;
	}
}