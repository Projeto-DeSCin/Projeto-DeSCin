#ifndef PROJECTS_ROUTES_HPP
#define PROJECTS_ROUTES_HPP

#include "routes.hpp"
#include <crow.h>

class ProjectsRoutes : public Routes {
public:
    ProjectsRoutes(crow::App<>& app, DescinNode& node) : Routes(app, node) {}
    void setup_routes() override;
};

#endif // PROJECTS_ROUTES_HPP
