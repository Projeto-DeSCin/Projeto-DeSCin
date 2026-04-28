#include "descin_node.hpp"

#include <string>

// Importing utils
#include "../blockchain-core/src/utils/date.hpp"

bool DescinNode::process_investment(const std::string& sender, const std::string& project_id, unsigned long amount, const std::string& signature) {
    // Lockzinho
    std::lock_guard<std::mutex> lock(node_mutex);

    try {

        // Verify id project
        if (!project_repo.is_project_active(project_id)) {
            return false;
        }

        // Creating transaction
        Transaction tx(sender, project_id, amount, date(), signature);

        if (!mempool.add_transaction(tx)) {
            return false;
        }

        // Memool
        auto pending = mempool.get_pending_transactions();
            auto new_block = blockchain.create_block(pending);

            auto mined_block = blockchain.mining_block(new_block);

            // Send block to the chain/network
            if (blockchain.send_block(mined_block)) {
                mempool.clear_pending_transactions(pending.size());

                InvestimentBody inv = {project_id, "", amount, 10, date(), "active"};
                project_repo.update_funding(project_id, inv);

                return true;
            }

        } catch (const std::exception& e) {
            std::cout << "Error: " << e.what() << std::endl;
            return false;
        }
        return false;
}
