#include "projects_service.hpp"
#include "../models/model.hpp"
#include "../exceptions/exceptions.hpp"

#include <optional>
#include <vector>

namespace {
    Project row_to_project(const pqxx::row& row) {
        Project p;
        p.id                   = row[0].as<int>();
        p.name                 = row[1].as<std::string>();
        p.knowledge_area       = row[2].is_null() ? "" : row[2].as<std::string>();
        p.institution          = row[3].is_null() ? "" : row[3].as<std::string>();
        p.resume               = row[4].is_null() ? "" : row[4].as<std::string>();
        p.description          = row[5].is_null() ? "" : row[5].as<std::string>();
        p.status               = row[6].as<std::string>();
        p.initial_token_price  = row[7].as<double>();
        p.total_funding        = row[8].as<double>();
        p.target_funding       = row[9].as<double>();
        p.founders_percentage  = row[10].as<double>();
        p.community_percentage = row[11].as<double>();
        p.liquidity_percentage = row[12].as<double>();
        p.reserved_percentage  = row[13].as<double>();
        p.investors_count      = row[14].as<unsigned long>();
        p.roi_estimate         = row[15].as<double>();
        p.created_at           = row[16].as<std::string>();
        p.updated_at           = row[17].as<std::string>();
        return p;
    }

    const char* SELECT_PROJECT =
        "SELECT id, name, knowledge_area, institution, resume, description, "
        "status, initial_token_price, total_funding, target_funding, "
        "founders_percentage, community_percentage, liquidity_percentage, "
        "reserved_percentage, investors_count, roi_estimate, "
        "created_at::text, updated_at::text FROM projects";
}

std::optional<Project> ProjectsService::get_by_id(const std::string id) const {
    pqxx::work txn(conn);
    auto r = txn.exec_params(
        std::string(SELECT_PROJECT) + " WHERE id = $1", id);
    txn.commit();
    if (r.empty()) throw NotFoundException("Projeto não encontrado: " + id);
    return row_to_project(r[0]);
}

std::vector<Project> ProjectsService::get_all() const {
    pqxx::work txn(conn);
    auto r = txn.exec(std::string(SELECT_PROJECT) + " ORDER BY id");
    txn.commit();
    std::vector<Project> projects;
    for (const auto& row : r)
        projects.push_back(row_to_project(row));
    return projects;
}

std::vector<Project> ProjectsService::get_by_filters(
    const std::string& status, const std::string& knowledge_area) const {

    std::string where;
    pqxx::params p;
    int idx = 1;

    if (!status.empty()) {
        where += " WHERE status = $" + std::to_string(idx++);
        p.append(status);
    }
    if (!knowledge_area.empty()) {
        where += (where.empty() ? " WHERE " : " AND ");
        where += "knowledge_area = $" + std::to_string(idx++);
        p.append(knowledge_area);
    }

    pqxx::work txn(conn);
    auto r = txn.exec_params(
        std::string(SELECT_PROJECT) + where + " ORDER BY id", p);
    txn.commit();

    std::vector<Project> projects;
    for (const auto& row : r)
        projects.push_back(row_to_project(row));
    return projects;
}

