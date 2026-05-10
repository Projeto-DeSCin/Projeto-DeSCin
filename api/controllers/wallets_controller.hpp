#ifndef WALLETS_CONTROLLER_HPP
#define WALLETS_CONTROLLER_HPP

#include <crow.h>
#include "controller.hpp"
#include "../services/wallets_service.hpp"

class WalletsController : public Controller<WalletsService> {
public:
    // Default constructor and destructor
    WalletsController(WalletsService& service) : Controller<WalletsService>(service) {}
    ~WalletsController() = default;

    // Get a wallet by its ID
    crow::response get_by_id(const crow::request& req, const std::string& id) const override;
    // Get a wallet by its ID
    crow::response get_many(const crow::request& req) const override;
    // Get all wallets
    crow::response get_all(const crow::request& req) const override;
    // Create a new wallet
    crow::response post(const crow::request& req) override;
    // Update a wallet
    crow::response put(const crow::request& req, const std::string& id) override;
    // Delete a wallet - Is not allowed
    crow::response del(const crow::request& req, const std::string& id) override { return crow::response(405, "Method not allowed");};
};

#endif // WALLETS_CONTROLLER_HPP