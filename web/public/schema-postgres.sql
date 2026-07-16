
CREATE TABLE IF NOT EXISTS autores (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(150) NOT NULL,
    nacionalidade   VARCHAR(80),
    data_nascimento DATE
);


CREATE TABLE IF NOT EXISTS categorias (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(80) NOT NULL UNIQUE,
    descricao   TEXT
);


CREATE TABLE IF NOT EXISTS livros (
    id              SERIAL PRIMARY KEY,
    titulo          VARCHAR(200) NOT NULL,
    ano_publicacao  INTEGER,
    autor_id        INTEGER NOT NULL REFERENCES autores(id) ON DELETE RESTRICT,
    categoria_id    INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    quantidade      INTEGER NOT NULL DEFAULT 1 CHECK (quantidade >= 0)
);


CREATE TABLE IF NOT EXISTS membros (
    id            SERIAL PRIMARY KEY,
    nome          VARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    telefone      VARCHAR(20),
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emprestimos (
    id                       SERIAL PRIMARY KEY,
    membro_id                INTEGER NOT NULL REFERENCES membros(id) ON DELETE RESTRICT,
    livro_id                 INTEGER NOT NULL REFERENCES livros(id) ON DELETE RESTRICT,
    data_emprestimo          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_devolucao_prevista  TIMESTAMP NOT NULL,
    data_devolucao_real      TIMESTAMP,
    status                   VARCHAR(20) NOT NULL DEFAULT 'aberto'
                             CHECK (status IN ('aberto','devolvido','atrasado'))
);

CREATE TABLE IF NOT EXISTS reservas (
    id           SERIAL PRIMARY KEY,
    membro_id    INTEGER NOT NULL REFERENCES membros(id) ON DELETE CASCADE,
    livro_id     INTEGER NOT NULL REFERENCES livros(id) ON DELETE CASCADE,
    data_reserva TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status       VARCHAR(20) NOT NULL DEFAULT 'pendente'
                 CHECK (status IN ('pendente','atendida','cancelada'))
);


CREATE INDEX IF NOT EXISTS idx_livros_autor       ON livros(autor_id);
CREATE INDEX IF NOT EXISTS idx_livros_categoria   ON livros(categoria_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_membro ON emprestimos(membro_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_livro  ON emprestimos(livro_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_status ON emprestimos(status);
CREATE INDEX IF NOT EXISTS idx_reservas_membro    ON reservas(membro_id);
CREATE INDEX IF NOT EXISTS idx_reservas_livro     ON reservas(livro_id);

