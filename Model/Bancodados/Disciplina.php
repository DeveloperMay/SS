<?php
/*
	{
		"AUTHOR":"Matheus Maydana",
		"CREATED_DATA": "22/11/2018",
		"CONTROLADOR": "Disciplina",
		"LAST EDIT": "22/11/2018",
		"VERSION":"0.0.1"
	}
*/
class Model_Bancodados_Disciplina extends Model_Bancodados_Inscricao {

	function _getDisciplinasVagas(){

		$esc_codigo = ESC_CODIGO;

		$this->_PDO->beginTransaction();

		try {

			$hoje = date('dmY');
			$sql = $this->_PDO->prepare("
				SELECT 
					vag.vag_codigo,
					vag.vag_quantidade,
					vag.vag_atedia,
					vag.vag_status,
					dis.dis_codigo,
					dis.dis_ensino,
					/*CASE dis.dis_ensino
						WHEN 1 THEN 'ensino médio'
						ELSE 'ensino fundamental'
					END AS dis_ensino,*/
					dis.dis_nome
				FROM disciplina AS dis
				LEFT JOIN vaga AS vag ON vag.dis_codigo = dis.dis_codigo
				WHERE dis.esc_codigo = :esc_codigo
				GROUP BY dis.dis_codigo
				ORDER BY vag.vag_status ASC

			");
			$sql->bindParam(':esc_codigo', $esc_codigo);
			$sql->execute();
			$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
			$sql = null;

			$html = '';
			foreach($fetch as $arr){

				/* VERIFICA SE A VAGA NÃÃÃÃO ESTÁ ATIVA OU JÁ VENCEU , se sim, não exibe a disciplina */
				if(isset($arr['vag_atedia'], $arr['vag_status'], $arr['vag_codigo']) and !empty($arr['vag_codigo']) and $arr['vag_atedia'] <= date('dmY')){

					if($arr['vag_status'] == 2){
						continue;
					}
				}

				$ensino = 'Ensino Médio';
				if(isset($arr['dis_ensino']) and $arr['dis_ensino'] == 2){
					$ensino = 'Ensino Fundamental';
				}

				$html .= <<<php
			<option value="{$arr['dis_codigo']}">{$arr['dis_nome']} - {$ensino} - {$arr['vag_quantidade']} vagas</option>
php;
			}
			
			$this->_PDO->commit();

			/* SUCESSO */
			return $html;

		}catch (Exception $e){

			/* FALHA */
			return '';
		}

	}

	function _getDisciplinas(){

		$esc_codigo = ESC_CODIGO;

		$this->_PDO->beginTransaction();

		try {

			$sql = $this->_PDO->prepare("
				SELECT 
					*
				FROM disciplina
				WHERE esc_codigo = :esc_codigo
				ORDER BY dis_ensino ASC, dis_nome ASC
			");
			$sql->bindParam(':esc_codigo', $esc_codigo);
			$sql->execute();
			$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
			$sql = null;

			$html = '';

			foreach($fetch as $arr){

				$ensino = 'Ensino Médio';
				if(isset($arr['dis_ensino']) and $arr['dis_ensino'] == 2){
					$ensino = 'Ensino Fundamental';
				}

				$html .= <<<php
			<option value="{$arr['dis_codigo']}">{$arr['dis_nome']} - {$ensino}</option>
php;
			}
	
			$this->_PDO->commit();

			/* SUCESSO */
			return $html;
	
		}catch (Exception $e){

			/* FALHA */
			new Model_Debugger($e, __METHOD__);
			
			return '';
		}
	}

	function _getDisciplina(){

		$esc_codigo = ESC_CODIGO;

		$this->_PDO->beginTransaction();

		try {

			$sql = $this->_PDO->prepare("
				SELECT 
					*
				FROM disciplina
				WHERE esc_codigo = :esc_codigo
			");
			$sql->bindParam(':esc_codigo', $esc_codigo);
			$sql->execute();
			$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
			$sql = null;

			$html = '';

			foreach($fetch as $arr){

				$html .= <<<php
			<div>{$arr['dis_nome']} - {$arr['dis_ensino']}</div>

			<br />
			<br />
			<br />
php;
			}

			$this->_PDO->commit();

			/* SUCESSO */
			return $html;
		
		}catch (Exception $e){

			/* FALHA */
			new Model_Debugger($e, __METHOD__);
			
			return '';	
		}

	}

	function _novaDisciplina($dados){

		$esc_codigo 	= ESC_CODIGO;
		$dis_nome		= $this->_util->basico($dados['dis_nome'] ?? null);
		$dis_ensino 	= $this->_util->basico($dados['dis_ensino'] ?? null);
		$dis_descricao 	= $this->_util->basico($dados['dis_descricao'] ?? null);

		$this->_PDO->beginTransaction();

		try {

			$sql = $this->_PDO->prepare("
				SELECT dis_nome
				FROM disciplinSa
				WHERE dis_nome = :dis_nome AND dis_ensino = :dis_ensino
			");
			$sql->bindParam(':dis_nome', $dis_nome);
			$sql->bindParam(':dis_ensino', $dis_ensino);
			$sql->execute();
			$temp = $sql->fetch(PDO::FETCH_ASSOC);
			$sql = null;

			if(is_array($temp) and isset($temp['dis_nome']) and !empty($temp['dis_nome'])){

				/* JÁ EXISTE UM CADASTROM COM ESTE NOME OU CPF*/
				return 3;
			}

			$sql = $this->_PDO->prepare("INSERT INTO disciplina (
				esc_codigo,
				dis_nome,
				dis_descricao,
				dis_ensino
			) VALUES (
				:esc_codigo,
				:dis_nome,
				:dis_descricao,
				:dis_ensino
			)");
			$sql->bindParam(':esc_codigo', $esc_codigo);
			$sql->bindParam(':dis_nome', $dis_nome);
			$sql->bindParam(':dis_ensino', $dis_ensino);
			$sql->bindParam(':dis_descricao', $dis_descricao);
			$sql->execute();
			$fetch = $sql->fetch(PDO::FETCH_ASSOC);
			$sql = null;

			$this->_PDO->commit();

			/* SUCESSO */
			return 2;

		}catch (Exception $e){

			new Model_Debugger($e, __METHOD__);

			/* FALHA */
			return 1;

		}
	}

}