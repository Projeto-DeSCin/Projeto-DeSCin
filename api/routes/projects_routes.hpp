#ifndef PROJECTS_ROUTES_HPP
#define PROJECTS_ROUTES_HPP

// Include libraries
#include <crow.h>

// Include Base class
#include "routes.hpp"
#include "../controllers/projects_controller.hpp"

/* 
 * Routes for projects in DeSCin
 */
class ProjectsRoutes : public Routes <ProjectsController>{
        
public:
    ProjectsRoutes(crow::App<>& app, ProjectsController& control) : Routes<ProjectsController>(app, control) {}
    ~ProjectsRoutes() = default;
    void setup_routes() override;
};

#endif // PROJECTS_ROUTES_HPP
