#ifndef USER_ROUTES_HPP
#define USER_ROUTES_HPP

#include <crow.h>
#include "routes.hpp"
#include "../controllers/user_controller.hpp"

class UserRoutes : public Routes<UserController> {
public:
    UserRoutes(crow::App<>& app, UserController& control) : Routes<UserController>(app, control) {}
    ~UserRoutes() = default;
    void setup_routes() override;
};

#endif // USER_ROUTES_HPP