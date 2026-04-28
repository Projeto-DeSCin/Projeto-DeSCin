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
find_package(Threads REQUIRED)
find_package(OpenSSL REQUIRED)

FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip
)
FetchContent_MakeAvailable(googletest)
# -----------------------------------------------------------

# Nome do arquivo de Execução/Compilado
set(executable_name descin_blockchain)

# Definindo o nome do arquivo executável do Projeto_DeSCin
add_executable(${executable_name})

# Defininfo conjunto de arquivos para compilação
set(BLOCK_FILES
    blockchain-core/src/block.cpp
    blockchain-core/src/blockchain.cpp
    blockchain-core/src/mempool.cpp
    blockchain-core/src/transaction.cpp
    blockchain-core/src/wallet.cpp
)

set(PROJECT_FILES
    projects-core/project_repository.cpp
)

set(API_FILES
    api/descin_node.cpp
    api/middleware/auth_middleware.cpp
)

set(UTILS_FILES
    blockchain-core/src/utils/hashing/hash.cpp
    blockchain-core/src/utils/encryptation/decode_signature.cpp
)

# Atribuindo arquivos correspondentes a criação do executável
target_sources(${executable_name} PRIVATE
    main.cpp
    ${BLOCK_FILES}
    ${PROJECT_FILES}
    ${UTILS_FILES}
)

# Atribuindo as bibliotecas ao programa
target_link_libraries(${executable_name} PRIVATE
    Threads::Threads
    nlohmann_json::nlohmann_json
    Crow::Crow
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
)

# Ferramentas de runtime da API -------------------------------------

# Nome do arquivo de Execução/Compilado
set(api_executable_name descin_api)

# Definindo o nome do arquivo executável da api do Projeto_DeSCin
add_executable(${api_executable_name})

# Atribuindo arquivos correspondentes a criação do executável
target_sources(${api_executable_name} PRIVATE
    main.cpp
    ${BLOCK_FILES}
    ${PROJECT_FILES}
    ${API_FILES}
    ${UTILS_FILES}
)

# Atribuindo as bibliotecas ao programa
target_link_libraries(${api_executable_name} PRIVATE
    Threads::Threads
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
    blockchain-core/src/tests/main.test.cpp
    ${BLOCK_FILES_TEST}
    ${BLOCK_HEADER_TEST}
)

target_link_libraries(${run_tests} PRIVATE
    gtest_main
    pthread
)

include(GoogleTest)
gtest_discover_tests(${run_tests})
