// Importing util libs
#include "transaction.hpp"
#include "utils/date.hpp"
#include "utils/hash.hpp"
#include "utils/string_to_pbkey.hpp"
#include "utils/decode_signature.hpp"
#include "utils/openssl_utils.hpp"
// Importing std libs
#include <string>
// Importing ext libs
#include <nlohmann/json.hpp>
#include <openssl/evp.h>
#include <openssl/err.h>

// Constructor and destructor
Transaction::Transaction(std::string sender_key, std::string receiver_key, unsigned long amount, long long timestamp, std::string signature){
        body.sender_key = sender_key;
        body.receiver_key = receiver_key;
        body.amount = amount;
        body.timestamp = timestamp;
        body.signature = signature;
        // Calcula o hash das informações da transação e armazena no membro transaction_hash
        body.transaction_hash = calculate_hash();
}

// Transaction methods
std::string Transaction::calculate_hash(void) const {
    std::string data = body.sender_key + body.receiver_key + std::to_string(body.amount) + std::to_string(body.timestamp);
    return hash(data);
}

bool Transaction::is_transaction_valid(void) const {

    // Calcula os dados a serem verificados (sem o hash)
    std::string verifying_data = body.sender_key + body.receiver_key + std::to_string(body.amount) + std::to_string(body.timestamp);

    EVP_PKEY_Ptr pkey(string_to_pbkey(body.sender_key));
    std::vector<unsigned char> sigBytes = decode_signature(body.signature);
    if (!pkey) {
        return false;
    }

    // Creating a new context struct do tipo EVP_MD_CTX
    EvpContextPtr context(EVP_MD_CTX_new());

    if (!context) { // Error case
        return false;
    }

    if (EVP_DigestVerifyInit(context.get(), nullptr, EVP_sha256(), nullptr, pkey.get()) <= 0) {
        return false;
    }

    if (EVP_DigestVerifyUpdate(context.get(), verifying_data.c_str(), verifying_data.size()) <= 0) {
        return false;
    }

    int result = EVP_DigestVerifyFinal(context.get(), sigBytes.data(), sigBytes.size());

    return result == 1;
}
