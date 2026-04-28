// Importing hpp lirabry
#include "wallet.hpp"

// Importing utils library
#include "utils/encryptation/generate_key_pair.hpp"
#include "utils/encryptation/sign_message.hpp"

// Importing std libraries
#include <iostream>
#include <string>

// Wallet
Wallet::Wallet(std::string wallet_id, unsigned long wallet_balance)
    : wallet_id(wallet_id), wallet_balance(wallet_balance) {
        // Generate pair key
        pair_key = generate_key_pair();
    }

Wallet::~Wallet() {}

// Merge data to sign
std::string Wallet::format_data(std::string sender, std::string receiver, unsigned long amount, long long ts) const {
    return sender + receiver + std::to_string(amount) + std::to_string(ts);
}
//
std::string Wallet::sign_with_private_key(std::string message) const {
    return sign_message(pair_key.private_key, message);
}

std::string Wallet::get_id() const {
    return wallet_id;
}

double Wallet::get_balance() const {
    return wallet_balance;
}

void Wallet::set_balance(double amount) {
    wallet_balance = amount;
}

void Wallet::receive(double amount) {
    set_balance(get_balance() + amount);
}

void Wallet::check_balance() {}

void Wallet::change_balance(double amount) {}
