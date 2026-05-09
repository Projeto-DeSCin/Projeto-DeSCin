// Include 
#include "auth_routes.hpp"
#include '../controllers/auth_controller.hpp'

void AuthRoutes::setup_routes(crow::App<>& app) {
    // Rota de Autenticação do Google
    CROW_ROUTE(app, "/auth/google/url")
        .methods("GET"_method)
        .handler([&controller](const crow::Request&, crow::Response& res) {
            try{
                return 
                
            }
            catch (const std::exception& e) {
                res.code = 500;
                res.end(e.what());
            }
        });

    CROW_ROUTE(app, "/auth/google/callback")
        .methods("GET"_method)
        .handler([&controller](const crow::Request&, crow::Response& res) {
            try{
                
            }
            catch (const std::exception& e) {
                res.code = 500;
                res.end(e.what());
            }
        });


    // Rotas de Autenticação do GitHub
    CROW_ROUTE(app, "/auth/github/url")
        .methods("GET"_method)
        .handler([&controller](const crow::Request&, crow::Response& res) {
            try{
                
            }
            catch (const std::exception& e) {
                res.code = 500;
                res.end(e.what());
            }
        });
        
    CROW_ROUTE(app, "/auth/github/callback")
        .methods("GET"_method)
        .handler([&controller](const crow::Request&, crow::Response& res) {
            try{
                
            }
            catch (const std::exception& e) {
                res.code = 500;
                res.end(e.what());
            }
        });
}
