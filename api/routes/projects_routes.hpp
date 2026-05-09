#ifndef PROJECTS_ROUTES_HPP
#define PROJECTS_ROUTES_HPP

// Include libraries
#include <crow.h>
// Include Base class
#include "routes.hpp"
#include "controllers/projects_controller.hpp"

/* 
 * Routes for projects in DeSCin
 */
class ProjectsRoutes : public Routes {
private:
    ProjectsController& control;
        
public:
    ProjectsRoutes(crow::App<>& app, ProjectsController& control) : Routes(app), control(control) {}
    void setup_routes() override;
};

#endif // PROJECTS_ROUTES_HPP