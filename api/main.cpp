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
#include "services/auth_service.hpp"
#include "services/user_service.hpp"
#include "services/projects_service.hpp"
#include "services/wallets_service.hpp"

// Include DeSCin node

// Include Supabase
#include "../database/supabase/supabase.hpp"

// Include libraries
#include <crow.h>
#include <pqxx/pqxx>
#include <dotenv.h>

/*
 * Initialize the DeSCin API
 */

 int main(){
    // Initialize App
    crow::App<> app;

    // Load environment variables
    dotenv::init("../database/supabase/supabase.env");
    dotenv::init(dotenv::Preserve);
    // Initialize Supabase Connection
    Supabase db;
    
    // Initialize Services
    UserService user_service(db.getConnection());
    ProjectsService projects_service(db.getConnection());
    WalletsService wallets_service(db.getConnection());
    AuthService auth_service(user_service, db.getConnection());
    
    // Initialize Controllers
    AuthController auth_controller(auth_service);
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