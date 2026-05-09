#ifndef AUTH_CONTROLLER_HPP
#define AUTH_CONTROLLER_HPP

#include "controller.hpp"

class AuthController : public Controller {
public:
    // Declarando default constructor e destructor
    AuthController() = default;
    ~AuthController() = default;

    // HTTP Methods
    crow::response get_by_id(const crow::request& req, const std::string& id) const override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response get_many(const crow::request& req) const override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response get_all(const crow::request& req) const override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response post(const crow::request& req) override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response put(const crow::request& req, const std::string& id) override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response del(const crow::request& req, const std::string& id) override { return {crow::response(405, "Method Not Allowed")}; };

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