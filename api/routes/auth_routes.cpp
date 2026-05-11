// Include routes
#include "auth_routes.hpp"
// Include libraries
#include <crow.h>

void AuthRoutes::setup_routes() {
    // Rota de Autenticação Padrão --------------------------
    CROW_ROUTE(app, "/auth/login")
        .methods("POST"_method)
        ([this](const crow::request& req) -> crow::response {
        try {            
            // Chama o método de login do controller
            return this->controller.login(req);
            
        } catch (const std::exception& e) {
            return crow::response(500, e.what());
        }
    });
    
    // Rota de Autenticação do Google ------------------------
    CROW_ROUTE(app, "/auth/google/url")
        .methods("GET"_method)
        ([this](const crow::request& req) -> crow::response { //Lambda functions não herdam os membros da classe
            try{
                return this->controller.login_google(req);
            }
            catch (const std::exception& e) {
                return crow::response(500, e.what());
            }
        });

    CROW_ROUTE(app, "/auth/google/callback")
        .methods("GET"_method)
        ([this](const crow::request& req) -> crow::response {
            try{
                return this->controller.callback_google(req);
            }
            catch (const std::exception& e) {
                return crow::response(500, e.what());
            }
        });


    // Rotas de Autenticação do GitHub -------------------------------
    CROW_ROUTE(app, "/auth/github/url")
        .methods("GET"_method)
        ([this](const crow::request& req) -> crow::response {
            try{
                return this->controller.login_github(req);
            }
            catch (const std::exception& e) {
                return crow::response(500, e.what());
            }
        });
        
    CROW_ROUTE(app, "/auth/github/callback")
        .methods("GET"_method)
        ([this](const crow::request& req) -> crow::response {
            try{
                return this->controller.callback_github(req);
            }
            catch (const std::exception& e) {
                return crow::response(500, e.what());
            }
        });
}
