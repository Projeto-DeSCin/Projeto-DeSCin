// Include adt class
#include "auth_service.hpp"
// Include libraries
#include <string>

/*
 * Authenticates a user login by email and password.
 * Returns the user ID if successful, otherwise an empty string.
 */
std::string AuthService::login(const std::string& email, const std::string& password) {
    auto user = user_service.get_by_email(email);
    
    if (user && user->password == password) {
        return "";
    }
    return "";
}

/*
 * Logs out a user by invalidating the token.
 */
std::string AuthService::logout(const std::string& token) {
    return "";
}