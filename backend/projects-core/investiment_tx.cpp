#include "investiment_tx.hpp"

InvestimentTx::InvestimentTx(
    std::string sender_key,
    std::string receiver_key,
    unsigned long amount,
    long long timestamp,
    std::string signature,
    std::string project_id
) : Transaction(sender_key, receiver_key, amount, timestamp, signature),
    project_id(project_id),
    amount_invested(amount) {}
