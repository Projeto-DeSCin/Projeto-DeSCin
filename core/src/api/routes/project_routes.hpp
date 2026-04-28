#ifndef PROJECT_ROUTES_HPP
#define PROJECT_ROUTES_HPP

#include "crow.h"
#include "../../blockchain/chain_adapter.hpp"
#include "../middleware/auth_middleware.hpp"
#include <memory>

// GET  /api/projects               → listar projetos (filtro: ?status=open)
// GET  /api/projects/:id           → detalhes de um projeto
// POST /api/projects/:id/invest    → investir em projeto (cria tx na chain real)

template<typename App>
void register_project_routes(App& app, std::shared_ptr<ChainAdapter> bc) {

    // Listar projetos
    CROW_ROUTE(app, "/api/projects")
    .CROW_MIDDLEWARES(app, AuthMiddleware)
    ([bc](const crow::request& req) {
        std::string status_filter = "";
        auto f = req.url_params.get("status");
        if (f) status_filter = f;

        auto projects = bc->list_projects(status_filter);

        crow::json::wvalue arr(crow::json::type::List);
        for (size_t i = 0; i < projects.size(); ++i) {
            double scale = 100.0;
            auto& p = projects[i];
            crow::json::wvalue item;
            item["project_id"]      = p.project_id;
            item["name"]            = p.name;
            item["description"]     = p.description;
            item["category"]        = p.category;
            item["total_funding"]   = p.total_funding / scale;
            item["target_funding"]  = p.target_funding / scale;
            item["progress_pct"]    = p.target_funding > 0
                ? (static_cast<double>(p.total_funding) / p.target_funding) * 100.0
                : 0.0;
            item["investors_count"] = static_cast<int64_t>(p.investors_count);
            item["status"]          = p.status;
            item["created_at"]      = p.created_at;
            item["roi_estimate"]    = p.roi_estimate;
            arr[i] = std::move(item);
        }

        crow::json::wvalue res;
        res["projects"] = std::move(arr);
        res["count"]    = static_cast<int64_t>(projects.size());
        return crow::response(200, res);
    });

    // Detalhes de um projeto
    CROW_ROUTE(app, "/api/projects/<string>")
    .CROW_MIDDLEWARES(app, AuthMiddleware)
    ([bc](const crow::request&, const std::string& project_id) {
        auto proj = bc->get_project(project_id);
        if (!proj) {
            crow::json::wvalue err;
            err["error"] = "Projeto não encontrado";
            return crow::response(404, err);
        }

        crow::json::wvalue res;
        res["project_id"]      = proj->project_id;
        res["name"]            = proj->name;
        res["description"]     = proj->description;
        res["category"]        = proj->category;
        res["total_funding"]   = proj->total_funding;
        res["target_funding"]  = proj->target_funding;
        res["progress_pct"]    = proj->target_funding > 0
            ? (proj->total_funding / proj->target_funding) * 100.0 : 0.0;
        res["investors_count"] = static_cast<int64_t>(proj->investors_count);
        res["status"]          = proj->status;
        res["created_at"]      = proj->created_at;
        res["roi_estimate"]    = proj->roi_estimate;
        return crow::response(200, res);
    });

    // Investir em projeto
    CROW_ROUTE(app, "/api/projects/<string>/invest")
    .methods("POST"_method)
    .CROW_MIDDLEWARES(app, AuthMiddleware)
    ([&app, bc](const crow::request& req, const std::string& project_id) {
        auto& ctx  = app.get_context<AuthMiddleware>(req);
        auto  body = crow::json::load(req.body);

        if (!body || !body.has("amount") || !body.has("signature")) {
            crow::json::wvalue err;
            err["error"] = "Campos obrigatórios: amount, signature";
            return crow::response(400, err);
        }

        unsigned long amount  = static_cast<unsigned long>(body["amount"].u());
        std::string signature = body["signature"].s();

        if (amount == 0) {
            crow::json::wvalue err;
            err["error"] = "amount deve ser maior que zero";
            return crow::response(400, err);
        }

        if (!bc->invest(ctx.wallet_address, project_id, amount, signature)) {
            crow::json::wvalue err;
            err["error"] = "Investimento falhou: saldo insuficiente, assinatura inválida, projeto não encontrado ou encerrado";
            return crow::response(400, err);
        }

        crow::json::wvalue res;
        res["message"]    = "Investimento realizado e minerado na chain";
        res["project_id"] = project_id;
        res["amount"]     = static_cast<uint64_t>(amount);
        return crow::response(200, res);
    });
}

#endif // PROJECT_ROUTES_HPP
