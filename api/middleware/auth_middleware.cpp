// Importing std libraries
#include <string>
#include <unordered_map>
#include <mutex>
#include <chrono>
#include <random>
#include <sstream>
#include <iomanip>

// Importing local libraries
#include "auth_middleware.hpp"
#include "crow.h"


std::string SessionStore::_random_token() {
    std::random_device rd;
    std::mt19937_64 gen(rd());
    std::uniform_int_distribution<uint64_t> dis;
    std::ostringstream oss;
    for (int i = 0; i < 4; ++i)
        oss << std::hex << std::setw(16) << std::setfill('0') << dis(gen);
    return oss.str();
}

std::string SessionStore::create_session(const std::string& user_id,
                                          const std::string& wallet_address) {
    std::lock_guard<std::mutex> lock(_mtx);
    std::string token = _random_token();
    _sessions[token] = {
        user_id,
        wallet_address,
        std::chrono::steady_clock::now() + std::chrono::hours(24)
    };
    return token;
}

std::optional<Session> SessionStore::get_session(const std::string& token) {
    std::lock_guard<std::mutex> lock(_mtx);
    auto it = _sessions.find(token);
    if (it == _sessions.end()) return std::nullopt;
    if (it->second.expires_at < std::chrono::steady_clock::now()) {
        _sessions.erase(it);
        return std::nullopt;
    }
    return it->second;
}

void SessionStore::revoke(const std::string& token) {
    std::lock_guard<std::mutex> lock(_mtx);
    _sessions.erase(token);
}
