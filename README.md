# 🧬 DeSCin Blockchain Node


![C++](https://img.shields.io/badge/C++-17-blue.svg?style=flat&logo=c%2B%2B)
![CMake](https://img.shields.io/badge/CMake-3.14+-green.svg?style=flat&logo=cmake)
![Linux](https://img.shields.io/badge/Linux-Supported-yellow.svg?style=flat&logo=linux)

Um nó de blockchain focado em Ciência Descentralizada (DeSci), construído em **C++17** moderno. Este projeto implementa a estrutura base de blocos, criptografia de carteiras (Wallets), e testes unitários automatizados, utilizando `CMake` como sistema de build.

---

## 💻 Ambientes Suportados

Este projeto foi desenhado para rodar em ambientes Linux. 
* **Ubuntu (Nativo):** Suporte total e nativo.
* **Windows 10/11:** Suporte total via **WSL 2** (Windows Subsystem for Linux). Tentar compilar nativamente no Windows com MSVC pode gerar erros nas dependências de rede.

---

## 🛠️ Pré-requisitos (Configuração do Ambiente)

### 🪟 Usuários de Windows (Preparando o WSL)
Se você está no Windows, precisará habilitar o Ubuntu antes de começar:
1. Abra o PowerShell como Administrador e rode: `wsl --install`
2. Reinicie o computador.
3. Abra o aplicativo **Ubuntu** no menu iniciar e crie seu usuário e senha.
4. Instale o **VS Code** no Windows e adicione a extensão **WSL** (da Microsoft).
5. Abra o VS Code, clique no botão azul no canto inferior esquerdo e selecione **"Connect to WSL"**. 
*A partir daqui, você estará rodando o projeto como se estivesse em um Ubuntu nativo!*

---

## 🚀 Passo a Passo: Instalação e Compilação (Ubuntu / WSL)

Abra o terminal do seu Ubuntu (ou terminal do VS Code conectado ao WSL) e siga os passos abaixo:

### 1. Clonar o Repositório
Baixe o código-fonte para a sua máquina:
```bash
git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
cd SEU_REPOSITORIO
`````

## 2. Instalar Ferramentas e Dependências
O projeto exige um compilador C++, o CMake (versão 3.14 ou superior) e a biblioteca de rede asio (necessária para a nossa API Crow).

````Bash
# Atualiza a lista de pacotes
sudo apt update

# Instala o compilador, o CMake e o Git
sudo apt install build-essential cmake git -y

# Instala a dependência de rede vital para a API
sudo apt install libasio-dev -y
````

##  3. Compilar o Projeto (Build)
Utilizamos o CMake para baixar automaticamente as bibliotecas externas (Crow API e GoogleTest) e compilar o código.


````Bash
# 1. Gera os arquivos de configuração de build na pasta 'build'
cmake -B build

# 2. Compila o projeto (Este passo pode demorar um pouco na primeira vez, pois baixa o GTest e o Crow)
cmake --build build
````

## 🎯 Executando o Projeto
Após a compilação chegar a 100%, o CMake terá gerado dois executáveis independentes.

Rodar o Nó Principal
Inicia a criação do Bloco Gênesis e a estrutura principal da blockchain:

````Bash
./build/descin_blockchain
````

Rodar os Testes Unitários (GoogleTest)\
Verifica a integridade criptográfica dos blocos e carteiras:

````Bash
./build/descin_tests
````

## 📂 Estrutura do Projeto
````PlainText
📦 DeSci_Blockchain
 ┣ 📂 api                  # Camada de Rede (Rotas Crow, Middleware e DescinNode Adapter)
 ┣ 📂 blockchain-core      # O Cérebro: Consenso, Mempool, Blocos e Transações
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📜 blockchain.cpp    # Lógica do encadeamento
 ┃ ┃ ┣ 📜 block.cpp         # Lógica de mineração e hashes
 ┃ ┃ ┣ 📜 Wallet.cpp        # Lógica de chaves RSA públicas/privadas
 ┃ ┃ ┣ 📜 main.cpp          # Ponto de entrada
 ┃ ┃ ┗ 📜 transaction.cpp   # Lògica das transações
 ┃ ┃ 
 ┃ ┣ 📂 tests               # Suítes de testes automatizados
 ┃ ┃ ┣ 📜 test_block.cpp
 ┃ ┃ ┗ 📜 test_wallet.cpp
 ┃ ┃ 
 ┃ ┗ 📂 utils
 ┃   ┗ 📜 sha256.h          # Algoritmo principal de hash
 ┃
 ┣ 📂 projects-core       # Persistência: Repositórios de Projetos e Investimentos
 ┣ 📜 CMakeLists.txt      # Orquestrador de compilação
 ┗ 📜 README.md           # Documentação principal
````

---
## 🏛️ Diagrama de Classes



---
## 🙅🏽‍♂️ Colaboradores

<table> 
    <tr>
        <td align="center">
          <a href="https://github.com/bernardobelfort">
            <img src="https://avatars.githubusercontent.com/u/153245112?v=4" width="100px;" alt="Imagem do Colaborador 1"/><br>
            <sub><b>Bernardo Belfort Leao</b></sub>
          </a>
        </td>
        <td align="center">
          <a href="https://github.com/edisiouchoacn-spec">
            <img src="https://avatars.githubusercontent.com/u/235191061?v=4" width="100px;" alt="Imagem do Colaborador 2"/><br>
            <sub><b>Edísio Uchoa Cavalcanti Neto</b></sub>
          </a>
        </td>
        <td align="center">
          <a href="https://github.com/FranciscoFaustino17">
            <img src="https://avatars.githubusercontent.com/u/209528271?v=4" width="100px;" alt="Imagem do Colaborador 3"/><br>
            <sub><b>Francisco Faustino de Souza Neto</b></sub>
          </a>
        </td>
        <td align="center">
          <a href="https://github.com/GabrielCassio">
            <img src="https://avatars.githubusercontent.com/u/91679814?v=4" width="100px;" alt="Imagem do Colaborador 4"/><br>
            <sub><b>Gabriel Cássio Gomes Cileiro</b></sub>
          </a>
        </td>
        <td align="center">
          <a href="https://github.com/VictorLemosFr">
            <img src="https://avatars.githubusercontent.com/u/107511134?v=4" width="100px;" alt="Imagem do Colaborador 5"/><br>
            <sub><b>Victor Lemos de Freitas</b></sub>
          </a>
        </td>
      </tr>
</table>
