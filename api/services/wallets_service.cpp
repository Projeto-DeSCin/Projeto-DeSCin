#include "wallets_service.hpp"
#include "../models/model.hpp"
#include "../exceptions/exceptions.hpp"

#include <optional>
#include <vector>

namespace {
    Wallet row_to_wallet(const pqxx::row& row) {
        Wallet w;
        w.id          = row[0].as<int>();
        w.user_id     = row[1].as<int>();
        w.address     = row[2].as<std::string>();
        w.balance     = row[3].as<unsigned long>();
        w.balance_usd = row[4].as<double>();
        w.created_at  = row[5].as<std::string>();
        w.updated_at  = row[6].as<std::string>();
        return w;
    }
}

std::optional<Wallet> WalletsService::get_by_id(const std::string id) const {
    pqxx::work txn(conn);

    auto wr = txn.exec_params(
        "SELECT id, user_id, address, balance, balance_usd, "
        "created_at::text, updated_at::text FROM wallets WHERE id = $1", id);

    if (wr.empty()) {
        txn.commit();
        throw NotFoundException("Carteira não encontrada: " + id);
    }

    Wallet w = row_to_wallet(wr[0]);

    auto tr = txn.exec_params(
        "SELECT id, symbol, amount, usd_value, "
        "created_at::text, updated_at::text FROM tokens WHERE wallet_id = $1",
        w.id);
    for (const auto& row : tr) {
        TokenBalance tb;
        tb.id         = row[0].as<int>();
        tb.symbol     = row[1].as<std::string>();
        tb.amount     = row[2].as<long long>();
        tb.usd_value  = row[3].as<long long>();
        tb.created_at = row[4].as<std::string>();
        tb.updated_at = row[5].as<std::string>();
        w.tokens.push_back(tb);
    }

    auto ir = txn.exec_params(
        "SELECT id, project_id::text, project_name, amount_invested, "
        "current_value, invested_at::text, status, "
        "created_at::text, updated_at::text FROM investments WHERE wallet_id = $1",
        w.id);
    for (const auto& row : ir) {
        Investment inv;
        inv.id              = row[0].as<int>();
        inv.project_id      = row[1].as<std::string>();
        inv.project_name    = row[2].is_null() ? "" : row[2].as<std::string>();
        inv.amount_invested = row[3].as<long long>();
        inv.current_value   = row[4].as<long long>();
        inv.invested_at     = row[5].as<std::string>();
        inv.status          = row[6].as<std::string>();
        inv.created_at      = row[7].as<std::string>();
        inv.updated_at      = row[8].as<std::string>();
        w.investments.push_back(inv);
    }

    txn.commit();
    return w;
}

std::vector<Wallet> WalletsService::get_all() const {
    pqxx::work txn(conn);
    auto r = txn.exec(
        "SELECT id, user_id, address, balance, balance_usd, "
        "created_at::text, updated_at::text FROM wallets ORDER BY id");
    txn.commit();
    std::vector<Wallet> wallets;
    for (const auto& row : r)
        wallets.push_back(row_to_wallet(row));
    return wallets;
}

Wallet WalletsService::create(const crow::json::rvalue& body) {
    if (!body.has("address") || !body.has("user_id"))
        throw ValidationException("Campos obrigatórios: address, user_id");

    pqxx::work txn(conn);
    auto result = txn.exec_params(
        "INSERT INTO wallets (address, user_id, balance, balance_usd) "
        "VALUES ($1, $2, $3, $4) "
        "RETURNING id, user_id, address, balance, balance_usd, "
        "created_at::text, updated_at::text",
        std::string(body["address"].s()),
        static_cast<int>(body["user_id"].i()),
        body.has("balance")     ? static_cast<long long>(body["balance"].i())     : 0LL,
        body.has("balance_usd") ? body["balance_usd"].d()                         : 0.0);
    txn.commit();
    return row_to_wallet(result[0]);
}

Wallet WalletsService::update(const crow::json::rvalue& body, const std::string id) {
    std::string set_clause;
    pqxx::params p;
    int idx = 1;

    auto add_dbl = [&](const std::string& col, double val) {
        if (!set_clause.empty()) set_clause += ", ";
        set_clause += col + " = $" + std::to_string(idx++);
        p.append(val);
    };

    if (body.has("balance"))
        add_dbl("balance",     static_cast<double>(body["balance"].i()));
    if (body.has("balance_usd"))
        add_dbl("balance_usd", body["balance_usd"].d());

    if (set_clause.empty()) throw ValidationException("Nenhum campo para atualizar");

    set_clause += ", updated_at = NOW()";
    p.append(id);

    pqxx::work txn(conn);
    auto result = txn.exec_params(
        "UPDATE wallets SET " + set_clause +
        " WHERE id = $" + std::to_string(idx) +
        " RETURNING id, user_id, address, balance, balance_usd, "
        "created_at::text, updated_at::text",
        p);
    txn.commit();
    if (result.empty()) throw NotFoundException("Carteira não encontrada: " + id);
    return row_to_wallet(result[0]);
}

Wallet WalletsService::destroy(const std::string id) {
    pqxx::work txn(conn);
    auto result = txn.exec_params(
        "DELETE FROM wallets WHERE id = $1 "
        "RETURNING id, user_id, address, balance, balance_usd, "
        "created_at::text, updated_at::text",
        id);
    txn.commit();
    if (result.empty()) throw NotFoundException("Carteira não encontrada: " + id);
    return row_to_wallet(result[0]);
}
