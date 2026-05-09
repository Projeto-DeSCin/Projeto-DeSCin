#include "wallets_routes.hpp"
#include <crow.h>
#include <nlohmann/json.hpp>
#include "../../backend/blockchain-core/src/wallet.hpp"
#include <fstream>

void WalletsRoutes::setup_routes() {

    CROW_ROUTE(app, "/wallets").methods("POST"_method)
    ([](const crow::request& req){
        try {
            auto body = nlohmann::json::parse(req.body);
            std::string wallet_id = body["wallet_id"].get<std::string>();

            Wallet wallet(wallet_id);

            std::string private_key_path = wallet_id + "_private.pem";
            std::ofstream file(private_key_path);
            if (!file.is_open())
                return crow::response(500, "{\"error\": \"Nao foi possivel salvar a chave privada\"}");

            file << wallet.get_private_key();
            file.close();

            nlohmann::json response = {
                {"wallet_id",            wallet.get_id()},
                {"public_key",           wallet.get_public_key()},
                {"balance",              wallet.get_balance()},
                {"private_key_saved_at", private_key_path},
                {"message", "Wallet criada. Chave privada salva localmente em: " + private_key_path}
            };

            return crow::response(201, response.dump());
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });

    CROW_ROUTE(app, "/wallets/<string>").methods("GET"_method)
    ([](const crow::request& req, const std::string& wallet_id){
        try {
            Wallet wallet(wallet_id);
            nlohmann::json response = {
                {"wallet_id",  wallet.get_id()},
                {"public_key", wallet.get_public_key()},
                {"balance",    wallet.get_balance()}
            };
            return crow::response(200, response.dump());
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });
}
