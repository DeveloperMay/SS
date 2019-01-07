-- Table: public.cad_pessoa

-- DROP TABLE public.cad_pessoa;

CREATE TABLE public.cad_pessoa
(
  pes_codigo integer NOT NULL DEFAULT nextval('cad_pessoa_pes_codigo_seq'::regclass),
  pes_nome character varying(150) NOT NULL,
  pes_cpf character varying(20),
  pes_rg character varying(20),
  pes_sexo smallint NOT NULL DEFAULT 1, -- 1 - Homem 2 Mulher
  pes_nascimento character varying(10),
  pes_telefone character varying(15),
  pes_whats character varying(15),
  pes_email character varying(150),
  cid_codigo integer,
  est_codigo integer,
  bai_codigo integer,
  pes_status smallint NOT NULL DEFAULT 1, -- 1 off 2 on
  pes_atualizacao character varying(20),
  pes_criacao character varying(20),
  pes_ip character varying(20),
  CONSTRAINT cad_pessoa_pkey PRIMARY KEY (pes_codigo)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.cad_pessoa
  OWNER TO abigor;
COMMENT ON COLUMN public.cad_pessoa.pes_sexo IS '1 - Homem 2 Mulher';
COMMENT ON COLUMN public.cad_pessoa.pes_status IS '1 off 2 on';

