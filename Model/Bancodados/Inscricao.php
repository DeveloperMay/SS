<?php
/*
	{
		"AUTHOR":"Matheus Maydana",
		"CREATED_DATA": "22/11/2018",
		"MODEL": "Inscrição",
		"LAST EDIT": "22/11/2018",
		"VERSION":"0.0.1"
	}
*/
class Model_Bancodados_Inscricao extends Model_Bancodados_Vaga {

	function _getDisciplinasInscricao(){

		$esc_codigo = ESC_CODIGO;

		$sql = $this->_conexao->prepare("
			SELECT 
				vag.vag_codigo,
				vag.vag_quantidade,
				dis.dis_nome
			FROM vaga AS vag
			LEFT JOIN disciplina AS dis ON dis.dis_codigo = vag.dis_codigo
			WHERE vag.esc_codigo = :esc_codigo AND vag.vag_status = 2 AND vag.vag_quantidade > 0
		");
		$sql->bindParam(':esc_codigo', $esc_codigo);
		$sql->execute();
		new Model_Debugger($sql, __METHOD__, 'Select get Todas inscrições');
		$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
		$sql = null;

		$html = '';
		foreach ($fetch as $arr){

			$ensino = 'Ensino Médio';
			if(isset($arr['dis_ensino']) and $arr['dis_ensino'] == 2){
				$ensino = 'Ensino Fundamental';
			}

			$html .= <<<html
			<option value="{$arr['vag_codigo']}">{$arr['dis_nome']} - {$ensino} - {$arr['vag_quantidade']}</option>
html;
		}

		return $html;
	}

	function _getInscricao($ins_codigo){

		$esc_codigo = ESC_CODIGO;
		$log_codigo = LOG_CODIGO;

		$sql = $this->_conexao->prepare("
			SELECT
				ins.ins_codigo,
				ins.pes_codigo,
				ins.ins_data_marcado,
				dis.dis_nome,
				CASE ins.ins_status
					WHEN 1 THEN 'Recusado'
					WHEN 2 THEN 'Aceito'
					ELSE 'Venceu'
				END AS ins_status,
				pes.pes_nome
			FROM inscricao AS ins
			LEFT JOIN cad_pessoa AS pes ON pes.pes_codigo = ins.pes_codigo
			LEFT JOIN vaga AS vag ON vag.vag_codigo = ins.vag_codigo
			LEFT JOIN disciplina AS dis ON dis.dis_codigo = vag.dis_codigo
			WHERE ins.esc_codigo = :esc_codigo AND ins.log_codigo = :log_codigo AND ins_codigo = :ins_codigo
		");
		$sql->bindParam(':esc_codigo', $esc_codigo);
		$sql->bindParam(':log_codigo', $log_codigo);
		$sql->bindParam(':ins_codigo', $ins_codigo);
		$sql->execute();
		new Model_Debugger($sql, __METHOD__, 'Select get Todas inscrições');
		$fetch = $sql->fetch(PDO::FETCH_ASSOC);
		$sql = null;

		$ensino = 'Ensino Médio';
		if(isset($fetch['dis_ensino']) and $fetch['dis_ensino'] == 2){
			$ensino = 'Ensino Fundamental';
		}

		$html = <<<html

			<table>
				<thead>
					<th>Nome</th>
					<th>Disciplina</th>
					<th>Data</th>
					<th>Status</th>
					<th></th>
				</thead>
				<tbody>
					<tr>
						<td class="text-left">{$fetch['pes_nome']}</td>
						<td>{$fetch['dis_nome']} {$ensino}</td>
						<td>{$fetch['ins_data_marcado']}</td>
						<td>{$fetch['ins_status']}</td>
						<td>
							{$this->_render->compAcao($this->_controlador, $fetch['ins_codigo'], $fetch['pes_nome'])}
						</td>
					</tr>
				</tbody>
			</table>
				
html;

		$data['title'] = $fetch['pes_nome'];
		$data['html'] = $html;
		return $data;
	}
	
	function _getInscricaoes(){

		$esc_codigo = ESC_CODIGO;
		$log_codigo = LOG_CODIGO;


		/* VERIFICAR QUANTAS PAGINAS VÃO SER */

		$sql = $this->_conexao->prepare("
			SELECT
				ins_codigo
			FROM inscricao
			WHERE esc_codigo = :esc_codigo AND log_codigo = :log_codigo
		");
		$sql->bindParam(':esc_codigo', $esc_codigo);
		$sql->bindParam(':log_codigo', $log_codigo);
		$sql->execute();
		$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
		$sql = null;

		$totalResults = ceil(count($fetch) / $this->_results); 

		$offset = ($this->_page - 1) * $totalResults;
		$sql = $this->_conexao->prepare("
			SELECT
				ins.ins_codigo,
				ins.pes_codigo,
				ins.ins_data_marcado,
				dis.dis_nome,
				CASE ins.ins_status
					WHEN 1 THEN 'Recusado'
					WHEN 2 THEN 'Aceito'
					ELSE 'Venceu'
				END AS ins_status,
				pes.pes_nome
			FROM inscricao AS ins
			LEFT JOIN cad_pessoa AS pes ON pes.pes_codigo = ins.pes_codigo
			LEFT JOIN vaga AS vag ON vag.vag_codigo = ins.vag_codigo
			LEFT JOIN disciplina AS dis ON dis.dis_codigo = vag.dis_codigo
			WHERE ins.esc_codigo = :esc_codigo AND ins.log_codigo = :log_codigo
			LIMIT ".$this->_results." OFFSET ".$offset
		);
		$sql->bindParam(':esc_codigo', $esc_codigo);
		$sql->bindParam(':log_codigo', $log_codigo);
		$sql->execute();
		new Model_Debugger($sql, __METHOD__, 'Select get Todas inscrições');
		$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
		$sql = null;

		$html = <<<html

			{$this->_render->renPagination('inscricao', $totalResults)}
			<table>
				<thead>
					<th>Nome</th>
					<th>Disciplina</th>
					<th>Data</th>
					<th>Status</th>
					<th></th>
				</thead>
				<tbody>

html;

		foreach ($fetch as $arr){
			$ensino = 'Ensino Médio';
			if(isset($arr['dis_ensino']) and $arr['dis_ensino'] == 2){
				$ensino = 'Ensino Fundamental';
			}

			$html .= <<<html
			<tr>
				<td class="text-left">{$arr['pes_nome']}</td>
				<td>{$arr['dis_nome']} {$ensino}</td>
				<td>{$arr['ins_data_marcado']}</td>
				<td>{$arr['ins_status']}</td>
				<td>
					
					{$this->_render->compAcao($this->_controlador, $arr['ins_codigo'], $arr['pes_nome'])}
				</td>
			</tr>
html;
		}


		$html .= <<<html
				</tbody>
			</table>
				
html;

		return $html;
	}

	function _novaInscricao($dados){

		$esc_codigo = ESC_CODIGO;
		$log_codigo = LOG_CODIGO;
		$pes_codigo	= $this->_util->basico($dados['pes_codigo'] ?? null);
		$vag_codigo = $this->_util->basico($dados['vag_codigo'] ?? null);
		$ins_data_marcado 	= $this->_util->basico($dados['ins_data_marcado'] ?? null);
		$ins_hora_marcado 	= $this->_util->basico($dados['ins_hora_marcado'] ?? null);

		/* VEREFICA SE A VAGA ESTÁ DISPONÍVEL, SE TEM VAGA */
		$sql = $this->_conexao->prepare("
			SELECT vag_codigo
			FROM vaga
			WHERE esc_codigo = :esc_codigo AND vag_codigo = :vag_codigo AND vag_status = 2 AND vag_quantidade > 0
		");
		$sql->bindParam(':esc_codigo', $esc_codigo);
		$sql->bindParam(':vag_codigo', $vag_codigo);
		$sql->execute();
		new Model_Debugger($sql, __METHOD__, 'Select nova inscrição');
		$temp = $sql->fetchAll(PDO::FETCH_ASSOC);
		$sql = null;

		if(is_array($temp) and count($temp) <= 0){

			/* ESTÁ VAGA NÃO EXISTE OU ESTÁ INDISPONÍVEL OU NÃO TEM MAIS QUANTIDADE, acabou!!! */
			return 4;
		}

		/* VEREFICA SE A PESSOA JÁ ESTÁ INSCRITA */
		$sql = $this->_conexao->prepare("
			SELECT pes_codigo
			FROM inscricao
			WHERE esc_codigo = :esc_codigo AND pes_codigo = :pes_codigo AND vag_codigo = :vag_codigo
		");
		$sql->bindParam(':esc_codigo', $esc_codigo);
		$sql->bindParam(':pes_codigo', $pes_codigo);
		$sql->bindParam(':vag_codigo', $vag_codigo);
		$sql->execute();
		new Model_Debugger($sql, __METHOD__, 'Select nova inscrição');
		$temp = $sql->fetchAll(PDO::FETCH_ASSOC);
		$sql = null;

		if(is_array($temp) and count($temp) > 0){

			/* PESSOA JÁ INSCRITA NESTA DISCIPLINA, VAGA */
			return 3;
		}

		/* SE CHEGOU AQUI, É PORQUE PODE SER REGRISTRADO */
		$sql = $this->_conexao->prepare("INSERT INTO inscricao (
			pes_codigo,
			vag_codigo,
			log_codigo,
			ins_data_marcado,
			ins_hora_marcado,
			ins_dia_cadastro,
			ins_hora_cadastro,
			ins_ip,
			esc_codigo
		) VALUES (
			:pes_codigo,
			:vag_codigo,
			:log_codigo,
			:ins_data_marcado,
			:ins_hora_marcado,
			:ins_dia_cadastro,
			:ins_hora_cadastro,
			:ins_ip,
			:esc_codigo
		)");
		$sql->bindParam(':pes_codigo', $pes_codigo);
		$sql->bindParam(':vag_codigo', $vag_codigo);
		$sql->bindParam(':log_codigo', $log_codigo);
		$sql->bindParam(':ins_data_marcado', $ins_data_marcado);
		$sql->bindParam(':ins_hora_marcado', $ins_hora_marcado);
		$sql->bindParam(':ins_dia_cadastro', $this->_hoje);
		$sql->bindParam(':ins_hora_cadastro', $this->_agora);
		$sql->bindParam(':ins_ip', $this->_ip);
		$sql->bindParam(':esc_codigo', $esc_codigo);
		$sql->execute();
		new Model_Debugger($sql, __METHOD__, 'Cadastra nova inscrição');
		$fetch = $sql->fetch(PDO::FETCH_ASSOC);
		$sql = null;

		/* FALHA */
		$return = 1;

		if($fetch === false){

			/* SUCESSO */
			$return = 2;

			/* RECUPERA A QUANTIDADE ATUAL DE VAGAS DISPONÍVEL */
			$sql = $this->_conexao->prepare("
				SELECT vag_quantidade
				FROM vaga
				WHERE vag_codigo = :vag_codigo
			");
			$sql->bindParam(':vag_codigo', $vag_codigo);
			$sql->execute();
			$quantidadeVaga = $sql->fetch(PDO::FETCH_ASSOC);
			$sql = null;

			/* DIMINUIU 1 VAGA */
			$quantidadeVagaRestante = $quantidadeVaga['vag_quantidade'] - 1;

			/* ALTERA A QUANTIDADE DA VAGA */
			$sql = $this->_conexao->prepare("
				UPDATE vaga SET vag_quantidade = :quantidadeVagaRestante WHERE vag_codigo = :vag_codigo
			");
			$sql->bindParam(':vag_codigo', $vag_codigo);
			$sql->bindParam(':quantidadeVagaRestante', $quantidadeVagaRestante);
			$sql->execute();
			$sql = null;
		}

		return $return;
	}
}