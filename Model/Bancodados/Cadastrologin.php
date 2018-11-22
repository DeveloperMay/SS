<?php
/*
	{
		"AUTHOR":"Matheus Maydana",
		"CREATED_DATA": "22/11/2018",
		"MODEL": "Cadastro Login",
		"LAST EDIT": "22/11/2018",
		"VERSION":"0.0.1"
	}
*/
class Model_Bancodados_Cadastrologin {
	
	function novoCadastrologin($dados){

		if(is_array($dados) and count($dados) > 0){

			$esc_codigo = ESC_CODIGO;

			$this->_PDO->beginTransaction();

			$log_nome 	= $this->_util->basico($dados['log_nome'] ?? '');
			$log_group 	= $this->_util->basico($dados['log_group'] ?? '');
			$log_cpf 	= $this->_util->basico($dados['log_cpf'] ?? '');
			$log_senha 	= $this->_util->basico($dados['log_senha'] ?? '');

			try {

				$sql = $this->_PDO->prepare('
					SELECT
						log_codigo
					FROM login
					WHERE log_cpf = :log_cpf AND esc_codigo = :esc_codigo
				');
				$sql->bindParam(':log_cpf', $log_cpf);
				$sql->bindParam(':esc_codigo', $esc_codigo);
				$sql->execute();
				$fetch = $sql->fetch(PDO::FETCH_ASSOC);
				$sql = null;

				/* JÁ EXISTE UM LOGIN COM ESTE CPF */
				if(is_array($fetch) and isset($fetch['log_codigo'])){
					return 3;
				}

				/* INSERE O NOVO LOGIN */
				$sql = $this->_PDO->prepare('
					INSERT INTO login 
					(
						esc_codigo,
						log_nome,
						log_group,
						log_cpf,
						log_senha,
						log_hora,
						log_data,
						log_ip,
						log_atualizacao
					) VALUES (
						:esc_codigo,
						:log_nome,
						:log_group,
						:log_cpf,
						:log_senha,
						:log_hora,
						:log_data,
						:log_ip,
						:log_atualizacao
					)
				');
				$sql->bindParam(':esc_codigo', $esc_codigo);
				$sql->bindParam(':log_nome', $log_nome);
				$sql->bindParam(':log_group', $log_group);
				$sql->bindParam(':log_cpf', $log_cpf);
				$sql->bindParam(':log_senha', $log_senha);
				$sql->bindParam(':log_hora', $this->_agora);
				$sql->bindParam(':log_data', $this->_hoje);
				$sql->bindParam(':log_ip', $this->_ip);
				$sql->bindParam(':log_atualizacao',  $this->_hoje);
				$sql->execute();
				$fetch = $sql->fetch(PDO::FETCH_ASSOC);
				$sql = null;

				$this->_PDO->commit();

				/* SUCESSO */
				$result = 2;
				if($fetch !== false){

					/* FALHA */
					$result = 1;
				}

				return $result;

			} catch (Exception $e){

				$this->_PDO->rollBack();

				new Model_Debugger($e, __METHOD__);
			}
		}
	}

	function _getLogins(){

		$esc_codigo = ESC_CODIGO;

		$this->_PDO->beginTransaction();

		$html = '';

		try {

			$sql = $this->_PDO->prepare("
				SELECT 
					log_codigo,
					log_cpf,
					log_nome,
					log_status,
					log_group
				FROM login
				WHERE esc_codigo = :esc_codigo
			");
			$sql->bindParam(':esc_codigo', $esc_codigo);
			$sql->execute();
			$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
			$sql = null;

			if(is_array($fetch) and count($fetch) > 0){
				/**	
				*	6 DEUS
				* @see 5 Administrador / Diretor
				* @see 4 Professor
				*
				**/
				foreach ($fetch as $arr){
					
					$group = 'Deus';
					if(isset($arr['log_group']) and $arr['log_group'] == 5){
						$group = 'Administrador / Diretor';
					}
					if(isset($arr['log_group']) and $arr['log_group'] == 4){
						$group = 'Professor';
					}

					$html .= <<<html

						<p>{$arr['log_nome']} - {$group}</p>
html;
				}
			}
		
			$this->_PDO->commit();

			return $html;

		}catch (Exception $e){

			$this->_PDO->rollBack();
			new Model_Debugger($e, __METHOD__);
			
			return '';
		}/* finally {

			return $html;
		}*/
	}
}