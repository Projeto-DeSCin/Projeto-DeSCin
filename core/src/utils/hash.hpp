/*
 * Hshing function
 */
#ifndef HASH_HPP
#define HASH_HPP

#include <string>
#include <memory>
#include <openssl/conf.h>
#include <openssl/evp.h>
#include <openssl/err.h>

// Declaring a struct  with a polymofic overload operator
struct EVP_MD_CTX_Deleter {
    // That function receive a pointer to EVP_MD_CTX struct
    void operator()(EVP_MD_CTX* ctx) const {
        EVP_MD_CTX_free(ctx);
    }
};

// Criando o tipo ponteiro de contexto evp e passando as EVP_MD_CTX e
// EVP_MD_CTX_Deleter (parâmetro opcial para destruir esse ponteiro) para criar
using EvpContextPtr = std::unique_ptr<EVP_MD_CTX, EVP_MD_CTX_Deleter>;

/*
 *  The hash function for the blockchain
 */
std::string hash(const std::string& data);


#endif // HASH_HPP
