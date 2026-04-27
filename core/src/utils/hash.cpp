// Importing std libraries
#include <string>
#include <iostream>
#include <sstream>
#include <iomanip>
#include <stdexcept>
// Importing utils
#include "hash.hpp"
#include "openssl_utils.hpp"
// Importing openssl libraries
#include <openssl/conf.h>
#include <openssl/evp.h>
#include <openssl/err.h>

std::string hash (const std::string& data) {

    // Creating a new context struct do tipo EVP_MD_CTX
    EvpContextPtr context(EVP_MD_CTX_new());

    if (!context) { // Error case
        throw std::runtime_error("Falha ao criar o contexto EVP_MD_CTX");
    }

    // Iniciando digest do context e definindo tipo de criptografia sha256
    if (EVP_DigestInit_ex(context.get(), EVP_sha256(), nullptr) != 1) {
        throw std::runtime_error("Falha ao inicializar o Digest");
    }

    //  Realizando hashing
    if (EVP_DigestUpdate(context.get(), data.c_str(), data.length()) != 1) {
        throw std::runtime_error("Falha ao atualizar o Digest");
    }

    // Create a array para guardar o hashing
    unsigned char has_res_arr[EVP_MAX_MD_SIZE];
    unsigned int hash_length = 0;

    // Finalizando digest retornando todas as infos de content e length do hash
    if (EVP_DigestFinal_ex(context.get(), has_res_arr, &hash_length) != 1) {
        throw std::runtime_error("Falha ao finalizar o Digest");
    }

    // Passando o hash para string
    std::stringstream ss;
    for (unsigned int i = 0; i < hash_length; ++i) {
        ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(has_res_arr[i]);
    }

    return ss.str();

}
