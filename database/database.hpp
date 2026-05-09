#pragma once
// Só vai incluir o header na unidade de compilação uma vez


#include <string>
#include <vector>
#include <cstdint>

namespace descin::db {

    constexpr int KEY_SIZE = 32; // 32 bytes para AES-256
    constexpr int IV_SIZE = 16;  // 16 bytes para o vetor de inicial
    constexpr int SALT_SIZE = 16; // 16 bytes para o salt

    struct EncryptedBlock {
        std::string user_id;
        std::vector<unsigned char> salt;
        std::vector<unsigned char> iv;
        std::vector<unsigned char> data;
    };

void derive_key(const std::string& password, const unsigned char* salt, unsigned char* final_key);

std::vector<unsigned char> encrypt(const std::string& text, const unsigned char* key, const unsigned char* iv);


std::vector<unsigned char> decrypt(const std::vector<unsigned char>& ciphered_data, const unsigned char* key, const unsigned char* iv);

bool append_block(const std::string& path, const std::string& user_id, const unsigned char* salt, const unsigned char* iv, const std::vector<unsigned char>& ciphered_data);

std::vector<EncryptedBlock> read_all_blocks(const std::string& path);


}