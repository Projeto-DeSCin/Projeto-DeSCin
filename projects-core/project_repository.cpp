#include "project_repository.hpp"

ProjectRepository::ProjectRepository() {
    _seed();
}

void ProjectRepository::_seed() {
    _projects["proj-001"] = {
        "proj-001", "DeFi Yield Protocol",
        "Protocolo descentralizado de rendimento com APY competitivo.",
        "DeFi", 85000000, 100000000, 142, "open",
        "2024-01-01T00:00:00Z", 35.5
    };
    _projects["proj-002"] = {
        "proj-002", "NFT Marketplace X",
        "Marketplace multi-chain com taxas zero.",
        "NFT", 50000000, 50000000, 89, "funded",
        "2023-12-01T00:00:00Z", 22.0
    };
    _projects["proj-003"] = {
        "proj-003", "Layer2 Bridge",
        "Bridge de alta velocidade entre L1 e L2.",
        "Infrastructure", 12000000, 200000000, 28, "open",
        "2024-04-01T00:00:00Z", 58.0
    };
}

// Projetos
std::vector<ProjectsBody> ProjectRepository::get_projects(const std::string& status_filter) const {
    std::lock_guard<std::mutex> lock(_mtx);
    std::vector<ProjectsBody> out;
    for (auto& [id, p] : _projects)
        if (status_filter.empty() || p.status == status_filter)
            out.push_back(p);
    return out;
}

std::optional<ProjectsBody> ProjectRepository::get_project_by_id(const std::string& id) const {
    std::lock_guard<std::mutex> lock(_mtx);
    auto it = _projects.find(id);
    if (it == _projects.end()) return std::nullopt;
    return it->second;
}

bool ProjectRepository::is_project_active(const std::string& id) const {
    std::lock_guard<std::mutex> lock(_mtx);
    auto it = _projects.find(id);
    return it != _projects.end() && it->second.status == "open";
}

// Investimentos
std::string ProjectRepository::project_name(const std::string& id) const {
    std::lock_guard<std::mutex> lock(_mtx);
    auto it = _projects.find(id);
    return it != _projects.end() ? it->second.name : "";
}

void ProjectRepository::update_funding(const std::string& investor_address,
                                           const InvestimentBody& inv) {
    std::lock_guard<std::mutex> lock(_mtx);
    _investments[investor_address].push_back(inv);

    auto it = _projects.find(inv.project_id);
    if (it == _projects.end()) return;

    it->second.total_funding += inv.amount_invested;
    it->second.investors_count += 1;
    if (it->second.total_funding >= it->second.target_funding)
        it->second.status = "funded";
}

std::vector<InvestimentBody> ProjectRepository::investments_for(const std::string& address) const {
    std::lock_guard<std::mutex> lock(_mtx);
    auto it = _investments.find(address);
    if (it == _investments.end()) return {};
    return it->second;
}
