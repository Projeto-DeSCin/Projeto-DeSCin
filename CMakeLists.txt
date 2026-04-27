# Definindo a versão mínima requerida do CMAKE pelo projeto
cmake_minimum_required(VERSION 3.8)

set(project_name Projeto_DeSCin)

# Definindo informações básicas sorbe o projeto
project(${project_name} VERSION 1.0.0)

# Definindo as variáveis de proejto referentes à versão do c++ utilizado
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Ferramentas de Runtime do Projeto -------
# Incluindo o fetch content que gerencia e faz catching das dependências direto do GitHub
include(FetchContent)

message(STATUS "Baixando nlohmann/json...")
FetchContent_Declare(json
    URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz
)
FetchContent_MakeAvailable(json)

message(STATUS "Baixando Crow...")
FetchContent_Declare(crow
    URL https://github.com/CrowCpp/Crow/archive/refs/heads/master.zip
)
FetchContent_MakeAvailable(crow)

# Para Edísio e os demais, a Biblioteca do OpenSSl é a única que não baixa via protocolo http
# pois ela já pode existir em sistema linux/mac, então aqui é procurado apenas no sistema local
# Dê preferência ao uso do Linux
find_package(OpenSSL REQUIRED)

FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip
)
FetchContent_MakeAvailable(googletest)
# -------------------------------

# Nome do arquivo de Execução/Compilado
set(executable_name descin_blockchain)

# Definindo o nome do arquivo executável do Projeto_DeSCin
add_executable(${executable_name})

# Defininfo conjunto de arquivos para compilação
set(BLOCK_FILES
    core/src/block.cpp
    core/src/blockchain.cpp
    core/src/mempool.cpp
    core/src/transaction.cpp
    core/src/wallet.cpp
)

set(UTILS_FILES
    core/src/utils/hash.cpp
    core/src/utils/date.cpp
    core/src/utils/hash_validation.cpp
    core/src/utils/decode_signature.cpp
    core/src/utils/string_to_pbkey.cpp
)

# Atribuindo arquivos correspondentes a criação do executável
target_sources(${executable_name} PRIVATE
    core/src/main.cpp
    ${BLOCK_FILES}
    ${UTILS_FILES}
)

# Atribuindo as bibliotecas ao programa
target_link_libraries(${executable_name} PRIVATE
    nlohmann_json::nlohmann_json
    Crow::Crow
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
)

# Ferramenta de testes unitários ----------
enable_testing()

set(run_tests descin_tests)

set(BLOCK_FILES_TEST)

set(BLOCK_HEADER_TEST)

add_executable(${run_tests}
    core/src/tests/main.test.cpp
    ${BLOCK_FILES_TEST}
    ${BLOCK_HEADER_TEST}
)

target_link_libraries(${run_tests} PRIVATE
    gtest_main
    pthread
)

include(GoogleTest)
gtest_discover_tests(${run_tests})
