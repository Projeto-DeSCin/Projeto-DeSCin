#ifndef PROJECTS_CONTROLLER_HPP
#define PROJECTS_CONTROLLER_HPP

#include "controller.hpp"

class ProjectsController : public Controller {
public:
    ProjectsController() = default;
    ~ProjectsController() = default;
    
    crow::response get_by_id(const crow::request& req) override;
    crow::response get_by_name(const crow::request& req) override;
    crow::response get_all(const crow::request& req) override;
    crow::response post(const crow::request& req) override;
    crow::response put(const crow::request& req) override;
    crow::response delete(const crow::request& req) override;
};

#endif // PROJECTS_CONTROLLER_HPP