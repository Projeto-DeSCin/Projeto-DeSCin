#ifndef SIGN_MESSAGE_HPP
#define SIGN_MESSAGE_HPP

#include <openssl/evp.h>
#include <openssl/pem.h>
#include <vector>
#include <iomanip>
#include <sstream>

inline std::string sign_message(const std::string& privateKeyPEM, const std::string& message) {

    BIO* bio = BIO_new_mem_buf(privateKeyPEM.c_str(), -1);
    EVP_PKEY* evpKey = PEM_read_bio_PrivateKey(bio, NULL, NULL, NULL);
    BIO_free(bio);

    EVP_MD_CTX* ctx = EVP_MD_CTX_new();
    EVP_DigestSignInit(ctx, NULL, EVP_sha256(), NULL, evpKey);
    EVP_DigestSignUpdate(ctx, message.c_str(), message.length());

    size_t sigLen;
    EVP_DigestSignFinal(ctx, NULL, &sigLen);
    std::vector<unsigned char> sig(sigLen);
    EVP_DigestSignFinal(ctx, sig.data(), &sigLen);

    EVP_MD_CTX_free(ctx);
    EVP_PKEY_free(evpKey);

    std::stringstream ss;
    for(unsigned char b : sig) ss << std::hex << std::setw(2) << std::setfill('0') << (int)b;
    return ss.str();
}

#endif // SIGN_MESSAGE_HPP
