#ifndef PROJECTS_SERVICE_HPP
#define PROJECTS_SERVICE_HPP

// Include libraries
#include <string>
#include <optional>
#include <vector>
#include <pqxx/pqxx>

// Include the base Service class
#include "service.hpp"
#include "../models/model.hpp"

class ProjectsService : public Service<Project> {
public:
    ProjectsService(pqxx::connection& conn) : Service<Project>(conn) {}
    ~ProjectsService() = default;

    std::optional<Project> get_by_id(const std::string id) const override;
    std::vector<Project> get_all() const override;
    Project create(const crow::json::rvalue& body) override;
    Project update(const crow::json::rvalue& body, const std::string id) override;
    Project destroy(const std::string id) override;
};

#endif // PROJECTS_SERVICE_HPP