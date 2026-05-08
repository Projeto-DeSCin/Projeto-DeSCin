#include "routes.hpp"

Routes::Routes(crow::SimpleApp& app) : app(app) {
    setup_routes();
}

void Routes::setup_routes() {
    // Interface
    CROW_ROUTE(app, "/")([] {
        return "Hello, World!";
    });

    // Users/ Walllets

    // Blockchain
}