#ifndef DESCINODE_HPP
#define DESCINODE_HPP

// Importing the blockchain components
#include "../backend/blockchain-core/src/blockchain.hpp"
#include "../backend/blockchain-core/src/transaction.hpp"
#include "../backend/blockchain-core/src/mempool.hpp"

// Importing the project repository
#include "../backend/projects-core/project_state.hpp"

// Importing std libraries
#include <mutex>

class DescinNode {
    private:
        // Mutex for thread-safe access to the descin_node
        std::mutex node_mutex;

        Blockchain blockchain;
        ProjectState project_repo;
        Mempool mempool;

    public:
        DescinNode(int diff = 4);
        ~DescinNode() = default;

        // Repo Methods
        auto inline get_projects(void) {
            std::lock_guard<std::mutex> lock(node_mutex);
            return project_repo.get_projects();
        };
        auto inline get_project_by_id(int id) {
            std::lock_guard<std::mutex> lock(node_mutex);

            std::string id_str = std::to_string(id);
            return project_repo.get_project_by_id(id_str);
        };

        bool process_investment(const std::string& sender, const std::string& project_id, unsigned long amount, const std::string& signature);

        bool create_project(const std::string& sender, ProjectsBody project, const std::string& signature);


        
        // Blockchain Methods
        inline const std::deque<std::shared_ptr<Block>>& get_chain() const {
            return blockchain.get_chain();
        }

};


#endif // DESCNODE_HPP
