const express = require("express");
const fs = require("fs");
const cors = require("cors"); // Importa o pacote CORS
const app = express();
const port = process.env.PORT || 3000;

// Habilita CORS para todas as origens
app.use(cors());

// Função para ler as palavras do arquivo
function obterPalavrasDoArquivo(caminhoArquivo) {
  try {
    const dados = fs.readFileSync(caminhoArquivo, "utf-8"); // Lê o conteúdo do arquivo
    const palavras = dados.split(/\s+/); // Divide o conteúdo em palavras
    return palavras;
  } catch (erro) {
    console.error("Erro ao ler o arquivo:", erro.message);
    return [];
  }
}

// Caminho do arquivo com as palavras
const caminhoArquivoSorteio = "src/palavras_sorteio.txt";
const caminhoArquivoDicionario = "src/palavras.txt";

// Rota que sorteia uma palavra aleatória
app.get("/aleatorio", (req, res) => {
  const palavras = obterPalavrasDoArquivo(caminhoArquivoSorteio);
  if (palavras.length === 0) {
    return res.status(500).send("Erro ao carregar as palavras do arquivo");
  }

  const palavraAleatoria =
    palavras[Math.floor(Math.random() * palavras.length)];
  res.json({ word: palavraAleatoria }); // Envia a palavra como um objeto JSON
});

app.get("/verificar", (req, res) => {
  const palavra = req.query.palavra;
  if (!palavra) {
    return res.status(400).send("A palavra não foi fornecida");
  }

  const palavras = obterPalavrasDoArquivo(caminhoArquivoDicionario);
  if (palavras.length === 0) {
    return res.status(500).send("Erro ao carregar as palavras do arquivo");
  }

  // Implementação da busca binária
  function buscaBinaria(lista, alvo) {
    let inicio = 0;
    let fim = lista.length - 1;

    while (inicio <= fim) {
      const meio = Math.floor((inicio + fim) / 2);
      const palavraAtual = lista[meio];

      if (palavraAtual === alvo) {
        return true;
      } else if (palavraAtual < alvo) {
        inicio = meio + 1;
      } else {
        fim = meio - 1;
      }
    }

    return false;
  }

  const palavraExiste = buscaBinaria(palavras, palavra);
  res.send(palavraExiste.toString()); // Retorna true ou false
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
