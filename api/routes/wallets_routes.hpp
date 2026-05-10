#ifndef WALLETS_ROUTES_HPP
#define WALLETS_ROUTES_HPP

// Include libraries
#include <crow.h>
// Include routes class
#include "routes.hpp"
#include "../controllers/wallets_controller.hpp"

class WalletsRoutes : public Routes<WalletsController> {
public:
    WalletsRoutes(crow::App<>& app, WalletsController& control) : Routes<WalletsController>(app, control) {}
    ~WalletsRoutes() = default;
    void setup_routes() override;
};

#endif // WALLETS_ROUTES_HPP
