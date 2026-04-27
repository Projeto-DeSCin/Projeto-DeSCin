#include "string_to_pbkey.hpp"
#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/bio.h>
#include <string>

EVP_PKEY* string_to_pbkey(const std::string& key_str) {

    BIO* bio = BIO_new_mem_buf(key_str.data(), -1);

    if (bio == nullptr) {
        return nullptr;
    }

    EVP_PKEY* pubKey = PEM_read_bio_PUBKEY(bio, nullptr, nullptr, nullptr);

    BIO_free(bio);

    return pubKey;
}
