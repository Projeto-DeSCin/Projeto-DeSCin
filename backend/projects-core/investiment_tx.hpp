#ifndef INVESTIMENT_TX_HPP
#define INVESTIMENT_TX_HPP

#include "../blockchain-core/src/transaction.hpp"
#include "project_state.hpp"

class InvestimentTx : public Transaction {
    private:
        std::string project_id;
        unsigned long amount_invested;
    public:
        InvestimentTx(std::string sender_key, std::string receiver_key, unsigned long amount, long long timestamp, std::string signature, std::string project_id);
        std::string get_project_id() const { return project_id; }
        unsigned long get_amount_invested() const { return amount_invested; }
};

#endif // INVESTIMENT_TX_HPP
