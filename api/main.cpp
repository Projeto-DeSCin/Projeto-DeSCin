// Include API routes
#include "routes/auth_routes.hpp"
#include "routes/user_routes.hpp"
#include "routes/projects_routes.hpp"
#include "routes/wallets_routes.hpp"

// Include Controllers
#include "controllers/auth_controller.hpp"
#include "controllers/user_controller.hpp"
#include "controllers/projects_controller.hpp"
#include "controllers/wallets_controller.hpp"

// Include Services
#include "services/user_service.hpp"
#include "services/projects_service.hpp"
#include "services/wallets_service.hpp"

// Include DeSCin node

// Include libraries
#include <crow.h>

/*
 * Initialize the DeSCin API
 */

 int main(){
    // Initialize App
    crow::App<> app;
    
    // Initialize Services
    UserService user_service;
    ProjectsService projects_service;
    WalletsService wallets_service;
    
    // Initialize Controllers
    AuthController auth_controller(user_service);
    UserController user_controller(user_service);
    ProjectsController projects_controller(projects_service);
    WalletsController wallets_controller(wallets_service);
    
    // Initialize and register Routes
    AuthRoutes auth_routes(app, auth_controller);
    auth_routes.setup_routes();

    UserRoutes user_routes(app, user_controller);
    user_routes.setup_routes();

    ProjectsRoutes projects_routes(app, projects_controller);
    projects_routes.setup_routes();

    WalletsRoutes wallets_routes(app, wallets_controller);
    wallets_routes.setup_routes();

    // Decidindo porta que a API vai rodar
    const char* port_env = std::getenv("PORT");
    uint16_t port = port_env ? std::stoi(port_env) : 8080;
    
    app.port(port).multithreaded().run();

    return 0;
}