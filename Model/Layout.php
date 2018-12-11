<?php
/*
{
	"AUTHOR":"Matheus Maydana",
	"CREATED_DATA": "22/11/2018",
	"MODEL": "Layout",
	"LAST EDIT": "22/11/2018",
	"VERSION":"0.0.1"
}
*/


/**
**
** @see o Layout precisa ser formato .HTML ou confirgurar no arquivo Setting.php 
**
**/

class Model_Layout extends Model_View{

	public function setLayout($st_view){

		try{

			if(file_exists(DIR_CLASS.DIR.SUBDOMINIO.'/Layout/'.$st_view.EXTENSAO_VISAO)){

				$this->st_view = $st_view;
			}

		}catch(PDOException $e){

			/**
			** ERRO, LAYOUT NÃO ENCONTRADO
			**/
			new de('layout não encontrado');
		}
	}

	public function Layout($metas){

		try{

			$layout = LAYOUT;

			/* COLOCAR CACHE NOS ARQUIVOS STATICOS QUANDO NÃO ESTÁ EM PRODUÇÃO */
			$cache = '';
			$random = mt_rand(10000, 99999);

			if(DEV !== true){
				$cache = '?cache='.$random;
			}

			$mustache = array(
				'{{static}}' 		=> URL_STATIC,
				'{{header}}' 		=> $this->_headerHTML($metas),
				'{{cache}}' 		=> $cache,
				'{{lang}}'			=> $this->_url,
				'{{ano}}'			=> date('Y'),
				'{{dominio_site}}'	=> DOMINIO_SITE,
				'{{menu}}'			=> ''
			);

			$layout = str_replace(array_keys($mustache), array_values($mustache), file_get_contents(DIR_CLASS.DIR.'Layout/'.$layout.EXTENSAO_VISAO));

			return $layout;

		}catch(PDOException $e){

			new de('nada de layout');
			/**
			** ERRO, ARQUIVO LAYOUT NÃO ENCONTRADO
			**/
		} 
	}

	private function _headerHTML($metas){

		$url = $this->url;
		
		$noscript = '<noscript><meta  http-equiv="refresh"  content="1; URL=/noscript"  /></noscript>';
		if(isset($url[1]) and $url[1] == 'noscript'){

			$noscript = '';
		}

		$meta_title = $metas['title'] ?? 'SS - Fotos';
		$meta_description = $metas['description'] ?? 'Publique suas fotos instantaneamente, mostre para o mundo !';

		$header = <<<php
<title>{$meta_title}</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, height=device-height, user-scalable=yes, initial-scale=1" />
<meta name="msapplication-tap-highlight" content="no" />
<meta name="format-detection" content="telephone=no" />
<meta name="description" content="{$meta_description}">
<meta name="robots" content="noindex, nofollow" />
{$noscript}
<meta name="msapplication-tap-highlight" content="no"/>
<meta name="apple-mobile-web-app-title" content="SS"/>
<meta name="application-name" content="SS"/>
<meta name="msapplication-TileImage" content="/img/site/caveira.png"/>
<meta name="msapplication-TileColor" content="#e8e6e8"/>
<meta name="theme-color" content="#1c5f8e"/>
<meta name="author" content="Bames" />
<link rel="manifest" href="/manifest.json"/>
<link rel="shortcut icon" href="/img/site/caveira.png" type="image/x-icon">
<link rel="icon" href="/img/site/caveira.png" type="image/x-icon">
php;

		return $header;
	}


	protected function _navi(){

		/* SETA O LOG_CODIGO DO USUARIO LOGADO */
		$log_codigo = null;
		$esc_codigo = null;
		if(defined('LOG_CODIGO')){		
			$log_codigo = LOG_CODIGO;
		}
		if(defined('ESC_CODIGO')){
			$esc_codigo = ESC_CODIGO;
		}


		$url 		= new Model_Pluggs_Url;

		$conexao = new Model_Bancodados_Conexao;
		$PDO = $conexao->conexao();

		/* BUSCA INFORMAÇÕES DO USUÁRIO */

		$PDO->beginTransaction();
		$html = '';

		try {

			$sql = $PDO->prepare("
				SELECT 
					log_group
				FROM login
				WHERE esc_codigo = :esc_codigo AND log_codigo = :log_codigo
			");
			$sql->bindParam(':esc_codigo', $esc_codigo);
			$sql->bindParam(':log_codigo', $log_codigo);
			$sql->execute();
			$fetch = $sql->fetch(PDO::FETCH_ASSOC);
			
			$PDO->commit();

			/* NAVEGA PELOS MENUS CONFIGURADO */
			foreach ($this->_menu as $menu){

				foreach ($menu as $key => $nome_menu){

					/* MOSTRA O MENU QUE SEU LOG_CODIGO TEM ACESSO / PERMISSAO PARA VER */
					if(isset($fetch['log_group']) and $fetch['log_group'] >= $key){

						$nomemenu = $url->trataURL($nome_menu);

						$html .= <<<html
						- <button onclick="openURL('/{$nomemenu}');">$nome_menu</button> -
html;
					}
				}
			}

		if(defined('ESC_CODIGO')){
			$html .= <<<html
				- <button onclick="window.location.href='/login/logout?s={$log_codigo}'" >SAIR</button> -
html;
		}
		
			return $html;

		}catch (Exception $e){

			$PDO->rollBack();
			new Model_Debugger($e, __METHOD__);

			return $html;
		}

	}
}