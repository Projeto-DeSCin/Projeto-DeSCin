#ifndef WALLET_HPP
#define WALLET_HPP

#include <iostream>
#include <string>
#include "utils/encryptation/generate_key_pair.hpp"


class Wallet {

    private:
        KeyPair pair_key;
        std::string wallet_id;
        double wallet_balance;

    protected:
        void set_balance(double amount);

    public:
        Wallet(std::string wallet_id = "", double wallet_balance = 0);
        ~Wallet();

        // Getters of the wallet's key pair
        std::string get_public_key() const { return pair_key.public_key; }
        std::string get_private_key() const { return pair_key.private_key; }

        //
        std::string format_data(std::string sender, std::string receiver, unsigned long amount, long long ts) const;
        std::string sign_with_private_key(std::string message) const;

        std::string get_id() const;
        double get_balance() const;
        void receive(double amount);

        virtual void check_balance();
        virtual void change_balance(double amount);
};

class Buy : public Wallet {

    private:
        Wallet& destination;

    protected:
        void check_balance() override;
        void change_balance(double amount) override;

    public:
        Buy(Wallet& origin, Wallet& destination);
        ~Buy();
        void transaction_execute(double amount);
};

class Sell : public Wallet {

    private:
        Wallet& destination;

    protected:
        void check_balance() override;
        void change_balance(double amount) override;

    public:
        Sell(Wallet& origin, Wallet& destination);
        ~Sell();
        void transaction_execute(double amount);
};

#endif // WALLET_HPP
