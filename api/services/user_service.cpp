#include "user_service.hpp"
#include "../models/model.hpp"
#include "../exceptions/exceptions.hpp"
#include "../utils/password.hpp"

#include <optional>
#include <vector>
#include <sstream>

namespace {
    std::vector<std::string> parse_pg_array(const std::string& s) {
        std::vector<std::string> result;
        if (s.size() < 2 || s.front() != '{' || s.back() != '}') return result;
        std::string content = s.substr(1, s.size() - 2);
        if (content.empty()) return result;
        std::istringstream ss(content);
        std::string item;
        while (std::getline(ss, item, ','))
            result.push_back(item);
        return result;
    }

    User row_to_user(const pqxx::row& row) {
        User u;
        u.id          = row[0].as<int>();
        u.username    = row[1].as<std::string>();
        u.email       = row[2].as<std::string>();
        u.password    = row[3].as<std::string>();
        u.role_choice = parse_pg_array(row[4].as<std::string>());
        u.bio         = row[5].is_null() ? "" : row[5].as<std::string>();
        u.created_at  = row[6].as<std::string>();
        u.updated_at  = row[7].as<std::string>();
        return u;
    }

    const char* SELECT_USER =
        "SELECT id, username, email, password, roles::text, bio, "
        "created_at::text, updated_at::text FROM users";
}

std::optional<User> UserService::get_by_id(const std::string id) const {
    pqxx::work txn(conn);
    auto r = txn.exec_params(
        std::string(SELECT_USER) + " WHERE id = $1", id);
    txn.commit();
    if (r.empty()) throw NotFoundException("Usuário não encontrado: " + id);
    return row_to_user(r[0]);
}

std::optional<User> UserService::get_by_email(const std::string email) const {
    pqxx::work txn(conn);
    auto r = txn.exec_params(
        std::string(SELECT_USER) + " WHERE email = $1", email);
    txn.commit();
    if (r.empty()) return std::nullopt;
    return row_to_user(r[0]);
}

std::vector<User> UserService::get_all() const {
    pqxx::work txn(conn);
    auto r = txn.exec(std::string(SELECT_USER) + " ORDER BY id");
    txn.commit();
    std::vector<User> users;
    for (const auto& row : r)
        users.push_back(row_to_user(row));
    return users;
}

User UserService::create(const crow::json::rvalue& body) {
    if (!body.has("username") || !body.has("email") || !body.has("password"))
        throw ValidationException("Campos obrigatórios: username, email, password");

    std::string username = std::string(body["username"].s());
    std::string email    = std::string(body["email"].s());
    std::string hashed   = password::hash(std::string(body["password"].s()));
    std::string bio      = body.has("bio") ? std::string(std::string(body["bio"].s())) : "";

    std::string roles = "{}";
    if (body.has("roles")) {
        std::string r = "{";
        for (size_t i = 0; i < body["roles"].size(); i++) {
            if (i) r += ",";
            r += std::string(body["roles"][i].s());
        }
        r += "}";
        roles = r;
    }

    pqxx::work txn(conn);
    auto result = txn.exec_params(
        "INSERT INTO users (username, email, password, roles, bio) "
        "VALUES ($1, $2, $3, $4::text[], $5) "
        "RETURNING id, username, email, password, roles::text, bio, "
        "created_at::text, updated_at::text",
        username, email, hashed, roles, bio);
    txn.commit();
    return row_to_user(result[0]);
}

User UserService::update(const crow::json::rvalue& body, const std::string id) {
    std::string set_clause;
    pqxx::params p;
    int idx = 1;

    auto add_str = [&](const std::string& col, const std::string& val) {
        if (!set_clause.empty()) set_clause += ", ";
        set_clause += col + " = $" + std::to_string(idx++);
        p.append(val);
    };

    if (body.has("username")) add_str("username", std::string(body["username"].s()));
    if (body.has("email"))    add_str("email",    std::string(body["email"].s()));
    if (body.has("bio"))      add_str("bio",      std::string(body["bio"].s()));
    if (body.has("password")) add_str("password", password::hash(std::string(body["password"].s())));

    if (set_clause.empty()) throw ValidationException("Nenhum campo para atualizar");

    set_clause += ", updated_at = NOW()";
    p.append(id);

    std::string query =
        "UPDATE users SET " + set_clause +
        " WHERE id = $" + std::to_string(idx) +
        " RETURNING id, username, email, password, roles::text, bio, "
        "created_at::text, updated_at::text";

    pqxx::work txn(conn);
    auto result = txn.exec_params(query, p);
    txn.commit();
    if (result.empty()) throw NotFoundException("Usuário não encontrado: " + id);
    return row_to_user(result[0]);
}

User UserService::destroy(const std::string id) {
    pqxx::work txn(conn);
    auto result = txn.exec_params(
        "DELETE FROM users WHERE id = $1 "
        "RETURNING id, username, email, password, roles::text, bio, "
        "created_at::text, updated_at::text",
        id);
    txn.commit();
    if (result.empty()) throw NotFoundException("Usuário não encontrado: " + id);
    return row_to_user(result[0]);
}
