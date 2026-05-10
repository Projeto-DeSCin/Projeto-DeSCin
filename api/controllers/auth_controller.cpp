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
            return crow::response(400, "Missing email or password");

        // Desestrutura o body da requisição
        std::string email = body["email"].s();
        std::string password = body["password"].s();

        //auto result =

        // Retorna 200 com tudo OK
        return crow::response(200, "Autenticação Realizada com Sucesso!");
        
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