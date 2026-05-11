cmake_minimum_required(VERSION 3.8)

set(project_name Projeto_DeSCin)

project(${project_name} VERSION 1.0.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

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

FetchContent_Declare(
    libpqxx
    GIT_REPOSITORY https://github.com/jtv/libpqxx.git
    GIT_TAG 7.8.1
)
FetchContent_MakeAvailable(libpqxx)

FetchContent_Declare(
    dotenv
    GIT_REPOSITORY https://github.com/laserpants/dotenv-cpp.git
    GIT_TAG master
)
FetchContent_MakeAvailable(dotenv)

FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip
)
FetchContent_MakeAvailable(googletest)

find_package(Threads REQUIRED)
find_package(OpenSSL REQUIRED)

# Sets de Arquivos para compilação ------------------------------------------------------------

set(BLOCK_FILES
    backend/blockchain-core/src/block.cpp
    backend/blockchain-core/src/blockchain.cpp
    backend/blockchain-core/src/mempool.cpp
    backend/blockchain-core/src/transaction.cpp
    backend/blockchain-core/src/wallet.cpp
)

set(PROJECT_FILES
    backend/projects-core/project_state.cpp
    backend/projects-core/project_create_tx.cpp
    backend/projects-core/investiment_tx.cpp
    backend/projects-core/refund_tx.cpp
)

set(ROUTES_FILES
    api/routes/auth_routes.cpp
    api/routes/user_routes.cpp
    api/routes/projects_routes.cpp
    api/routes/wallets_routes.cpp
)

set(CONTROLLER_FILES
    api/controllers/auth_controller.cpp
    api/controllers/user_controller.cpp
    api/controllers/projects_controller.cpp
    api/controllers/wallets_controller.cpp
)

set(SERVICE_FILES
    api/services/auth_service.cpp
    api/services/user_service.cpp
    api/services/projects_service.cpp
    api/services/wallets_service.cpp
)

set(MIDDLEWARE_FILES
    api/middleware/auth_middleware.cpp
)

set(API_FILES
    #api/descin_node.cpp
    ${ROUTES_FILES}
    ${CONTROLLER_FILES}
    ${SERVICE_FILES}
    ${MIDDLEWARE_FILES}
)

# Arquivos referentes aos utils
set(UTILS_FILES
    backend/blockchain-core/src/utils/hashing/hash.cpp
    backend/blockchain-core/src/utils/encryptation/decode_signature.cpp
)

set(DATABASE_FILES
    database/database.cpp
    database/supabase/supabase.cpp
)

# Arquivo compilado da Blockchain -------------------------------------------------------------------------
# Nome do arquivo de Execução/Compilado da blockchain

set(executable_name descin_blockchain)
add_executable(${executable_name})
target_sources(${executable_name} PRIVATE
    backend/blockchain-core/src/main.cpp
    ${BLOCK_FILES}
    ${UTILS_FILES}
)
target_link_libraries(${executable_name} PRIVATE
    nlohmann_json::nlohmann_json
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
)

# Arquivo compilado da API -------------------------------------------------------------------------
# Nome do arquivo de Execução/Compilado da API

set(api_executable_name descin_api)
add_executable(${api_executable_name})
target_sources(${api_executable_name} PRIVATE
    api/main.cpp
    ${API_FILES}
    ${DATABASE_FILES}
)
target_link_libraries(${api_executable_name} PRIVATE
    Threads::Threads
    nlohmann_json::nlohmann_json
    Crow::Crow
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
    pqxx
    dotenv
)

# Arquivo compilado Projeto_DeSCin -----------------------------------------------------------
# Nome do arquivo de Execução/Compilado do Projeto_DeSCin

set(app_executable_name projeto_descin_app)
add_executable(${app_executable_name})
target_sources(${app_executable_name} PRIVATE
    main.cpp
    ${BLOCK_FILES}
    ${UTILS_FILES}
    ${API_FILES}
    ${PROJECT_FILES}
    ${DATABASE_FILES}
)
target_link_libraries(${app_executable_name} PRIVATE
    Threads::Threads
    nlohmann_json::nlohmann_json
    Crow::Crow
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
    pqxx
    dotenv
)

# Arquivo compilado de Testes -----------------------------------------------------------
# Nome do arquivo de Execução/Compilado dos Testes

enable_testing()
set(run_tests descin_tests)
set(BLOCK_FILES_TEST)
set(BLOCK_HEADER_TEST)

add_executable(${run_tests}
    main.test.cpp
    ${BLOCK_FILES_TEST}
    ${BLOCK_HEADER_TEST}
)

target_link_libraries(${run_tests} PRIVATE
    gtest_main
    pthread
)

include(GoogleTest)
gtest_discover_tests(${run_tests})
