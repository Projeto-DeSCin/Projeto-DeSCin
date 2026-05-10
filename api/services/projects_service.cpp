#include "projects_service.hpp"
#include "../models/model.hpp"

#include <optional>
#include <vector>


std::optional<Project> ProjectsService::show(const std::string id) const {
    return std::nullopt;
}

std::vector<Project> ProjectsService::index() const {
    return {};
}

Project ProjectsService::create(const crow::json::rvalue& body) {
    return {};
}

Project ProjectsService::update(const crow::json::rvalue& body, const std::string id) {
    return {};
}

Project ProjectsService::destroy(const std::string id) {
    return {};
}
