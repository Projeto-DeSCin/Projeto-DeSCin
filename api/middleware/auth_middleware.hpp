#ifndef AUTH_MIDDLEWARE_HPP
#define AUTH_MIDDLEWARE_HPP

// Importing std libraries
#include <string>
#include <unordered_map>
#include <mutex>
#include <chrono>
#include <random>
#include <sstream>
#include <iomanip>

// Importing Crow library
#include "crow.h"

struct Session {
    std::string user_id;
    std::string wallet_address;
    std::chrono::steady_clock::time_point expires_at;
};

class SessionStore {
private:
    std::unordered_map<std::string, Session> _sessions;
    std::mutex _mtx;

    std::string _random_token();

public:
    static inline SessionStore& instance() {
        static SessionStore s;
        return s;
    }

    std::string create_session(const std::string& user_id,
                                const std::string& wallet_address);
    std::optional<Session> get_session(const std::string& token);
    void revoke(const std::string& token);

};

//  Middleware de autenticação
struct AuthMiddleware : crow::ILocalMiddleware {
    struct context {
        std::string user_id;
        std::string wallet_address;
        bool        authenticated = false;
    };

    void before_handle(crow::request& req, crow::response& res, context& ctx) {
        // Rotas públicas não precisam de autenticação
        static const std::vector<std::string> public_paths = {
            "/api/health",
            "/api/auth/register",
            "/api/auth/login",
            "/api/projects"
        };

        for (auto& p : public_paths) {
            if (req.url == p) {
                ctx.authenticated = true;
                return;
            }
        }

        // Extrai token do header Authorization: Bearer <token>
        auto auth_header = req.get_header_value("Authorization");
        if (auth_header.empty() || auth_header.substr(0, 7) != "Bearer ") {
            res.code = 401;
            crow::json::wvalue body;
            body["error"] = "Token de autenticação ausente";
            res.body = body.dump();
            res.end();
            return;
        }

        std::string token = auth_header.substr(7);
        auto session = SessionStore::instance().get_session(token);
        if (!session) {
            res.code = 401;
            crow::json::wvalue body;
            body["error"] = "Token inválido ou expirado";
            res.body = body.dump();
            res.end();
            return;
        }

        ctx.user_id        = session->user_id;
        ctx.wallet_address = session->wallet_address;
        ctx.authenticated  = true;
    }

    void after_handle(crow::request&, crow::response&, context&) {}
};

#endif // AUTH_MIDDLEWARE_HPP
