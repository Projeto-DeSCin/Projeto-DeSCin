#ifndef USER_SERVICE_HPP
#define USER_SERVICE_HPP

// Include libraries
#include <string>
#include <optional>
#include <vector>
#include <pqxx/pqxx>

// Include the base Service class
#include "service.hpp"
#include "../models/model.hpp"

class UserService : public Service<User> {
public:
    // Default constructor and destructor
    UserService(pqxx::connection& conn) : Service<User>(conn) {}
    ~UserService() = default;

    // Methods
    std::optional<User> get_by_id(const std::string id) const override;
    std::vector<User> get_all() const override;
    // Métodos para controle da Autenticação
    std::optional<User> get_by_email(const std::string email) const;
    User create(const crow::json::rvalue& body) override;
    User update(const crow::json::rvalue& body, const std::string id) override;
    User destroy(const std::string id) override;

};

#endif // USER_SERVICE_HPP
