#include "user_service.hpp"
#include "../models/model.hpp"

#include <optional>
#include <vector>

std::optional<User> UserService::show(const std::string id) const {
    return std::nullopt;
}

std::vector<User> UserService::index() const {
    return {};
}

User UserService::create(const crow::json::rvalue& body) {
    return {};
}

User UserService::update(const crow::json::rvalue& body, const std::string id) {
    return {};
}

User UserService::destroy(const std::string id) {
    return {};
}
