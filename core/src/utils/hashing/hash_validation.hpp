#ifndef HASH_VALIDATION_HPP
#define HASH_VALIDATION_HPP

#include <string>

inline bool hash_validation(const std::string& hash, int difficulty, const char& prefix){
    std::string expectedHash = std::string(difficulty, prefix);
    return expectedHash == hash.substr(0, expectedHash.size());
};

#endif // HASH_VALIDATION_HPP
