#ifndef USER_SERVICE_HPP
#define USER_SERVICE_HPP

// Include libraries
#include <string>
#include <optional>
#include <vector>

// Include the base Service class
#include "service.hpp"
#include "../models/model.hpp"

class UserService : public Service<User> {
public:
    // Default constructor and destructor
    UserService() = default;
    ~UserService() = default;

    // Methods
    std::optional<User> show(const std::string id) const override;
    std::vector<User> index() const override;
    User create(const crow::json::rvalue& body) override;
    User update(const crow::json::rvalue& body, const std::string id) override;
    User destroy(const std::string id) override;
};

#endif // USER_SERVICE_HPP
