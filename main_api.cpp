// Include API routes
#include "api/routes/auth_routes.hpp"
#include "api/routes/projects_routes.hpp"
#include "api/routes/wallets_routes.hpp"

// Include Controllers
#include "api/controllers/auth_controller.hpp"
#include "api/controllers/projects_controller.hpp"
#include "api/controllers/wallets_controller.hpp"

// Include libraries
#include <crow.h>

/*
 * Initialize the DeSCin API
 */

 int main(){
    // Initialize App
    crow::App<> app;
    
    // Initialize Controllers
    AuthController auth_controller;
    ProjectsController projects_controller;
    WalletsController wallets_controller;
    
    
    // Initialize Routes
    AuthRoutes auth_routes(app, auth_controller);
    auth_routes.setup_routes();

    ProjectsRoutes projects_routes(app, projects_controller);
    projects_routes.setup_routes();

    WalletsRoutes wallets_routes(app, wallets_controller);
    wallets_routes.setup_routes();

    app.bindaddr("0.0.0.0");
    
    // Run Server
    app.port(18080).multithreaded().run();
}