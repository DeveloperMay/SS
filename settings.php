<?
/*
{
	"AUTHOR":"Matheus Maydana",
	"CREATED_DATA": "22/11/2018",
	"CONFIG": "Setting",
	"LAST EDIT": "22/11/2018",
	"VERSION":"0.1.1"
}
*/



$local = 'objetiva';
define('BANCO_DADOS', 'psql');













/* LOCAL */
$LOCAL = '/';
if($local == 'casa'){
	$LOCAL = '/SS/';
}

define('LOCAL', $local);

/* DEBUG DESENVOLVIMENTO */
/**
TRUE = DESENVOLVIMENTO
FALSE = PRODUCAO (saveLogs);
**/
define('DEV', true);

/**
** CONFIGURAÇÕES DO MVC
**/
define('DIR', '..'.$LOCAL);

define('SUBDOMINIO', 'SS');

define('SAVE_SESSIONS', 'Sessions');

define('DIR_CLASS', '');

// É NECESSÁRIO QUE A SESSÃO/COOKIE SEJA A MESMA DO SITE
session_save_path(DIR.SAVE_SESSIONS);
session_set_cookie_params(9999999, '/', $_SERVER['SERVER_NAME']);

/* USANDO HOST-VIRTUAL url é só /, no windows é ../mvc_maydana/ */
define('URL_STATIC', '/');

// Usado somente no windows - xampp /* USADO PELO CONTROLE DE MVCs que eu criei em casa */
define('DIRETORIO_PROJETO', DIR);		// diretório

/**
** CONFIGURAÇÕES
**/

define('LANGS', array(
		'br' => '',
		'en' => 'en'
	)
);
/**
** BANCO DADOS
** @param pgsql ou mysql
** @see demais dados em Model/Bancodados/Pssw
**/

define('ACTION', 'maydana_system');

/* NOME CLIENTE */

define('URL_SITE', 'https://ss.com.br/');

define('DOMINIO_SITE', 'ss.com.br');

define('HOJE', date('d/m/Y'));

define('AGORA', date('H:i:s'));

define('IP', $_SERVER['REMOTE_ADDR']);

define('LAYOUT', 'layout');						// nome do layout (.html)

define('VERSION_MVC', '0.2.1'); 				// Version MVC

define('NOME_SISTEMA', 'ss Sites');			// Nome Projeto

define('NOME_PROJETO', 'ss - Sites');			// Nome Projeto

define('EXTENSAO_VISAO', '.html'); 				// Extenção das views

define('EXTENSAO_CONTROLADOR', '.php'); 		// Extenção das controllers


/**
** FUNÇÕES E MODELS
**/

define('HASH_PASSWORD', '123');


/**
** CONFIGURAÇÕES IMAGEMS
**/
session_start();
/*
$id_cliente = null;
$array = $_SESSION[CLIENTE]['login'] ?? array();
foreach ($array as $id_conta => $info_conta){
	$id_cliente = $id_conta;
}
define('URL_DADOS', DIR.'/Dados/');
define('URL_DADOS_CLIENTE', URL_DADOS.$id_cliente.'/');
define('URL_IMG_VEICULOS', URL_DADOS.$id_cliente.'/veiculos/');
define('URL_IMG_VEICULOS_THUMBS', URL_IMG_VEICULOS.'thumbs/');
define('URL_IMG_VEICULOS_ORIGIN', URL_IMG_VEICULOS.'origin/');
define('HEIGHT_THUMB', 190);
define('WIDTH_THUMB', 240);
define('HEIGHT_VIEW', 520);
define('WIDTH_VIEW', 840);
define('FORMATO_THUMBS', '.jpg');
define('SUBNOME_THUMBS', '_thumb');


if(!is_dir(URL_DADOS_CLIENTE)){
	mkdir(URL_DADOS_CLIENTE);

	mkdir(URL_DADOS_CLIENTE.'veiculos');
	mkdir(URL_DADOS_CLIENTE.'/veiculos/thumbs');
	mkdir(URL_DADOS_CLIENTE.'veiculos/origin');
}*/
