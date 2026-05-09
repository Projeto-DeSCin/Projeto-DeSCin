#ifndef WALLETS_ROUTES_HPP
#define WALLETS_ROUTES_HPP

#include "routes.hpp"
#include <crow.h>

class WalletsRoutes : public Routes {
public:
    WalletsRoutes(crow::App<>& app, DescinNode& node) : Routes(app, node) {}
    void setup_routes() override;
};

#endif // WALLETS_ROUTES_HPP
