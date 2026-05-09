#include "projects_controller.hpp"
#include <crow.h>

crow::response ProjectsController::get_by_id(const crow::request& req, const std::string& id) const {
    return crow::response(200, "");
}

crow::response ProjectsController::get_many(const crow::request& req) const {
    return crow::response(200, "");
}

crow::response ProjectsController::get_all(const crow::request& req) const {
    return crow::response(200, "");
}

crow::response ProjectsController::post(const crow::request& req) {
    return crow::response(200, "");
}

crow::response ProjectsController::put(const crow::request& req, const std::string& id) {
    return crow::response(200, "");
}

crow::response ProjectsController::del(const crow::request& req, const std::string& id) {
    return crow::response(200, "");
}

