#include "descin_node.hpp"
#include <string>
#include <iostream>
#include "../backend/blockchain-core/src/utils/date.hpp"

DescinNode::DescinNode(int diff) : blockchain(diff) {}

bool DescinNode::create_project(const std::string& sender, ProjectsBody project, const std::string& signature) {
    std::lock_guard<std::mutex> lock(node_mutex);
    try {
        ProjectCreateTx tx(sender, project.project_id, 0, date(), signature, project);
        if (!mempool.add_transaction(tx)) return false;
        auto pending     = mempool.get_pending_transactions();
        auto new_block   = blockchain.create_block(pending);
        auto mined_block = blockchain.mining_block(new_block);
        if (blockchain.send_block(mined_block)) {
            mempool.clear_pending_transactions(pending.size());
            project_repo.add_project(project);
            return true;
        }
    } catch (const std::exception& e) {
        std::cout << "Error create_project: " << e.what() << std::endl;
        return false;
    }
    return false;
}

bool DescinNode::process_investment(const std::string& sender, const std::string& project_id, unsigned long amount, const std::string& signature) {
    std::lock_guard<std::mutex> lock(node_mutex);
    try {
        if (!project_repo.is_project_active(project_id)) return false;
        InvestimentTx tx(sender, project_id, amount, date(), signature, project_id);
        if (!mempool.add_transaction(tx)) return false;
        auto pending     = mempool.get_pending_transactions();
        auto new_block   = blockchain.create_block(pending);
        auto mined_block = blockchain.mining_block(new_block);
        if (blockchain.send_block(mined_block)) {
            mempool.clear_pending_transactions(pending.size());
            std::string name = project_repo.project_name(project_id);
            InvestimentBody inv = {project_id, name, amount, amount, date(), "active"};
            project_repo.update_funding(sender, inv);
            return true;
        }
    } catch (const std::exception& e) {
        std::cout << "Error process_investment: " << e.what() << std::endl;
        return false;
    }
    return false;
}

bool DescinNode::process_refund(const std::string& investor_address, const std::string& project_id, unsigned long amount, const std::string& signature) {
    std::lock_guard<std::mutex> lock(node_mutex);
    try {
        RefundTx tx(project_id, investor_address, amount, date(), signature, project_id, investor_address);
        if (!mempool.add_transaction(tx)) return false;
        auto pending     = mempool.get_pending_transactions();
        auto new_block   = blockchain.create_block(pending);
        auto mined_block = blockchain.mining_block(new_block);
        if (blockchain.send_block(mined_block)) {
            mempool.clear_pending_transactions(pending.size());
            project_repo.process_refund(investor_address, project_id, amount);
            return true;
        }
    } catch (const std::exception& e) {
        std::cout << "Error process_refund: " << e.what() << std::endl;
        return false;
    }
    return false;
}
