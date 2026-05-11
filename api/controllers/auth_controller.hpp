#ifndef AUTH_CONTROLLER_HPP
#define AUTH_CONTROLLER_HPP

// Include libraries
#include <crow.h>
#include <string>

// Include controller base class and user service
#include "../services/auth_service.hpp"

class AuthController {
    AuthService& auth_service;
public:
    // Declarando default constructor e destructor
    AuthController(AuthService& auth_service) : auth_service(auth_service) {}  
    ~AuthController() = default;

    // Autenticação Email e Senha
    crow::response login(const crow::request& req);
    // Faz o logout do usuário
    crow::response logout(const crow::request& req);
    // Verifica se o usuário está autenticado com Google
    crow::response login_google(const crow::request& req);
    // Verifica o callback do Google
    crow::response callback_google(const crow::request& req);
    // Verifica se o usuário está autenticado com Github
    crow::response login_github(const crow::request& req);
    // Verifica o callback do Github
    crow::response callback_github(const crow::request& req);
    
};

#endif // AUTH_CONTROLLER_HPP