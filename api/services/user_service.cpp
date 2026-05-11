// Include classes and Model
#include "user_service.hpp"
#include "../models/model.hpp"

// Include libraries
#include <optional>
#include <vector>

std::optional<User> UserService::get_by_id(const std::string id) const {
    
    return std::nullopt;
}

std::optional<User> UserService::get_by_email(const std::string email) const {
    return std::nullopt;
}

std::vector<User> UserService::get_all() const {
    return {};
}

User UserService::create(const crow::json::rvalue& body) {
    //Mockup
    User user;
    
    return user;
}

User UserService::update(const crow::json::rvalue& body, const std::string id) {
    return {};
}

User UserService::destroy(const std::string id) {
    return {};
}
