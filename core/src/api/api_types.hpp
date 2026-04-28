#ifndef API_TYPES_HPP
#define API_TYPES_HPP

#include <string>
#include <vector>

struct ApiTokenBalance {
    std::string symbol;
    long long      amount;
    long long      usd_value;
};

struct ApiInvestment {
    std::string project_id;
    std::string project_name;
    long long      amount_invested;
    long long      current_value;
    std::string invested_at;
    std::string status;   // "active" | "exited" | "pending"
};

struct ApiWallet {
    std::string                  address;
    unsigned long                balance;
    double                       balance_usd;
    std::vector<ApiTokenBalance> tokens;
    std::vector<ApiInvestment>   investments;
    std::string                  created_at;
};

struct ApiTx {
    std::string   tx_hash;
    std::string   from;
    std::string   to;
    unsigned long amount;
    std::string   timestamp;
    std::string   status;
    long          block_sequence;
};

struct ApiProject {
    std::string project_id;
    std::string name;
    std::string description;
    std::string category;
    double      total_funding;
    double      target_funding;
    uint32_t    investors_count;
    std::string status;        // "open" | "funded" | "closed"
    std::string created_at;
    double      roi_estimate;
};

#endif // API_TYPES_HPP
