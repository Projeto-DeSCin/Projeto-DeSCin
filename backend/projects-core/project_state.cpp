#include "project_state.hpp"
#include <unordered_map>
#include <vector>
#include <mutex>

ProjectState::ProjectState() { _seed(); }

void ProjectState::_seed() {
    _projects["proj-001"] = {"proj-001", "DeFi Yield Protocol", "Protocolo descentralizado de rendimento com APY competitivo.", "DeFi", 85000000, 100000000, 142, "open", "2024-01-01T00:00:00Z", 35.5};
    _projects["proj-002"] = {"proj-002", "NFT Marketplace X", "Marketplace multi-chain com taxas zero.", "NFT", 50000000, 50000000, 89, "funded", "2023-12-01T00:00:00Z", 22.0};
    _projects["proj-003"] = {"proj-003", "Layer2 Bridge", "Bridge de alta velocidade entre L1 e L2.", "Infrastructure", 12000000, 200000000, 28, "open", "2024-04-01T00:00:00Z", 58.0};
}

std::vector<ProjectsBody> ProjectState::get_projects(const std::string& status_filter) const {
    std::lock_guard<std::mutex> lock(_mtx);
    std::vector<ProjectsBody> vec_out;
    for (auto& [id, p] : _projects)
        if (status_filter.empty() || p.status == status_filter)
            vec_out.push_back(p);
    return vec_out;
}

const ProjectsBody* ProjectState::get_project_by_id(const std::string& id) const {
    std::lock_guard<std::mutex> lock(_mtx);
    auto it = _projects.find(id);
    if (it == _projects.end()) return nullptr;
    return &it->second;
}

bool ProjectState::is_project_active(const std::string& id) const {
    std::lock_guard<std::mutex> lock(_mtx);
    auto it = _projects.find(id);
    if (it == _projects.end()) return false;
    return it->second.status == "open";
}

std::string ProjectState::project_name(const std::string& id) const {
    std::lock_guard<std::mutex> lock(_mtx);
    auto it = _projects.find(id);
    return it != _projects.end() ? it->second.name : "";
}

bool ProjectState::add_project(const ProjectsBody& project) {
    std::lock_guard<std::mutex> lock(_mtx);
    if (_projects.count(project.project_id)) return false;
    _projects[project.project_id] = project;
    return true;
}

void ProjectState::update_funding(const std::string& inv_id, const InvestimentBody& inv_body) {
    std::lock_guard<std::mutex> lock(_mtx);
    _investments[inv_id].push_back(inv_body);
    auto it = _projects.find(inv_body.project_id);
    if (it == _projects.end()) return;
    it->second.total_funding   += inv_body.amount_invested;
    it->second.investors_count += 1;
    if (it->second.total_funding >= it->second.target_funding)
        it->second.status = "funded";
}

std::vector<InvestimentBody> ProjectState::investments_for(const std::string& id) const {
    std::lock_guard<std::mutex> lock(_mtx);
    auto it = _investments.find(id);
    if (it == _investments.end()) return {};
    return it->second;
}

bool ProjectState::process_refund(const std::string& investor_address, const std::string& project_id, unsigned long amount) {
    std::lock_guard<std::mutex> lock(_mtx);
    auto it = _investments.find(investor_address);
    if (it == _investments.end()) return false;
    for (auto& inv : it->second) {
        if (inv.project_id == project_id && inv.status == "active") {
            inv.status = "exited";
            auto proj_it = _projects.find(project_id);
            if (proj_it != _projects.end()) {
                proj_it->second.total_funding   -= amount;
                proj_it->second.investors_count -= 1;
                if (proj_it->second.status == "funded")
                    proj_it->second.status = "open";
            }
            return true;
        }
    }
    return false;
}
