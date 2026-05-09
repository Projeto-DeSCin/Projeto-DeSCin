// Include auth controller
#include "auth_controller.hpp"
// Include libraries
#include <crow.h>

// Authentication controller methods
crow::response AuthController::login_google(const crow::request& req) {
    try {
        
        
        return crow::response(200, "");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response AuthController::callback_google(const crow::request& req) {
    try {
        return crow::response(200, "");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response AuthController::login_github(const crow::request& req) {
    try {
        return crow::response(200, "");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response AuthController::callback_github(const crow::request& req) {
    try {
        return crow::response(200, "");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response AuthController::logout(const crow::request& req) {
    try {
        return crow::response(200, "");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}