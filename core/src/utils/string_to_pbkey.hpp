#ifndef STRING_TO_PUBKEY_HPP
#define STRING_TO_PUBKEY_HPP

#include <openssl/evp.h>
#include <string>

EVP_PKEY* string_to_pbkey(const std::string& key_str);

#endif // STRING_TO_PUBKEY_HPP
