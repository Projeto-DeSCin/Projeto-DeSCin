#ifndef OPENSSL_UTILS_HPP
#define OPENSSL_UTILS_HPP

#include <memory>
#include <openssl/evp.h>

struct EVP_MD_CTX_Deleter {
    // That function receive a pointer to EVP_MD_CTX struct
    void operator()(EVP_MD_CTX* ctx) const {
        EVP_MD_CTX_free(ctx);
    }
};

struct EVP_PKEY_Deleter {
    void operator()(EVP_PKEY* pkey) const {
        EVP_PKEY_free(pkey);
    }
};

using EvpContextPtr = std::unique_ptr<EVP_MD_CTX, EVP_MD_CTX_Deleter>;
using EVP_PKEY_Ptr = std::unique_ptr<EVP_PKEY, EVP_PKEY_Deleter>;

#endif // OPENSSL_UTILS_HPP
