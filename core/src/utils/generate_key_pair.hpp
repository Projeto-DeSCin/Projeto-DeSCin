#ifndef GENERATE_KEY_PAIR_HPP
#define GENERATE_KEY_PAIR_HPP

#include <string>
#include <openssl/rsa.h>
#include <openssl/pem.h>
#include "openssl_utils.hpp"


struct KeyPair {
    std::string publicKey;
    std::string privateKey;
};

inline KeyPair generate_key_pair() {
    EVP_PKEY_CTX *ctx = EVP_PKEY_CTX_new_id(EVP_PKEY_RSA, NULL);
    EVP_PKEY_keygen_init(ctx);
    EVP_PKEY_CTX_set_rsa_keygen_bits(ctx, 2048);

    EVP_PKEY *pkey = NULL;
    EVP_PKEY_keygen(ctx, &pkey);
    EVP_PKEY_Ptr pkeyPtr(pkey);
    EVP_PKEY_CTX_free(ctx);

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
