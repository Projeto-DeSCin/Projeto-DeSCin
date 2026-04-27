#ifndef TRANSACTION_HPP
#define TRANSACTION_HPP

#include <string>    // Declaring a struct  with a polymofic overload operator
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
using EVP_PKEYPtr = std::unique_ptr<EVP_PKEY, EVP_PKEY_Deleter>;

class Transaction{
    private:
    std::string sender_key{};
    std::string receiver_key{};
    unsigned long amount{};
    long long timestamp{};
    std::string signature{};
    std::string transaction_hash{};

    public:
    // Constructor and Destructor
    Transaction(std::string sender_key, std::string receiver_key, long amount, long long timestamp, std::string signature);
    ~Transaction();

    // Transaction methods
    std::string calculate_hash(void) const;
    bool is_transaction_valid(void) const;

    // Getters
    unsigned long get_amount(void) const { return amount; }
    std::string get_hash(void) const { return transaction_hash; }
    std::string get_sender(void) const { return sender_key; }

}

#endif // TRANSACTION_HPP
