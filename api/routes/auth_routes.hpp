#ifndef AUTH_ROUTES_HPP
#define AUTH_ROUTES_HPP

// Include libraries
#include <crow.h>
// Include routes class
#include "routes.hpp"
#include "../controllers/auth_controller.hpp"

class AuthRoutes : public Routes<AuthController> {
public:
    AuthRoutes(crow::App<>& app, AuthController& control) : Routes<AuthController>(app, control) {}
    ~AuthRoutes() = default;
    void setup_routes() override;
};

#endif // AUTH_ROUTES_HPP
