#include "project_create_tx.hpp"

ProjectCreateTx::ProjectCreateTx(
    std::string sender_key,
    std::string receiver_key,
    unsigned long amount,
    long long timestamp,
    std::string signature,
    ProjectsBody project
) : Transaction(sender_key, receiver_key, amount, timestamp, signature), project(project) {}
