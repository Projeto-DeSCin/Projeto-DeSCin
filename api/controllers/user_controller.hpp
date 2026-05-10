#ifndef USER_CONTROLLER_HPP
#define USER_CONTROLLER_HPP

// Include libraries
#include <crow.h>
#include <string>
// Include the controller base class
#include "controller.hpp"
#include "../services/user_service.hpp"

class UserController : public Controller<UserService> {
public:
    // Default constructor and destructor
    UserController(UserService& service) : Controller<UserService>(service) {}
    ~UserController() = default;

    // Methods
    crow::response get_by_id (const crow::request& req, const std::string& id) const override;
    crow::response get_many (const crow::request& req) const override;
    crow::response get_all (const crow::request& req) const override;
    crow::response post (const crow::request& req) override;
    crow::response put (const crow::request& req, const std::string& id) override;
    crow::response del (const crow::request& req, const std::string& id) override;
};

#endif // USER_CONTROLLER_HPP