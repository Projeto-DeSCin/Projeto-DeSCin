#include "wallets_service.hpp"
#include "../models/model.hpp"

#include <optional>
#include <vector>

std::optional<Wallet> WalletsService::get_by_id(const std::string id) const {
    return std::nullopt;
}

std::vector<Wallet> WalletsService::get_all() const {
    return {};
}

Wallet WalletsService::create(const crow::json::rvalue& body) {
    return {};
}

Wallet WalletsService::update(const crow::json::rvalue& body, const std::string id) {
    return {};
}

Wallet WalletsService::destroy(const std::string id) {
    return {};
}
