#ifndef AUTH_CONTROLLER_HPP
#define AUTH_CONTROLLER_HPP

#include "controller.hpp"

class AuthController : public Controller {
public:
    // Declarando default constructor e destructor
    AuthController() = default;
    ~AuthController() = default;

    // HTTP Methods
    crow::response get_by_id(const crow::request& req) const override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response get_many(const crow::request& req) const override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response get_all(const crow::request& req) const override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response post(const crow::request& req) override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response put(const crow::request& req) override { return {crow::response(405, "Method Not Allowed")}; };
    crow::response delete(const crow::request& req) override { return {crow::response(405, "Method Not Allowed")}; };

    // Verifica se o usuário está autenticado
    crow::response login(const crow::request& req);
    // Faz o logout do usuário
    crow::response logout(const crow::request& req);
    
};

#endif // AUTH_CONTROLLER_HPP