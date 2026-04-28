#ifndef WALLET_HPP
#define WALLET_HPP

// Importing std libraries
#include <iostream>
#include <string>

// Importing utils libraries
#include "utils/encryptation/generate_key_pair.hpp"

class Wallet {

    private:
        KeyPair pair_key;
        std::string wallet_id;
        double wallet_balance;

    protected:
        void set_balance(double amount);

    public:
        Wallet(std::string wallet_id = "", unsigned long wallet_balance = 0);
        ~Wallet();

        // Getters of the wallet's key pair
        std::string get_public_key() const { return pair_key.public_key; }
        std::string get_private_key() const { return pair_key.private_key; }

        // Encryption
        std::string format_data(std::string sender, std::string receiver, unsigned long amount, long long ts) const;
        std::string sign_with_private_key(std::string message) const;

        std::string get_id() const;
        double get_balance() const;
        void receive(double amount);

        virtual void check_balance();
        virtual void change_balance(double amount);
};

#endif // WALLET_HPP
