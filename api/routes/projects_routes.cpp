// Include projects routes
#include "projects_routes.hpp"
// Include libraries
#include <crow.h>

/*
 * Define routes for projects
 */
void ProjectsRoutes::setup_routes() {
    CROW_ROUTE(app, "/projects/<string>")
        .methods("GET"_method)
        ([this](const crow::request& req, const std::string& id) -> crow::response {
            try{
                return this->controller.get_by_id(req, id);
            }
            catch(const std::exception& e){
                return crow::response(500, e.what());
            }
        });
        
    CROW_ROUTE(app, "/projects")
        .methods("GET"_method)
        ([this](const crow::request& req) -> crow::response {
            try{
                return this->controller.get_many(req);
            }
            catch(const std::exception& e){
                return crow::response(500, e.what());
            }
    });
    
    CROW_ROUTE(app, "/projects")
        .methods("POST"_method)
        ([this](const crow::request& req) -> crow::response {
            try{
                return this->controller.post(req);
            }
            catch(const std::exception& e){
                return crow::response(500, e.what());
            }
        });
    CROW_ROUTE(app, "/projects/<string>")
        .methods("PUT"_method)
        ([this](const crow::request& req, const std::string& id) -> crow::response {
            try{
                return this->controller.put(req, id);
            }
            catch(const std::exception& e){
                return crow::response(500, e.what());
            }
        });
    CROW_ROUTE(app, "/projects/<string>")
        .methods("DELETE"_method)
        ([this](const crow::request& req, const std::string& id) -> crow::response {
            try{
                return this->controller.del(req, id);
            }
            catch(const std::exception& e){
                return crow::response(500, e.what());
            }
    });
}
