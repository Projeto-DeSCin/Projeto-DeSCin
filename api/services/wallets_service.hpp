#ifndef WALLETS_SERVICE_HPP
#define WALLETS_SERVICE_HPP

// Include libraries
#include <string>
#include <vector>
#include <optional>

// Include the base Service class
#include "service.hpp"
#include "../models/model.hpp"

class WalletsService : public Service<Wallet> {
public:
    WalletsService() = default;
    ~WalletsService() = default;

    std::optional<Wallet> show(const std::string id) const override;
    std::vector<Wallet> index() const override;
    Wallet create(const crow::json::rvalue& body) override;
    Wallet update(const crow::json::rvalue& body, const std::string id) override;
    Wallet destroy(const std::string id) override;
    
};

#endif // WALLETS_SERVICE_HPP