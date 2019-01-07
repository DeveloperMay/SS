-- Table: public."user"

-- DROP TABLE public."user";

CREATE TABLE public."user"
(
  id integer NOT NULL DEFAULT nextval('user_id_seq'::regclass),
  nome character varying(200),
  idade character varying(10),
  data character varying(20),
  hora character varying(20),
  ip character varying(20)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."user"
  OWNER TO abigor;
