<?php
/*
	{
		"AUTHOR":"Matheus Maydana",
		"CREATED_DATA": "22/11/2018",
		"CONTROLADOR": "Pessoa",
		"LAST EDIT": "22/11/2018",
		"VERSION":"0.0.1"
	}
*/
class Model_Bancodados_Pessoa extends Model_Bancodados_Disciplina {

	function _getPessoa($pes_codigo){

		$sql = $this->_conexao->prepare("
			SELECT
				*
			FROM cad_pessoa
			WHERE esc_codigo = :esc_codigo AND pes_codigo = :pes_codigo
		");
		$sql->bindParam(':esc_codigo', $this->esc_codigo);
		$sql->bindParam(':pes_codigo', $pes_codigo);
		$sql->execute();
		$fetch = $sql->fetch(PDO::FETCH_ASSOC);
		$sql = null;

		$ensino = 'Ensino Médio';
		if(isset($fetch['dis_ensino']) and $fetch['dis_ensino'] == 2){
			$ensino = 'Ensino Fundamental';
		}

		$tipoa = 'class=""';
		$tipob = 'class=""';

		$sexoa = 'class=""';
		$sexob = 'class=""';
		$sexoc = 'class=""';

		if(isset($fetch['pes_sexo']) and $fetch['pes_sexo'] == 1){
			$sexoa = 'selected';
		}
		if(isset($fetch['pes_sexo']) and $fetch['pes_sexo'] == 2){
			$sexob = 'selected';
		}
		if(isset($fetch['pes_sexo']) and $fetch['pes_sexo'] == 3){
			$sexoc = 'selected';
		}


		if(isset($fetch['pes_tipo']) and $fetch['pes_tipo'] == 1){
			$tipoa = 'selected';
		}
		if(isset($fetch['pes_tipo']) and $fetch['pes_tipo'] == 2){
			$tipob = 'selected';
		}
		$html = <<<html

<h1 class="font-3">{$this->_util->basico($fetch['pes_nome'])} - Editando</h1>
<form action="/{$this->_controlador}/editando" id="form-altera-pessoa" method="post">

	<input type="hidden" name="token" value="{{token}}" />

	<div class="inline-block width-50">
		<div class="input-text">
			<input type="text" name="nome" id="nome" autocomplete="off" accesskey="no" placeholder="nome completo" value="{$this->_util->basico($fetch['pes_nome'])}"/>
			<label for="nome">Nome</label>
		</div>
	</div>
	<div class="inline-block width-50">
		<div class="input-text">
			<input type="tel" name="cpf" id="cpf" autocomplete="off" accesskey="cp" placeholder="cpf" value="{$this->_util->basico($fetch['pes_cpf'])}"/>
			<label for="cpf">CPF</label>
		</div>
	</div>

	<div class="inline-block width-50">
		<div class="input-text">
			<input type="tel" name="nascimento" id="nascimento" autocomplete="off" accesskey="na" placeholder="nascimento" value="{$this->_util->basico($fetch['pes_nascimento'])}"/>
			<label for="nascimento">Nascimento</label>
		</div>
	</div>
	<div class="inline-block width-50">
		<div class="input-select">
			<select name="sexo" autocomplete="off" accesskey="se" >
				<option {$sexoa} value="1">Homem</option>
				<option {$sexob} value="2">Mulher</option>
				<option {$sexoc} value="3">Outro</option>
			</select>
			<label>Sexo</label>
		</div>
	</div>
	<div class="inline-block width-50">
		<div class="input-text">
			<input type="tel" name="rg" id="rg" autocomplete="off" accesskey="rg" placeholder="rg" value="{$this->_util->basico($fetch['pes_rg'])}"/>
			<label for="rg">RG</label>
		</div>
	</div>
	<div class="inline-block width-50">
		<div class="input-select">
			<select name="tipo" autocomplete="off" accesskey="ti" >
				<option {$tipoa} value="1">Aluno</option>
				<option {$tipob} value="2">Professor</option>
			</select>
			<label>Tipo</label>
		</div>
	</div>
	<div class="st-space-4"></div>
	<h2>Contato</h2>
	<div class="st-space-3"></div>

	<div class="inline-block width-50">
		<div class="input-text">
			<input type="tel" name="whatsapp" id="whatsapp" autocomplete="off" accesskey="wh" placeholder="whatsapp" value="{$this->_util->basico($fetch['pes_whats'])}"/>
			<label for="whatsapp">Whatsapp</label>
		</div>
	</div>
	<div class="inline-block width-50">
		<div class="input-text">
			<input type="tel" name="telefone" id="telefone" autocomplete="off" accesskey="te" placeholder="telefone" value="{$this->_util->basico($fetch['pes_telefone'])}"/>
			<label for="telefone">Telefone</label>
		</div>
	</div>
	<div class="input-text">
		<input type="email" name="email" id="email" autocomplete="off" accesskey="em" placeholder="e-mail" value="{$this->_util->basico($fetch['pes_email'])}"/>
		<label for="email">E-mail</label>
	</div>

	<p class="text-center"><button id="btn-submit">Cadastrar</button></p>
</form>
<div id="res-ajax"></div>
<script>
$(document).ready(function() {
	$("#form-altera-pessoa").submit(function(event){
		event.preventDefault();

		var post_url 		= $(this).attr("action");
		var request_method 	= $(this).attr("method");
		var form_data 		= $(this).serialize();

		var resAjax 		= $("#res-ajax");
		
		var btnSubmit = $('#btn-submit');

		resAjax.html('Aguarde...');
		$.ajax({
			url : post_url,
			type: request_method,
			data : form_data
		}).done(function(data){

			var data = jQuery.parseJSON(data);

			if(data.res == 'ok'){

				$("#res-ajax").html(data.info);

			}else{
				
				$("#res-ajax").html(data.info);
			}

		}).fail(function(data) {
			$("#res-ajax").html('Erro no Request');
		});
	});
});
</script>
				
html;

		$data['title'] = $this->_util->basico($fetch['pes_nome']);
		$data['html'] = $html;
		return $data;
	}

	function _getPessoas(){

		/* VERIFICAR QUANTAS PAGINAS VÃO SER */
		$sql = $this->_conexao->prepare("
			SELECT
				pes_codigo
			FROM inscricao
			WHERE esc_codigo = :esc_codigo AND log_codigo = :log_codigo
		");
		$sql->bindParam(':esc_codigo', $this->esc_codigo);
		$sql->bindParam(':log_codigo', $this->log_codigo);
		$sql->execute();
		$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
		$sql = null;

		$totalResults = ceil(count($fetch) / $this->_results); 

		$offset = round(($this->_page - 1) * $totalResults);

		$sql = $this->_conexao->prepare("
			SELECT 
				pes_codigo,
				pes_nome,
				pes_ensino,
				pes_tipo,
				pes_cpf,
				pes_email
			FROM cad_pessoa
			WHERE esc_codigo = :esc_codigo
			LIMIT ".$this->_results." OFFSET ".$offset
		);
		$sql->bindParam(':esc_codigo', $this->esc_codigo);
		$sql->execute();
		$fetch = $sql->fetchAll(PDO::FETCH_ASSOC);
		$sql = null;
		$html = <<<html

			{$this->_render->renPagination('pessoa', $totalResults)}
			<table>
				<thead>
					<th>Nome</th>
					<th>CPF</th>
					<th>E-mail</th>
					<th>Tipo</th>
					<th>Ensino</th>
					<th></th>
				</thead>
				<tbody>

html;

		foreach ($fetch as $arr){
			$ensino = 'Ensino Médio';
			if(isset($arr['pes_ensino']) and $arr['pes_ensino'] == 2){
				$ensino = 'Ensino Fundamental';
			}
			$tipo = 'Aluno';
			if(isset($arr['pes_tipo']) and $arr['pes_tipo'] == 2){
				$tipo = 'Professor';
			}

			$html .= <<<html
			<tr>
				<td class="text-left">{$this->_util->basico($arr['pes_nome'])}</td>
				<td>{$this->_util->basico($arr['pes_cpf'])}</td>
				<td>{$this->_util->basico($arr['pes_email'])}</td>
				<td>{$tipo}</td>
				<td>{$ensino}</td>
				<td style="width: 90px">
					{$this->_render->compAcao($this->_controlador, $this->_util->basico($arr['pes_codigo']), $this->_util->basico($arr['pes_nome']))}
				</td>
			</tr>
html;
		}

		if(is_array($fetch) and count($fetch) <= 0){

			$html .= '<tr><td colspan="6">Nenhum dado encontrado</td></tr>';
		}

		$html .= <<<html
				</tbody>
			</table>
html;

		return $html;
	}

	function _novaPessoa($dados){

		$esc_codigo 	= ESC_CODIGO;
		$pes_tipo		= $this->_util->basico($dados['pes_tipo'] ?? null);
		$pes_nome 		= $this->_util->basico($dados['pes_nome'] ?? null);
		$pes_cpf 		= $this->_util->basico($dados['pes_cpf'] ?? null);
		$pes_sexo 		= $this->_util->basico($dados['pes_sexo'] ?? 0);
		$pes_email		= $this->_util->basico($dados['pes_email'] ?? 0);
		$cid_codigo		= $this->_util->basico($dados['cid_codigo'] ?? null);
		$pes_nascimento	= $this->_util->basico($dados['pes_nascimento'] ?? 0);

		$this->_PDO->beginTransaction();

		try {

			$sql = $this->_PDO->prepare("
				SELECT pes_nome
				FROM cad_pessoa
				WHERE pes_nome = :pes_nome OR pes_cpf = :pes_cpf
			");
			$sql->bindParam(':pes_nome', $pes_nome);
			$sql->bindParam(':pes_cpf', $pes_cpf);
			$sql->execute();
			$temp = $sql->fetch(PDO::FETCH_ASSOC);
			$sql = null;

			if(is_array($temp) and isset($temp['pes_nome']) and !empty($temp['pes_nome'])){

				/* JÁ EXISTE UM CADASTROM COM ESTE NOME OU CPF*/
				return 3;
			}

			$sql = $this->_conexao->prepare("INSERT INTO cad_pessoa (
				esc_codigo,
				pes_tipo,
				pes_nome,
				pes_sexo,
				pes_nascimento,
				pes_cpf,
				pes_email,
				cid_codigo,
				pes_atualizacao,
				pes_data,
				pes_hora,
				pes_ip
			) VALUES (
				:esc_codigo,
				:pes_tipo,
				:pes_nome,
				:pes_sexo,
				:pes_nascimento,
				:pes_cpf,
				:pes_email,
				:cid_codigo,
				:pes_atualizacao,
				:pes_data,
				:pes_hora,
				:pes_ip
			)");
			$sql->bindParam(':esc_codigo', $esc_codigo);
			$sql->bindParam(':pes_tipo', $pes_tipo);
			$sql->bindParam(':pes_nome', $pes_nome);
			$sql->bindParam(':pes_sexo', $pes_sexo);
			$sql->bindParam(':pes_nascimento', $pes_nascimento);
			$sql->bindParam(':pes_cpf', $pes_cpf);
			$sql->bindParam(':pes_email', $pes_email);
			$sql->bindParam(':cid_codigo', $cid_codigo);
			$sql->bindParam(':pes_atualizacao', $this->_hoje);
			$sql->bindParam(':pes_data', $this->_hoje);
			$sql->bindParam(':pes_hora', $this->_agora);
			$sql->bindParam(':pes_ip', $this->_ip);
			$sql->execute();
			$sql = null;

			$this->_PDO->commit();

			/* SUCESSO */
			return 2;

		}catch (Exception $e){

			$this->_PDO->rollBack();
			new Model_Debugger($e, __METHOD__);

			/* FALHA */
			return 1;
		}
	}
}
