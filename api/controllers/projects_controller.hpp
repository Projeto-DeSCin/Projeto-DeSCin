#ifndef PROJECTS_CONTROLLER_HPP
#define PROJECTS_CONTROLLER_HPP

#include <crow.h>
#include "controller.hpp"
#include "../services/projects_service.hpp"

class ProjectsController : public Controller<ProjectsService> {
public:
    // Default constructor and destructor
    ProjectsController(ProjectsService& service) : Controller<ProjectsService>(service) {}
    ~ProjectsController() = default;
    
    crow::response get_by_id(const crow::request& req, const std::string& id) const override;
    crow::response get_many(const crow::request& req) const override;
    crow::response get_all(const crow::request& req) const override;
    crow::response post(const crow::request& req) override;
    crow::response put(const crow::request& req, const std::string& id) override;
    crow::response del(const crow::request& req, const std::string& id) override;
};

#endif // PROJECTS_CONTROLLER_HPP