<?php
/*
	{
		"AUTHOR":"Matheus Maydana",
		"CREATED_DATA": "22/11/2018",
		"MODEL": "Vaga",
		"LAST EDIT": "22/11/2018",
		"VERSION":"0.0.1"
	}
*/
class Model_Bancodados_Vaga extends Model_Bancodados_Cadastrologin {

	function _getVagas(){

		$esc_codigo = ESC_CODIGO;

		$hoje = date('dmY');
		$sql = $this->_conexao->prepare("
			SELECT 
				vag.vag_quantidade,
				dis.dis_nome,
				dis.dis_ensino
			FROM vaga AS vag
			LEFT JOIN disciplina AS dis ON dis.dis_codigo = vag.dis_codigo
			WHERE vag.esc_codigo = :esc_codigo AND vag.vag_atedia <= :hoje AND vag.vag_status = 2
			ORDER BY vag.vag_atedia ASC
		");
		$sql->bindParam(':esc_codigo', $esc_codigo);
		$sql->bindParam(':hoje', $hoje);
		$sql->execute();
		new Model_Debugger($sql, __METHOD__, 'Select _getVagas');
		$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
		$sql = null;

		$html = 'Nenhuma vaga encontrada.';
		if(is_array($fetch) AND count($fetch) > 0){

			$html = '';
			foreach($fetch as $arr){

				$ensino = 'Ensino Médio';
				if(isset($arr['dis_ensino']) and $arr['dis_ensino'] == 2){
					$ensino = 'Ensino Fundamental';
				}

				$html .= <<<php
		<p>{$arr['dis_nome']} - {$ensino} - {$arr['vag_quantidade']} vagas</p>
php;
			}
		}

		return $html;
	}

	function _novaVaga($dados){

		$esc_codigo = ESC_CODIGO;
		$log_codigo = LOG_CODIGO;
		$vag_status = 2; // 1 venceu, 2 ativo
		$vag_quantidade	= $this->_util->basico($dados['vag_quantidade'] ?? null);
		$dis_codigo 	= $this->_util->basico($dados['dis_codigo'] ?? null);
		$vag_atedia 	= $this->_util->basico($dados['vag_atedia'] ?? null);
		$vag_descricao 	= $this->_util->basico($dados['vag_descricao'] ?? null);

		$sql = $this->_conexao->prepare("
			SELECT vag_codigo
			FROM vaga
			WHERE dis_codigo = :dis_codigo AND vag_atedia >= :vag_atedia AND vag_status = 2
		");
		$sql->bindParam(':dis_codigo', $dis_codigo);
		$sql->bindParam(':vag_atedia', $vag_atedia);
		$sql->execute();
		new Model_Debugger($sql, __METHOD__, 'Select nova Vaga');
		$temp = $sql->fetch(PDO::FETCH_ASSOC);
		$sql = null;

		if(is_array($temp) and isset($temp['vag_codigo']) and !empty($temp['vag_codigo'])){

			/* JÁ EXISTE UMA VAGA COM ESTE vag_codigo E vag_atedia */
			return 3;
		}

		$sql = $this->_conexao->prepare("INSERT INTO vaga (
			vag_quantidade,
			dis_codigo,
			log_codigo,
			vag_atedia,
			vag_status,
			vag_descricao,
			vag_dia_cadastro,
			vag_hora_cadastro,
			vag_ip,
			esc_codigo
		) VALUES (
			:vag_quantidade,
			:dis_codigo,
			:log_codigo,
			:vag_atedia,
			:vag_status,
			:vag_descricao,
			:vag_dia_cadastro,
			:vag_hora_cadastro,
			:vag_ip,
			:esc_codigo
		)");
		$sql->bindParam(':vag_quantidade', $vag_quantidade);
		$sql->bindParam(':dis_codigo', $dis_codigo);
		$sql->bindParam(':log_codigo', $log_codigo);
		$sql->bindParam(':vag_atedia', $vag_atedia);
		$sql->bindParam(':vag_status', $vag_status);
		$sql->bindParam(':vag_descricao', $vag_descricao);
		$sql->bindParam(':vag_dia_cadastro', $this->_hoje);
		$sql->bindParam(':vag_hora_cadastro', $this->_agora);
		$sql->bindParam(':vag_ip', $this->_ip);
		$sql->bindParam(':esc_codigo', $esc_codigo);
		$sql->execute();
		new Model_Debugger($sql, __METHOD__, 'Cadastra nova inscrição');
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
}