#ifndef REFUND_TX_HPP
#define REFUND_TX_HPP

#include "../blockchain-core/src/transaction.hpp"
#include "project_state.hpp"

class RefundTx : public Transaction {
    private:
        std::string project_id;
        std::string investor_address;
        unsigned long refund_amount;
    public:
        RefundTx(std::string sender_key, std::string receiver_key, unsigned long amount, long long timestamp, std::string signature, std::string project_id, std::string investor_address);
        std::string get_project_id() const { return project_id; }
        std::string get_investor_address() const { return investor_address; }
        unsigned long get_refund_amount() const { return refund_amount; }
};

#endif // REFUND_TX_HPP
