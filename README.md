# 🧬 DeSci Blockchain Node

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
./build/descidescin_blockchain
````

Rodar os Testes Unitários (GoogleTest)\
Verifica a integridade criptográfica dos blocos e carteiras:

````Bash
./build/descin_tests
````

## 📂 Estrutura do Projeto
````PlainText
📦 DeSci_Blockchain
 ┣ 📂 src
 ┃ ┣ 📜 Block.cpp        # Lógica de mineração e hashes
 ┃ ┣ 📜 Block.h
 ┃ ┣ 📜 Wallet.cpp       # Lógica de chaves públicas/privadas <Ainda em implementação>
 ┃ ┣ 📜 Wallet.h
 ┃ ┣ 📜 main.cpp         # Ponto de entrada do Nó
 ┃ ┣ 📜 sha256.h         # Algoritmo de criptografia
 ┃ ┣ 📜 test_block.cpp   # Suíte de testes da estrutura de Blocos
 ┃ ┗ 📜 test_wallet.cpp  # Suíte de testes das Carteiras
 ┣ 📜 CMakeLists.txt     # Orquestrador de compilação e dependências
 ┗ 📜 README.md          # Este arquivo
````