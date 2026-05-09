#include "projects_routes.hpp"
#include <crow.h>
#include <nlohmann/json.hpp>

void ProjectsRoutes::setup_routes() {

    CROW_ROUTE(app, "/projects").methods("GET"_method)
    ([this](const crow::request& req){
        try {
            auto projects = node.get_projects();
            nlohmann::json response = nlohmann::json::array();
            for (const auto& p : projects) {
                response.push_back({
                    {"project_id",      p.project_id},
                    {"name",            p.name},
                    {"description",     p.description},
                    {"category",        p.category},
                    {"total_funding",   p.total_funding},
                    {"target_funding",  p.target_funding},
                    {"investors_count", p.investors_count},
                    {"status",          p.status},
                    {"created_at",      p.created_at},
                    {"roi_estimate",    p.roi_estimate}
                });
            }
            return crow::response(200, response.dump());
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });

    CROW_ROUTE(app, "/projects/<string>").methods("GET"_method)
    ([this](const crow::request& req, const std::string& id){
        try {
            auto project = node.get_project_by_id(id);
            if (!project)
                return crow::response(404, "{\"error\": \"Projeto nao encontrado\"}");
            nlohmann::json response = {
                {"project_id",      project->project_id},
                {"name",            project->name},
                {"description",     project->description},
                {"category",        project->category},
                {"total_funding",   project->total_funding},
                {"target_funding",  project->target_funding},
                {"investors_count", project->investors_count},
                {"status",          project->status},
                {"created_at",      project->created_at},
                {"roi_estimate",    project->roi_estimate}
            };
            return crow::response(200, response.dump());
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });

    CROW_ROUTE(app, "/projects").methods("POST"_method)
    ([this](const crow::request& req){
        try {
            auto body = nlohmann::json::parse(req.body);
            ProjectsBody project;
            project.project_id      = body["project_id"].get<std::string>();
            project.name            = body["name"].get<std::string>();
            project.description     = body["description"].get<std::string>();
            project.category        = body["category"].get<std::string>();
            project.target_funding  = body["target_funding"].get<unsigned long>();
            project.roi_estimate    = body["roi_estimate"].get<double>();
            project.total_funding   = 0;
            project.investors_count = 0;
            project.status          = "open";
            project.created_at      = body.value("created_at", "");
            std::string signature   = body.value("signature", "");
            std::string sender      = body.value("sender", "system");
            bool success = node.create_project(sender, project, signature);
            if (success)
                return crow::response(201, "{\"message\": \"Projeto criado com sucesso\"}");
            return crow::response(400, "{\"error\": \"Falha ao criar projeto\"}");
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });

    CROW_ROUTE(app, "/projects/<string>/invest").methods("POST"_method)
    ([this](const crow::request& req, const std::string& project_id){
        try {
            auto body = nlohmann::json::parse(req.body);
            std::string   sender    = body["sender"].get<std::string>();
            unsigned long amount    = body["amount"].get<unsigned long>();
            std::string   signature = body.value("signature", "");
            bool success = node.process_investment(sender, project_id, amount, signature);
            if (success)
                return crow::response(201, "{\"message\": \"Investimento realizado com sucesso\"}");
            return crow::response(400, "{\"error\": \"Falha ao processar investimento\"}");
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });

    CROW_ROUTE(app, "/projects/<string>/refund").methods("POST"_method)
    ([this](const crow::request& req, const std::string& project_id){
        try {
            auto body = nlohmann::json::parse(req.body);
            std::string   investor  = body["investor_address"].get<std::string>();
            unsigned long amount    = body["amount"].get<unsigned long>();
            std::string   signature = body.value("signature", "");
            bool success = node.process_refund(investor, project_id, amount, signature);
            if (success)
                return crow::response(200, "{\"message\": \"Reembolso processado com sucesso\"}");
            return crow::response(400, "{\"error\": \"Falha ao processar reembolso\"}");
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });
}
