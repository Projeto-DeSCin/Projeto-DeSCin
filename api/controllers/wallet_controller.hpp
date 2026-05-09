#ifndef WALLET_CONTROLLER_HPP
#define WALLET_CONTROLLER_HPP

#include "controller.hpp"

class WalletController : public Controller {
public:
    WalletController() = default;
    ~WalletController() = default;

    // Get a wallet by its ID
    crow::response get_by_id(const crow::request& req) const override;
    // Get a wallet by its ID
    crow::response get_by_many(const crow::request& req) const override;
    // Get all wallets
    crow::response get_all(const crow::request& req) const override;

    // Create a new wallet
    crow::response post(const crow::request& req) override;

    // Update a wallet
    crow::response put(const crow::request& req) override;
    
    // Delete a wallet - Is not allowed
    crow::response delete(const crow::request& req) override { return crow::response(405, "Method not allowed");};
};

#endif // WALLET_CONTROLLER_HPP