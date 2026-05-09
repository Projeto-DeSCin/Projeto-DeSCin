#include "refund_tx.hpp"

RefundTx::RefundTx(
    std::string sender_key,
    std::string receiver_key,
    unsigned long amount,
    long long timestamp,
    std::string signature,
    std::string project_id,
    std::string investor_address
) : Transaction(sender_key, receiver_key, amount, timestamp, signature),
    project_id(project_id),
    investor_address(investor_address),
    refund_amount(amount) {}
