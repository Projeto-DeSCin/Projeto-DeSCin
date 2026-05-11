#ifndef MODEL_HPP
#define MODEL_HPP

// Include libraries
#include <string>
#include <vector>
#include <cstdint>

// Base para todos os models
template <typename T>
struct Model {
    int         id;
    std::string created_at;
    std::string updated_at;
};

// Token balance de uma carteira
struct TokenBalance : Model<TokenBalance> {
    std::string symbol;
    long long   amount;
    long long   usd_value;
};

// Investimento em um projeto
struct Investment : Model<Investment> {
    std::string project_id;
    std::string project_name;
    long long   amount_invested;
    long long   current_value;
    std::string invested_at;
    std::string status; // "active" | "exited" | "pending"
};

// Usuários da Plataforma DeSCin
struct User : Model<User> {
    std::string username;
    std::string email;
    std::string password;
    std::vector<std::string> role_choice;
    std::string bio;
};

// Carteira do usuário
struct Wallet : Model<Wallet> {
    std::string                  address;
    unsigned long                balance;
    double                       balance_usd;
    std::vector<TokenBalance> tokens;
    std::vector<Investment>   investments;
};

// Projeto de investimento
struct Project : Model<Project> {
    std::string name;
    std::string knowledge_area;
    std::string institution;
    std::string resume;
    std::string description;
    std::string status; // "open" | "funded" | "closed"
    double      initial_token_price;
    double      total_funding;
    double      target_funding;
    double      founders_percentage;
    double      community_percentage;
    double      liquidity_percentage;
    double      reserved_percentage;
    unsigned long investors_count;
    double      roi_estimate;
};

// Transação
struct Transaction : Model<Transaction> {
    std::string   tx_hash;
    std::string   from;
    std::string   to;
    unsigned long amount;
    std::string   timestamp;
    std::string   status;
    long          block_sequence;
};


struct Refaund : Model<Refaund> {
    std::string project_id;
    std::string project_name;
    long long   amount_invested;
    long long   current_value;
    std::string invested_at;
    std::string status; // "active" | "exited" | "pending"
};



#endif // MODEL_HPP