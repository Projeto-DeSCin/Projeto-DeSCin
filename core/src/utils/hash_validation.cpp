#include "hash_validation.hpp"
#include <string>

bool hash_validation(const std::string& hash, int difficulty, const char& prefix) {

    std::string expectedHash = std::string(difficulty, prefix);
    return expectedHash == hash.substr(0, expectedHash.size());
}
