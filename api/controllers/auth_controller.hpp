#ifndef AUTH_CONTROLLER_HPP
#define AUTH_CONTROLLER_HPP

// Include libraries
#include <crow.h>
#include <string>

// Include controller base class and user service
#include "controller.hpp"
#include "../services/user_service.hpp"

class AuthController : public Controller<UserService> {
public:
    // Declarando default constructor e destructor
    AuthController(UserService& user_service) : Controller<UserService>(user_service) {}  
    ~AuthController() = default;

    // HTTP Methods
    crow::response get_by_id(const crow::request& req, const std::string& id) const override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response get_many(const crow::request& req) const override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response get_all(const crow::request& req) const override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response post(const crow::request& req) override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response put(const crow::request& req, const std::string& id) override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response del(const crow::request& req, const std::string& id) override { return {crow::response(405, "Method Not Allowed")}; };

<<<<<<< HEAD
=======

    // Autenticação Email e Senha
    crow::response login(const crow::request& req);
    
>>>>>>> feat/api
    // Verifica se o usuário está autenticado com Google
    crow::response login_google(const crow::request& req);
    // Verifica o callback do Google
    crow::response callback_google(const crow::request& req);
    // Verifica se o usuário está autenticado com Github
    crow::response login_github(const crow::request& req);
    // Verifica o callback do Github
    crow::response callback_github(const crow::request& req);
    
    // Faz o logout do usuário
    crow::response logout(const crow::request& req);
    
};

#endif // AUTH_CONTROLLER_HPP