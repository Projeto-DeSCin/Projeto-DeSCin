// Include wallets routes
#include "wallets_routes.hpp"
// Include libraries
#include <crow.h>

void WalletsRoutes::setup_routes() {
    CROW_ROUTE(app, "/wallets/<string>")
        .methods("GET"_method)
        ([this](const crow::request& req, const std::string& id) -> crow::response {
            try {
                return this->controller.get_by_id(req, id);
            }
            catch(const std::exception& e){
                return crow::response(500, e.what());
            }
        });

    CROW_ROUTE(app, "/wallets")
        .methods("POST"_method)
        ([this](const crow::request& req) -> crow::response {
            try {
                return this->controller.post(req);
            }
            catch(const std::exception& e){
                return crow::response(500, e.what());
            }
        });
}