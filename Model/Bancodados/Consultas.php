<?php
/*
{
	"AUTHOR":"Matheus Mayana",
	"CREATED_DATA": "22/11/2018",
	"MODEL": "Consultas",
	"LAST EDIT": "22/11/2018",
	"VERSION":"0.0.1"
}
*/
class Model_Bancodados_Consultas extends Model_Bancodados_Login {

	public $_conexao;

	public $_PDO;

	public $_util;

	public $_hoje = HOJE;

	public $_agora = AGORA;

	public $_ip = IP;

	public $id_conta;

	public $_url;

	public $_controlador;

	public $_render;

	public $_results = 3;

	public $_page;

	public $esc_codigo;

	public $log_codigo;

	public $cliente;

	public $_grid;

	function __construct($conexao){

		$this->_conexao = $conexao->conexao();

		$this->_PDO = $conexao->conexao();

		$this->_util = new Model_Pluggs_Utilit;

		$this->_url = new Model_Pluggs_Url;

		$this->_render = new Model_Functions_Render;

		$url = $this->_url->url();

		$this->_controlador = $url[1] ?? '';

		$this->_page = $_GET['p'] ?? 0;

		if($this->_page <= 0){
			$this->_page = 0;
		}


		if(isset($url[1]) and $url[1] !== 'login'){

			/* SE NÃO TIVER SESSAO LOGIN, CAI FORA */
			/*if(!isset($_SESSION['login']) and empty($_SESSION['login'])){

				 PRECISA ESTAR LOGADO PARA ENTRAR NO SISTEMA 
				header('location: /login');
			}*/

			/* SE EXISTIR A SESSÃO, VERIFICA SE EXISTE O DADO NO DB, SE NÃO TIVER LIMPA A SESSION */
			if(isset($_SESSION['login'])){

				define('LOG_CODIGO', key($_SESSION['login']));
				$log_codigo = $this->getInfoCliente('log_codigo', key($_SESSION['login']));

				try {

					$this->_PDO->beginTransaction();

					/* RECUPERA ESC_CODIGO */
					$sql = $this->_PDO->prepare('
						SELECT
							log.log_codigo,
							esc.esc_codigo,
							esc.esc_nome
						FROM login AS log
						LEFT JOIN escola AS esc ON esc.esc_codigo = log.esc_codigo
						WHERE log.log_codigo = :log_codigo AND log.esc_codigo = esc.esc_codigo
					');
					$sql->bindParam(':log_codigo', $log_codigo);
					$sql->execute();
					$escola = $sql->fetch(PDO::FETCH_ASSOC);
					$sql = null;

					$this->_PDO->commit();

					$this->esc_codigo = $escola['esc_codigo'];
					$this->cliente = $escola['esc_nome'];
					$this->log_codigo = $escola['log_codigo'];

					define('ESC_CODIGO', $escola['esc_codigo']);
					define('CLIENTE', $escola['esc_nome']);

				} catch(Exception $e){

					$this->_PDO->rollBack();
					new Model_Debugger($e, __METHOD__);
				}

				if($log_codigo === null){
					unset($_SESSION['login']);
				}
			}
		}
	}

	function __destruct(){

		$this->_conexao = null;

		$this->_util = null;

	}

	function saveImagem(array $dados){

		$nome			= $this->_util->basico($dados[0]) ?? '';
		$id_veiculo		= $this->_util->basico($dados[1]) ?? 0;

		$sql = $this->_conexao->prepare('
			INSERT INTO imagens (
				id_veiculo,
				nome
			) VALUES (
				:id_veiculo,
				:nome
			)
		');
		$sql->bindParam(':id_veiculo', $id_veiculo);
		$sql->bindParam(':nome', $nome);
		$sql->execute();
		$fetch = $sql->fetch(PDO::FETCH_ASSOC);
		$sql = null;

		/* SUCESSO */
		$return = 1;

		if($fetch === false){

			/* FALHA */
			$return = 2;
		}

		return $return;
	}

	function _saveLimbo($form){

		/* BUSCA NO DB SE EXISTE ALGUM REGISTRO COM O MESMO IP */
		$sql = $this->_conexao->prepare('
			SELECT 
				acc.id_conta
			FROM conta AS acc
			LEFT JOIN pessoas AS pes ON pes.id_conta = acc.id_conta
			WHERE ip_ultimo_login = :ip_ultimo_login OR ip_criacao = :ip_criacao AND pes.nome IS NOT NULL
			');
		$sql->bindParam(':ip_ultimo_login', $this->_ip);
		$sql->bindParam(':ip_criacao', $this->_ip);
		$sql->execute();
		$temp = $sql->fetchAll(PDO::FETCH_ASSOC);
		$sql = null;

		foreach ($temp as $value){

			/* SE EXISTIR, BUSCA O ID E O NOME DO USUARIO */
			$sql = $this->_conexao->prepare('
				INSERT INTO saveLimbo (
					data,
					hora,
					ip,
					user_relacionado,
					nome_form
				) VALUES (
					:data,
					:hora,
					:ip,
					:user_relacionado,
					:nome_form
				)
			');
			$sql->bindParam(':data', $this->_hoje);
			$sql->bindParam(':hora', $this->_agora);
			$sql->bindParam(':ip', $this->ip);
			$sql->bindParam(':user_relacionado', $id_conta);
			$sql->bindParam(':nome_form', $form);
			$sql->execute();
			$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
			$sql = null;
		}

		$fetch = null;
		$sql = null;
	}

	function getEstados(){

		$sql = $this->_conexao->prepare('
			SELECT
				id,
				nome,
				sigla
			FROM estados
		');
		$sql->execute();
		$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
		$sql = null;

		return $fetch;
	}

	function getCidades(){

		$sql = $this->_conexao->prepare('
			SELECT
				id,
				nome,
				estado_id
			FROM cidades
		');
		$sql->execute();
		$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
		$sql = null;

		return $fetch;
	}

	function getCliente(int $id){

		$sql = $this->_conexao->prepare('
			SELECT
				pes.id AS id_cliente,
				est.nome AS estado,
				cid.nome AS cidade,
				pes.telefone,
				pes.whatsapp,
				pes.nascimento,
				pes.sexo,
				pes.nome,
				pes.tipo,
				pes.id_conta,
				pes.est_codigo,
				pes.cid_codigo,
				pes.rg,
				pes.cpf,
				pes.celular,
				pes.bai_codigo,
				pes.descricao
			FROM pessoas AS pes
			LEFT JOIN cidades AS cid ON cid.id = pes.cid_codigo
			LEFT JOIN estados AS est ON est.id = pes.est_codigo
			WHERE pes.id = :id AND pes.tipo = 1
			ORDER BY pes.nome ASC
		');
		$sql->bindParam(':id', $id);
		$sql->execute();
		if($sql->errorInfo()[0] !== '00000' and DEV !== true){
			
			$this->saveLogs($sql->errorInfo());
		}elseif($sql->errorInfo()[0] !== '00000' and DEV === true){

			new de($sql->errorInfo());
		}
		$fetch = $sql->fetch(PDO::FETCH_ASSOC);
		$sql = null;

		return $fetch;
	}

	function getVeiculos(){

		$sql = $this->_conexao->prepare("
			SELECT
			img.nome AS imagem,
			vei.id_veiculo::text,
			vei.nome::text,
			vei.modelo::text,
			vei.ano::text,
			vei.cor::text,
			vei.marca::text,
			vei.descricao::text,
				CONCAT(vei.quilometragem, ' Km') AS quilometragem,
				CASE vei.tipo
					WHEN 1 THEN 'Novo'
					WHEN 2 THEN 'Usado'
					ELSE 'Semi-novo'
				END AS tipo,
				CASE vei.portas
					WHEN 1 THEN '2 portas'
					ELSE '4 portas'
				END AS portas,
				CASE vei.publicado
					WHEN 1 THEN 'publicado'
					ELSE 'Não publicado'
				END AS publicado
			FROM veiculo AS vei
			LEFT JOIN imagens AS img ON img.id_veiculo = vei.id_veiculo
			WHERE vei.id_conta = :id_conta
			ORDER BY vei.nome ASC
		");
		$sql->bindParam(':id_conta', $this->id_conta);
		$sql->execute();

		if($sql->errorInfo()[0] !== '00000' and DEV !== true){
			
			$this->saveLogs($sql->errorInfo());
		}elseif($sql->errorInfo()[0] !== '00000' and DEV === true){

			new de($sql->errorInfo());
		}
		$temp = $sql->fetchAll(PDO::FETCH_ASSOC);

		new de($temp);
		$sql = null;

		return $temp;
	}

	function _getVeiculo($id_veiculo){

		$sql = $this->_conexao->prepare("
			SELECT
			id_veiculo::text,
			nome::text,
			modelo::text,
			ano::text,
			cor::text,
			marca::text,
			descricao::text,
			publicado::text,
			tipo::text,
			portas::text,
				CONCAT(quilometragem, ' Km') AS quilometragem
			FROM veiculo
			WHERE id_veiculo = :id_veiculo AND id_conta = :id_conta
			ORDER BY nome ASC
		");
		$sql->bindParam(':id_veiculo', $id_veiculo);
		$sql->bindParam(':id_conta', $this->id_conta);
		$sql->execute();

		if($sql->errorInfo()[0] !== '00000' and DEV !== true){
			
			$this->saveLogs($sql->errorInfo());
		}elseif($sql->errorInfo()[0] !== '00000' and DEV === true){

			new de($sql->errorInfo());
		}
		$temp = $sql->fetchAll(PDO::FETCH_ASSOC);

		$sql = null;

		return $temp;
	}

	function updateSQL($tabela, $params, $where, $id){

		$id = (int) $id;
		$monta_sql = '';
		if(isset($params['quilometragem'])){

			$params['quilometragem'] = (int) $params['quilometragem'];
		}
		foreach ($params as $key => $value){

			$monta_sql .= $key." = :".$key.", ";
		}

		$monta_sql = trim($monta_sql, ', ');
		$sql = $this->_conexao->prepare('
			UPDATE '.$tabela.' SET '.$monta_sql.' WHERE '.$where.' = :id
		');
		foreach ($params as $key => &$value){

			$sql->bindParam($key, $value);
		}
		$sql->bindParam(':id', $id);
		$sql->execute();

		if($sql->errorInfo()[0] !== '00000' and DEV !== true){
			
			$this->saveLogs($sql->errorInfo());
		}elseif($sql->errorInfo()[0] !== '00000' and DEV === true){

			new de($sql->errorInfo());
		}
		$fetch = $sql->fetch(PDO::FETCH_ASSOC);
		$sql = null;

		/* SUCESSO */
		$return = 1;

		if($fetch === false){

			/* FALHA */
			$return = 2;
		}

		return $return;
	}


	function deleteSQL($tabela, $coluna, $id){

		$sql = $this->_conexao->prepare('DELETE FROM '.$tabela.' WHERE '.$coluna.' = :id');
		$sql->bindParam(':id', $id);
		$sql->execute();
		if($sql->errorInfo()[0] !== '00000' and DEV !== true){
			
			$this->saveLogs($sql->errorInfo());
		}elseif($sql->errorInfo()[0] !== '00000' and DEV === true){

			new de($sql->errorInfo());
		}
		$fetch = $sql->fetch(PDO::FETCH_ASSOC);
		$sql = null;

		/* SUCESSO */
		$return = 1;

		if($fetch === false){

			/* FALHA */
			$return = 2;
		}

		return $return;
	}

	function getClientes(){

		/* BUSCA TODOS OS CLIENTES */
		$sql = $this->_conexao->prepare('
			SELECT
				pes.id AS id,
				est.nome AS estado,
				cid.nome AS cidade,
				pes.telefone,
				pes.whatsapp,
				pes.nascimento,
				pes.sexo,
				pes.nome,
				pes.tipo,
				pes.id_conta,
				pes.est_codigo,
				pes.cid_codigo,
				pes.rg,
				pes.cpf,
				pes.celular,
				pes.bai_codigo,
				pes.descricao,
				CASE pes.sexo
					WHEN 1 THEN \'Masculino\'
					ELSE \'Feminino\'
				END AS sexo
			FROM pessoas AS pes
			LEFT JOIN estados AS est ON est.id = pes.est_codigo
			LEFT JOIN cidades AS cid ON cid.id = pes.cid_codigo
			WHERE pes.id_conta = :id_conta AND pes.nome IS NOT NULL AND pes.tipo = 1
			ORDER BY pes.nome ASC
		');
		$sql->bindParam(':id_conta', $this->id_conta);
		$sql->execute();

		if($sql->errorInfo()[0] !== '00000' and DEV !== true){
			
			$this->saveLogs($sql->errorInfo());
		}elseif($sql->errorInfo()[0] !== '00000' and DEV === true){

			new de($sql->errorInfo());
		}
		$temp = $sql->fetchAll(PDO::FETCH_ASSOC);

		$fetch = array();
		foreach ($temp as $key => $arr){

		}

		$sql = null;

		return $fetch;
	}

	function newVeiculo(array $dados){

		$publicar		= $this->_util->basico($dados[0]) ?? 1;
		$tipo			= $this->_util->basico($dados[1]) ?? 2;
		$ano			= $this->_util->basico($dados[2]) ?? 0;
		$nome 			= $this->_util->basico($dados[3]) ?? '';
		$modelo 		= $this->_util->basico($dados[4]) ?? 0;
		$cor 			= $this->_util->basico($dados[5]) ?? 0;
		$marca 			= $this->_util->basico($dados[6]) ?? 0;
		$portas			= $this->_util->basico($dados[7]) ?? 1;
		$descricao 		= $this->_util->basico($dados[8]) ?? '-';
		$quilometragem 	= $this->_util->basico($dados[9]) ?? 0;
		$id_conta 		= $this->_util->basico($dados[10]) ?? 0;

		$sql = $this->_conexao->prepare("INSERT INTO veiculo (
			id_conta,
			nome,
			ano,
			modelo,
			descricao,
			tipo,
			cor,
			marca,
			portas,
			quilometragem
		) VALUES (
			:id_conta,
			:nome,
			:ano,
			:modelo,
			:descricao,
			:tipo,
			:cor,
			:marca,
			:portas,
			:quilometragem
		)");
		$sql->bindParam(':id_conta', $id_conta);
		$sql->bindParam(':nome', $nome);
		$sql->bindParam(':ano', $ano);
		$sql->bindParam(':modelo', $modelo);
		$sql->bindParam(':descricao', $descricao);
		$sql->bindParam(':tipo', $tipo);
		$sql->bindParam(':cor', $cor);
		$sql->bindParam(':marca', $marca);
		$sql->bindParam(':portas', $portas);
		$sql->bindParam(':quilometragem', $quilometragem);
		$sql->execute();

		if($sql->errorInfo()[0] !== '00000' and DEV !== true){
			
			$this->saveLogs($sql->errorInfo());
		}elseif($sql->errorInfo()[0] !== '00000' and DEV === true){

			new de($sql->errorInfo());
		}
		$fetch = $sql->fetch(PDO::FETCH_ASSOC);
		$sql = null;

		/* SUCESSO */
		$return = 1;

		if($fetch === false){

			/* FALHA */
			$return = 2;
		}

		return $return;
	}

	function saveLogs(array $erro){

		$codigo_postgres 	= $erro[0] ?? 0;
		$tipo_postgres 		= $erro[1] ?? 0;
		$descricao 			= $erro[2] ?? '-';
		$arrayzao 			= implode(' - ', $erro);
		$usu_codigo 		= key($_SESSION[CLIENTE]['login']) ?? 0;

		$sql = $this->_conexao->prepare("INSERT INTO erro_logs (
			descricao,
			data,
			hora,
			ip,
			usu_codigo,
			codigo_postgres,
			tipo_postgres,
			arrayzao
		) VALUES (
			:descricao,
			:data,
			:hora,
			:ip,
			:usu_codigo,
			:codigo_postgres,
			:tipo_postgres,
			:arrayzao
		)");
		$sql->bindParam(':descricao', $descricao);
		$sql->bindParam(':data', $this->_hoje);
		$sql->bindParam(':hora', $this->_agora);
		$sql->bindParam(':ip', $this->_ip);
		$sql->bindParam(':usu_codigo', $usu_codigo);
		$sql->bindParam(':codigo_postgres', $codigo_postgres);
		$sql->bindParam(':tipo_postgres', $tipo_postgres);
		$sql->bindParam(':arrayzao', $arrayzao);
		$sql->execute();
		$fetch = $sql->fetch(PDO::FETCH_ASSOC);
		$sql = null;

		/* SUCESSO */
		$return = 1;

		if($fetch === false){

			/* FALHA */
			$return = 2;
		}

		return $return;
	}

	private function HASH($string){

		/**
		** @see NUNCA !!!!
		** @see NUNCA, JAMAIS, ALTERE O VALOR DA VARIÁVEL $salt
		**/
		$string = (string) $string;
		$salt = '31256578196*&%@#*(!$!+_%$(_+!%anpadfbahidpqwm,ksdpoqww[pqwṕqw[';

		return sha1(substr(md5($salt.$string), 5,25));
	}

	function newAccount($dados){

		if(is_array($dados) and !empty($dados) and count($dados) > 0){

			$email 	= $dados['email'];
			$nome 	= $dados['nome'];
			$senha 	= $this->HASH($dados['senha']);

			$sql = $this->_conexao->prepare('SELECT acesso FROM conta WHERE email = :email');
			$sql->bindParam(':email', $email);
			$sql->execute();
			$temp = $sql->fetch(PDO::FETCH_ASSOC);
			$sql = null;

			if(!$temp){

				$sql = "INSERT INTO conta (
					nome,
					email,
					senha,
					ip_criacao,
					data_criacao,
					hora_criacao
				) VALUES (
					:nome,
					:email,
					:senha,
					:ip,
					:hoje,
					:agora
				)";
				$sql = $this->_conexao->prepare($sql);
				$sql->bindParam(':nome', $nome);
				$sql->bindParam(':email', $email);
				$sql->bindParam(':senha', $senha);
				$sql->bindParam(':ip', $this->_ip);
				$sql->bindParam(':hoje', $this->_hoje);
				$sql->bindParam(':agora', $this->_agora);
				$sql->execute();

				if($sql->errorInfo()[0] !== '00000' and DEV !== true){
					
					$this->saveLogs($sql->errorInfo());
				}elseif($sql->errorInfo()[0] !== '00000' and DEV === true){

					new de($sql->errorInfo());
				}
				$temp = $sql->fetch(PDO::FETCH_ASSOC);
				$sql = null;

				if(!$temp){
					return 1;
				}else{

					return 2;
				}

			}else{

				/* JÁ existe um registro com essa conta */
				sleep(1);
				return 3;
			}
		}else{

			/* VOCÊ ESTÁ NO LUGAR ERRADO*/
			sleep(3);
			return 4;
		}
	}

	function getLoginsip(){

		$sql = $this->_conexao->prepare('
			SELECT *
			FROM conta
			where ip_criacao = :ip_criacao OR ip_ultimo_login = :ip_ultimo_login
		');
		$sql->bindParam(':ip_criacao', $this->_ip);
		$sql->bindParam(':ip_ultimo_login', $this->_ip);
		$sql->execute();
		$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
		$sql = null;

		return $fetch;
	}


	function getConfig($id_conta){

		if(!empty($id_conta) and is_numeric($id_conta)){

			$sql = $this->_conexao->prepare('SELECT
				conf.nome,
				modulo.nome AS modulo,
				conf.licenca,
				conf.validade,
				conf.tipo
			FROM conta AS acc
			LEFT JOIN acc_config AS conf ON conf.id_conta = acc.id_conta
			LEFT JOIN ms_modulos AS modulo ON modulo.modulo_id = conf.modulo_id
			WHERE acc.id_conta = :id_conta');
			$sql->bindParam(':id_conta', $id_conta, PDO::PARAM_INT);
			$sql->execute();

			if($sql->errorInfo()[0] !== '00000' and DEV !== true){
				
				$this->saveLogs($sql->errorInfo());
			}elseif($sql->errorInfo()[0] !== '00000' and DEV === true){

				new de($sql->errorInfo());
			}

			$temp = $sql->fetchAll(PDO::FETCH_ASSOC);

			$sql = null;

			return $temp;
		}

		return false;

	}

	/* QUERY dados do site */
	function siteContato($id_conta){

		if(!empty($id_conta) and is_numeric($id_conta)){

			$sql = $this->_conexao->prepare('SELECT
				titulo,
				subtitulo,
				mensagem,
				email,
				telefone,
				whatsapp,
				celular,
				instagram,
				facebook,
				site,
				id_conta
			FROM site_contato
			WHERE id_conta = :id_conta');
			$sql->bindParam(':id_conta', $id_conta, PDO::PARAM_INT);
			$sql->execute();

			if($sql->errorInfo()[0] !== '00000' and DEV !== true){
				
				$this->saveLogs($sql->errorInfo());
			}elseif($sql->errorInfo()[0] !== '00000' and DEV === true){

				new de($sql->errorInfo());
			}
			$temp = $sql->fetch(PDO::FETCH_ASSOC);

			$sql = null;
			$PDO = null;

			return $temp;
		}

		return false;
	}






	/* MAYDANA SYSTEM */
	function Maydana_usuarios(){

		/* BUSCA TODOS OS CLIENTES */
		$sql = $this->_conexao->prepare('
			SELECT
				pes.id AS id,
				est.id AS estado,
				est.sigla AS sigla,
				cid.nome AS cidade,
				pes.telefone,
				pes.whatsapp,
				pes.nascimento,
				pes.sexo,
				pes.nome,
				pes.tipo,
				pes.id_conta,
				pes.est_codigo,
				pes.cid_codigo,
				pes.rg,
				pes.cpf,
				pes.celular,
				pes.bai_codigo,
				pes.descricao,
				acc.nome,
				CASE acc.status
					WHEN 0 THEN \'Inativo\'
					WHEN 1 THEN \'Ativo\'
					WHEN 2 THEN \'Offline\'
					ELSE \'Online\'
				END AS status,
				CASE pes.sexo
					WHEN 1 THEN \'Masculino\'
					ELSE \'Feminino\'
				END AS sexo
			FROM pessoas AS pes
			LEFT JOIN conta AS acc ON acc.id_conta = pes.id_conta
			LEFT JOIN estados AS est ON est.id = pes.est_codigo
			LEFT JOIN cidades AS cid ON cid.id = pes.cid_codigo
			WHERE pes.nome IS NOT NULL AND pes.tipo = 1
			ORDER BY pes.nome ASC
		');
		$sql->execute();

		if($sql->errorInfo()[0] !== '00000' and DEV !== true){
			
			$this->saveLogs($sql->errorInfo());
		}elseif($sql->errorInfo()[0] !== '00000' and DEV === true){

			new de($sql->errorInfo());
		}
		$temp = $sql->fetchAll(PDO::FETCH_ASSOC);

		$fetch = array();
		foreach ($temp as $key => $arr){
		}

		$sql = null;

		return $fetch;
	}
}