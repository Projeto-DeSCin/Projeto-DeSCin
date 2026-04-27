#ifndef WALLET_HPP
#define WALLET_HPP

#include <iostream>
#include <string>

class Wallet {

    private:
        std::string wallet_id;
        double wallet_balance;

    protected:
        void set_balance(double amount);

    public:
        Wallet(std::string wallet_id = "", double wallet_balance = 0);
        ~Wallet();

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