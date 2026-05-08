// Include API routes
#include "api/routes/routes.hpp"
// Include libraries
#include <crow.h>

/*
 * Initialize the API
 */

int main(){
    crow::SimpleApp app;
    Routes routes(app);

    app.bindaddr("0.0.0.0");
    // Run the server
    app.port(18080).multithreaded().run();
}