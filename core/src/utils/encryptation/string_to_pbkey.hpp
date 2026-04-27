#ifndef STRING_TO_PUBKEY_HPP
#define STRING_TO_PUBKEY_HPP

#include <openssl/evp.h>
#include <openssl/pem.h>
#include <string>

inline EVP_PKEY* string_to_pbkey(const std::string& key_str) {
    BIO* bio = BIO_new_mem_buf(key_str.data(), -1);

    if (bio == nullptr) {
        return nullptr;
    }

    EVP_PKEY* pubKey = PEM_read_bio_PUBKEY(bio, nullptr, nullptr, nullptr);
    BIO_free(bio);

    return pubKey;
};

#endif // STRING_TO_PUBKEY_HPP
