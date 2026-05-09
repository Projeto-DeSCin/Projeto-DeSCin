#include "wallets_controller.hpp"
#include <crow.h>

crow::response WalletsController::get_by_id(const crow::request& req, const std::string& id) const {

    return crow::response(200, "");
}

crow::response WalletsController::get_many(const crow::request& req) const {
    return crow::response(200, "");
}

crow::response WalletsController::get_all(const crow::request& req) const  {
    return crow::response(200, "");
}

crow::response WalletsController::post(const crow::request& req) {
    return crow::response(200, "");
}

crow::response WalletsController::put(const crow::request& req, const std::string& id) {
    return crow::response(200, "");
}