<?php
/*
	"AUTHOR":"Matheus Maydana",
	"CREATED_DATA": "22/11/2018",
	"MODEL": "Render HTML",
	"LAST EDIT": "22/11/2018",
	"VERSION":"0.0.1"
*/

class Model_Functions_Render{

	public $_util;

	public $_url;

	public $_page;

	function __construct(){

		$this->_util = new Model_Pluggs_Utilit;

		$this->_url = new Model_Pluggs_Url;

		$this->_page = $_GET['p'] ?? 1;

		if($this->_page <= 0){
			$this->_page = 1;
		}

	}

	function renPagination($controlador, $totalPaginas){

		$back = $this->_page - 1;
		$next = $this->_page + 1;


		if($back <= 0){
			$back = 1;
		}

		if($next >= $totalPaginas){
			$next = $totalPaginas;
		}

		$paginas = '';
		for ($i = 1; $i < $totalPaginas; $i++){
			$ativo = 'style="color: gray"';
			$num = ((int) $i + 1);
			if($this->_page == $num){
				$ativo = 'style="color: red"';
			}

			$paginas .= ' <a href="/'.$controlador.'?p='.$i.'" '.$ativo.'>'.$i.'</a> ';
		}

		$html = <<<html
		<p>
			<a href="/{$controlador}?p={$back}"><<<</a>
			{$paginas}
			<a href="/{$controlador}?p={$next}">>>></a>
		</p>
html;
		return $html;

	}

	function compAcao($controlador, $codigo, $descricao){

		$html = <<<html
		<div class="comp-acao">
			<button>Ações</button>
			<ul>
				<li><button onclick="openURL('/{$controlador}/editar/{$codigo}/{$this->_url->trataURL($descricao)}');">Editar</button></li>
				<li><button onclick="openURL('/{$controlador}/excluir/{$codigo}');">Excluir</button></li>
			</ul>
		</div>
html;

		return $html;
	}
}