Project ProjectsService::create(const crow::json::rvalue& body) {
    if (!body.has("name"))
        throw ValidationException("Campo obrigatório: name");

    pqxx::work txn(conn);
    auto result = txn.exec_params(
        "INSERT INTO projects "
        "(name, knowledge_area, institution, resume, description, status, "
        " initial_token_price, target_funding, founders_percentage, "
        " community_percentage, liquidity_percentage, reserved_percentage) "
        "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) "
        "RETURNING id, name, knowledge_area, institution, resume, description, "
        "status, initial_token_price, total_funding, target_funding, "
        "founders_percentage, community_percentage, liquidity_percentage, "
        "reserved_percentage, investors_count, roi_estimate, "
        "created_at::text, updated_at::text",
        std::string(std::string(body["name"].s())),
        body.has("knowledge_area")  ? std::string(std::string(body["knowledge_area"].s()))  : "",
        body.has("institution")     ? std::string(std::string(body["institution"].s()))     : "",
        body.has("resume")          ? std::string(std::string(body["resume"].s()))          : "",
        body.has("description")     ? std::string(std::string(body["description"].s()))     : "",
        body.has("status")          ? std::string(std::string(body["status"].s()))          : "open",
        body.has("initial_token_price")  ? body["initial_token_price"].d()     : 0.0,
        body.has("target_funding")       ? body["target_funding"].d()          : 0.0,
        body.has("founders_percentage")  ? body["founders_percentage"].d()     : 0.0,
        body.has("community_percentage") ? body["community_percentage"].d()    : 0.0,
        body.has("liquidity_percentage") ? body["liquidity_percentage"].d()    : 0.0,
        body.has("reserved_percentage")  ? body["reserved_percentage"].d()     : 0.0);
    txn.commit();
    return row_to_project(result[0]);
}

Project ProjectsService::update(const crow::json::rvalue& body, const std::string id) {
    std::string set_clause;
    pqxx::params p;
    int idx = 1;

    auto add_str = [&](const std::string& col, const std::string& val) {
        if (!set_clause.empty()) set_clause += ", ";
        set_clause += col + " = $" + std::to_string(idx++);
        p.append(val);
    };
    auto add_dbl = [&](const std::string& col, double val) {
        if (!set_clause.empty()) set_clause += ", ";
        set_clause += col + " = $" + std::to_string(idx++);
        p.append(val);
    };

    if (body.has("name"))                add_str("name",                 std::string(body["name"].s()));
    if (body.has("knowledge_area"))      add_str("knowledge_area",       std::string(body["knowledge_area"].s()));
    if (body.has("institution"))         add_str("institution",          std::string(body["institution"].s()));
    if (body.has("resume"))              add_str("resume",               std::string(body["resume"].s()));
    if (body.has("description"))         add_str("description",          std::string(body["description"].s()));
    if (body.has("status"))              add_str("status",               std::string(body["status"].s()));
    if (body.has("total_funding"))       add_dbl("total_funding",        body["total_funding"].d());
    if (body.has("target_funding"))      add_dbl("target_funding",       body["target_funding"].d());
    if (body.has("investors_count"))     add_dbl("investors_count",      static_cast<double>(body["investors_count"].i()));
    if (body.has("roi_estimate"))        add_dbl("roi_estimate",         body["roi_estimate"].d());
    if (body.has("initial_token_price")) add_dbl("initial_token_price",  body["initial_token_price"].d());

    if (set_clause.empty()) throw ValidationException("Nenhum campo para atualizar");

    set_clause += ", updated_at = NOW()";
    p.append(id);

    pqxx::work txn(conn);
    auto result = txn.exec_params(
        "UPDATE projects SET " + set_clause +
        " WHERE id = $" + std::to_string(idx) +
        " RETURNING id, name, knowledge_area, institution, resume, description, "
        "status, initial_token_price, total_funding, target_funding, "
        "founders_percentage, community_percentage, liquidity_percentage, "
        "reserved_percentage, investors_count, roi_estimate, "
        "created_at::text, updated_at::text",
        p);
    txn.commit();
    if (result.empty()) throw NotFoundException("Projeto não encontrado: " + id);
    return row_to_project(result[0]);
}

Project ProjectsService::destroy(const std::string id) {
    pqxx::work txn(conn);
    auto result = txn.exec_params(
        "DELETE FROM projects WHERE id = $1 "
        "RETURNING id, name, knowledge_area, institution, resume, description, "
        "status, initial_token_price, total_funding, target_funding, "
        "founders_percentage, community_percentage, liquidity_percentage, "
        "reserved_percentage, investors_count, roi_estimate, "
        "created_at::text, updated_at::text",
        id);
    txn.commit();
    if (result.empty()) throw NotFoundException("Projeto não encontrado: " + id);
    return row_to_project(result[0]);
}
