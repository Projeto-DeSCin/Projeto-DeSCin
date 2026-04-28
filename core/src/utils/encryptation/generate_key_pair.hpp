#ifndef GENERATE_KEY_PAIR_HPP
#define GENERATE_KEY_PAIR_HPP

// Importing utils hpp
#include "../openssl_utils.hpp"
// Importing std libraries
#include <string>
// Importing openssal libraries
#include <openssl/rsa.h>
#include <openssl/pem.h>

struct KeyPair {
    std::string public_key;
    std::string private_key;
};

inline KeyPair generate_key_pair() {
    // Instantiate the context and set RSA keygen parameters
    EVP_PKEY_CTX_Ptr ctx(EVP_PKEY_CTX_new_id(EVP_PKEY_RSA, NULL));
    EVP_PKEY_keygen_init(ctx.get());
    EVP_PKEY_CTX_set_rsa_keygen_bits(ctx.get(), 2048);

    // Generating pair key
    EVP_PKEY *pkey = nullptr;
    EVP_PKEY_Ptr pkeyPtr(pkey);
    EVP_PKEY_keygen(ctx.get(), &pkey);

    // Extrair Chave Privada em formato PEM
    BIO *pri = BIO_new(BIO_s_mem());
    PEM_write_bio_PrivateKey(pri, pkey, NULL, NULL, 0, NULL, NULL);
    char *pri_data;
    long pri_len = BIO_get_mem_data(pri, &pri_data);
    std::string pri_str(pri_data, pri_len);

    // Extrair Chave Pública em formato PEM
    BIO *pub = BIO_new(BIO_s_mem());
    PEM_write_bio_PUBKEY(pub, pkey);
    char *pub_data;
    long pub_len = BIO_get_mem_data(pub, &pub_data);
    std::string pub_str(pub_data, pub_len);

    BIO_free(pri);
    BIO_free(pub);

    return {pub_str, pri_str};
}

#endif // GENERATE_KEY_PAIR_HPP
