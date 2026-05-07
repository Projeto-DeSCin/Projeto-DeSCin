#ifndef PROJECT_CREATE_TX_HPP
#define PROJECT_CREATE_TX_HPP

// Include the base Transaction class
#include "../blockchain-core/src/transaction.hpp"
// Include project model
#include "project_state.hpp"

class ProjectCreateTx : public Transaction {
    private:
        // Instanciando um projeto
        Project project;
    public:
    ProjectCreateTx(std::string sender_key, std::string receiver_key, unsigned long amount, long long timestamp, std::string signature, Project project);
    
};

#endif // PROJECT_CREATE_HPP
