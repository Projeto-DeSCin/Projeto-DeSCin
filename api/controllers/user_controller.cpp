// Include the user class controller
#include "user_controller.hpp"
// Include libraries
#include <crow.h>
#include <string>

crow::response UserController::get_by_id(const crow::request& req, const std::string& id) const {
    try {
        return crow::response(200, "Usuário Encontrado!");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::get_many(const crow::request& req) const {
    try {
        return crow::response(200, "Usuários Encontrados!");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::get_all(const crow::request& req) const {
    try {
        return crow::response(200, "Todos os Usuários foram Encontrados!");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::post(const crow::request& req) {
    try {
        return crow::response(200, "Usuário Criado!");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::put(const crow::request& req, const std::string& id) {
    try {
        return crow::response(200, "Usuário Atualizado!");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }   
}

crow::response UserController::del(const crow::request& req, const std::string& id) {
    try {
        return crow::response(200, "Usuário Deletado!");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}
