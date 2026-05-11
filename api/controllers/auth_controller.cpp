// Include auth controller
#include "auth_controller.hpp"

// Include libraries
#include <crow.h>
#include <string>

// Authentication controller methods
// Autenticação com Email e Senha
crow::response AuthController::login(const crow::request& req) {
    try {
        // Faz o parse do body da requisição
        // Desmembra o body da requisição
        auto body = crow::json::load(req.body);
        // Verifica se o body existe completamente
        if (!body.has("email") || !body.has("password"))
            return crow::response(400, "Falta o email ou a senha!");

        if (!body.has("role"))
            return crow::response(400, "Falta escolher seu Cargo!");

        // Desestrutura o body da requisição
        std::string email = body["email"].s();
        std::string password = body["password"].s();
        std::string role_choice = body["RoleChoice"].s();

        std::string user_id = auth_service.login(email, password);

        // Valida o retorno, caso o usuário não exista ou a senha seja inválida
        if (user_id.empty())
            return crow::response(401, "Email ou senha inválida");

        // Construindo as informações da response
        crow::json::wvalue res;
        res["user_id"] = user_id;
        res["description"] = "Autenticação Realizada com Sucesso!";
        
        // Retorna 200 com tudo OK
        return crow::response(200, res);
        
    } catch (const std::exception& e) {
        // Retorna um 500 do servidor
        return crow::response(500, e.what());
    }
}

// Login com Google
crow::response AuthController::login_google(const crow::request& req) {
    try {
        return crow::response(200, "");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response AuthController::callback_google(const crow::request& req) {
    try {
        return crow::response(200, "");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response AuthController::login_github(const crow::request& req) {
    try {
        return crow::response(200, "");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response AuthController::callback_github(const crow::request& req) {
    try {
        return crow::response(200, "");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response AuthController::logout(const crow::request& req) {
    try {
        return crow::response(200, "");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}