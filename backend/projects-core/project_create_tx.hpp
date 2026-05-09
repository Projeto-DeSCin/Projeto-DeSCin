#ifndef PROJECT_CREATE_TX_HPP
#define PROJECT_CREATE_TX_HPP

#include "../blockchain-core/src/transaction.hpp"
#include "project_state.hpp"

class ProjectCreateTx : public Transaction {
    private:
        ProjectsBody project;
    public:
        ProjectCreateTx(std::string sender_key, std::string receiver_key, unsigned long amount, long long timestamp, std::string signature, ProjectsBody project);
        ProjectsBody get_project() const { return project; }
};

#endif // PROJECT_CREATE_TX_HPP
