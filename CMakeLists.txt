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

find_package(Threads REQUIRED)
find_package(OpenSSL REQUIRED)

FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip
)
FetchContent_MakeAvailable(googletest)

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
    api/routes/routes.cpp
    api/routes/projects_routes.cpp
    api/routes/wallets_routes.cpp
)

set(API_FILES
    ${ROUTES_FILES}
    api/descin_node.cpp
    api/middleware/auth_middleware.cpp
)

set(UTILS_FILES
    backend/blockchain-core/src/utils/hashing/hash.cpp
    backend/blockchain-core/src/utils/encryptation/decode_signature.cpp
)

set(executable_name descin_blockchain)
add_executable(${executable_name})
target_sources(${executable_name} PRIVATE
    main_blockchain.cpp
    ${BLOCK_FILES}
    ${UTILS_FILES}
)
target_link_libraries(${executable_name} PRIVATE
    Threads::Threads
    nlohmann_json::nlohmann_json
    Crow::Crow
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
)

set(api_executable_name descin_api)
add_executable(${api_executable_name})
target_sources(${api_executable_name} PRIVATE
    main_api.cpp
    ${ROUTES_FILES}
    api/descin_node.cpp
    api/middleware/auth_middleware.cpp
    ${BLOCK_FILES}
    ${PROJECT_FILES}
    ${UTILS_FILES}
)
target_link_libraries(${api_executable_name} PRIVATE
    Threads::Threads
    nlohmann_json::nlohmann_json
    Crow::Crow
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
)

set(project_executable_name descin_projects)
add_executable(${project_executable_name})
target_sources(${project_executable_name} PRIVATE
    main_projects.cpp
    ${PROJECT_FILES}
    ${BLOCK_FILES}
    ${UTILS_FILES}
)
target_link_libraries(${project_executable_name} PRIVATE
    Threads::Threads
    nlohmann_json::nlohmann_json
    Crow::Crow
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
)

set(app_executable_name projeto_descin_app)
add_executable(${app_executable_name})
target_sources(${app_executable_name} PRIVATE
    main.cpp
    ${BLOCK_FILES}
    ${UTILS_FILES}
    ${API_FILES}
    ${PROJECT_FILES}
)
target_link_libraries(${app_executable_name} PRIVATE
    Threads::Threads
    nlohmann_json::nlohmann_json
    Crow::Crow
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
)

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
