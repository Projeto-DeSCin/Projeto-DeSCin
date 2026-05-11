#ifndef AUTH_SERVICE_HPP
#define AUTH_SERVICE_HPP

// Include classe para interação com o banco de dados
#include "user_service.hpp"

// Include libraries
#include <pqxx/pqxx>
#include <string>

class AuthService {
private:
    UserService& user_service;
    pqxx::connection& conn;
public:
    AuthService(UserService& user_service, pqxx::connection& conn) : user_service(user_service), conn(conn) {}
    ~AuthService() = default;

    // Métodos do serviço de autenticação
    std::string login(const std::string& email, const std::string& password);
    std::string logout(const std::string& token);
};

#endif // AUTH_SERVICE_HPP