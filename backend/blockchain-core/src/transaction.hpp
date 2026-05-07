#ifndef TRANSACTION_HPP
#define TRANSACTION_HPP

// Importing std libraries
#include <string>
#include <vector>
#include <memory>
// Importing nlohmann/json for JSON serialization
#include <nlohmann/json.hpp>

struct  TransactionBody {
    std::string sender_key;
    std::string receiver_key;
    unsigned long amount;
    long long timestamp;
    std::string signature;
    std::string transaction_hash;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(TransactionBody, sender_key, receiver_key, amount, timestamp, signature, transaction_hash)

class Transaction{
    private:
    TransactionBody body;

    public:
    // Constructor and Destructor
    Transaction() = default;
    Transaction(std::string sender_key, std::string receiver_key, unsigned long amount, long long timestamp, std::string signature);
    ~Transaction() = default;

    NLOHMANN_DEFINE_TYPE_INTRUSIVE(Transaction, body)

    // Transaction methods
    std::string calculate_hash(void) const;
    bool is_transaction_valid(void) const;

    // Getters
    TransactionBody get_body(void) const { return body; }
    unsigned long get_amount(void) const { return body.amount; }
    std::string get_hash(void) const { return body.transaction_hash; }

    // P2P getter keys
    std::string get_sender(void) const { return body.sender_key; }
    std::string get_receiver(void) const { return body.receiver_key; }


};

#endif // TRANSACTION_HPP
