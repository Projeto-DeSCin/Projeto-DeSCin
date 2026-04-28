// Em caso de teste
#include "blockchain-core/src/tests/function_test_blockchain.hpp"

// Iniciando API
#include <crow.h>
#include <nlohmann/json.hpp>

#include "api/descin_node.hpp"


int main(void) {
    // Função de teste
    function_test_blockchain();

    // // Iniciando API
    // crow::SimpleApp app;

    // // Criando um nó DeSCin utilizando um ponteiro compartilhado
    // auto node = std::make_shared<DescinNode>(4);

    // CROW_ROUTE(app, "/invest").methods(crow::HTTPMethod::POST)
    //     ([node](const crow::request& req) {
    //         auto body = nlohmann::json::parse(req.body);

    //         bool success = node->process_investment(
    //             body["sender"],
    //             body["project_id"],
    //             body["amount"],
    //             body["signature"]
    //         );

    //         if (success) return crow::response(200, "Investimento realizado!");
    //         return crow::response(400, "Falha no processo.");
    //     });
    // app.port(18080).run();
}
