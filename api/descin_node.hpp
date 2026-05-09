#ifndef DESCINODE_HPP
#define DESCINODE_HPP

#include "../backend/blockchain-core/src/blockchain.hpp"
#include "../backend/blockchain-core/src/transaction.hpp"
#include "../backend/blockchain-core/src/mempool.hpp"
#include "../backend/projects-core/project_state.hpp"
#include "../backend/projects-core/project_create_tx.hpp"
#include "../backend/projects-core/investiment_tx.hpp"
#include "../backend/projects-core/refund_tx.hpp"
#include <mutex>
#include <iostream>

class DescinNode {
    private:
        std::mutex   node_mutex;
        Blockchain   blockchain;
        ProjectState project_repo;
        Mempool      mempool;

    public:
        DescinNode(int diff = 4);
        ~DescinNode() = default;

        auto inline get_projects(void) {
            std::lock_guard<std::mutex> lock(node_mutex);
            return project_repo.get_projects();
        };
        auto inline get_project_by_id(const std::string& id) {
            std::lock_guard<std::mutex> lock(node_mutex);
            return project_repo.get_project_by_id(id);
        };

        bool create_project(const std::string& sender, ProjectsBody project, const std::string& signature);
        bool process_investment(const std::string& sender, const std::string& project_id, unsigned long amount, const std::string& signature);
        bool process_refund(const std::string& investor_address, const std::string& project_id, unsigned long amount, const std::string& signature);

        inline const std::deque<std::shared_ptr<Block>>& get_chain() const {
            return blockchain.get_chain();
        }
};

#endif // DESCNODE_HPP
