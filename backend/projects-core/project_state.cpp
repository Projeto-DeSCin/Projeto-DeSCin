// Include the header file
#include "project_state.hpp"
// Include the necessary standard library headers
#include <unordered_map>
#include <vector>
#include <mutex>

// Constructor
ProjectState::ProjectState() {
    // Call the seed function to populate the projects map
    _seed();
}

void ProjectState::_seed() {
    // Injeta sobre o unordered map _projects com alguns projetos pré-definidos
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

// ProjectState Methods ----------------------------
/*
 *  O status_filter é uma string
 */
std::vector<ProjectsBody> ProjectState::get_projects(const std::string& status_filter) const {
    // Locka a estrutura para ser thread-safe
    std::lock_guard<std::mutex> lock(_mtx);
    // Instancia um vetor para armazenar os projetos filtrados
    std::vector<ProjectsBody> vec_out;
    // Itera sobre o unordered map _projects
    for (auto& [id, data_project] : _projects)
        // Caso o status_filter esteja vazio ou o status do projeto seja igual ao status_filter, adiciona o projeto ao vetor de saída
        if (status_filter.empty() || data_project.status == status_filter)
            vec_out.push_back(data_project);
    return vec_out;
}

/*
 *  Retorna o projeto correspondente ao id fornecido, ou nullptr caso não exista
 */
const ProjectsBody* ProjectState::get_project_by_id(const std::string& id) const {
    // Locka a estrutura para ser thread-safe
    std::lock_guard<std::mutex> lock(_mtx);
    // Busca o projeto no unordered map _projects
    auto it = _projects.find(id);
    // Retorna nullptr caso o projeto não seja encontrado
    if (it == _projects.end()) return nullptr;
    // Retorna o projeto encontrado
    return &it->second;
}
/*
 *  Retorna true caso o projeto esteja ativo (status == "open"), false caso contrário
 */
bool ProjectState::is_project_active(const std::string& id) const {
    // Locka a estrutura para ser thread-safe
    std::lock_guard<std::mutex> lock(_mtx);
    // Busca o projeto no unordered map _projects
    auto it = _projects.find(id);
    // Retorna false caso o projeto não seja encontrado
    if (it == _projects.end()) return false;
    // Retorna true caso o projeto esteja ativo (status == "open")
    return it->second.status == "open";
}

// Investment Methods ----------------------------
std::string ProjectState::project_name(const std::string& id) const {
    // Locka a estrutura para ser thread-safe
    std::lock_guard<std::mutex> lock(_mtx);
    // Busca o projeto no unordered map _projects
    auto it = _projects.find(id);
    // Retorna o nome do projeto caso seja encontrado, ou uma string vazia caso contrário
    return it != _projects.end() ? it->second.name : "";
}

/*
 * Atualiza o funding do projeto com base no investimento recebido
 */
void ProjectState::update_funding(const std::string& inv_id,
                                           const InvestimentBody& inv_body) {
    // Locka a estrutura para ser thread-safe
    std::lock_guard<std::mutex> lock(_mtx);
    // Adiciona o investimento ao unordered map _investments
    _investments[inv_id].push_back(inv_body);

    // Busca o projeto no unordered map _projects
    auto it = _projects.find(inv_body.project_id);
    // Retorna caso o projeto não seja encontrado
    if (it == _projects.end()) return;
    
    // Atualiza o total_funding e o investors_count do projeto correspondente
    it->second.total_funding += inv_body.amount_invested;
    it->second.investors_count += 1;
    if (it->second.total_funding >= it->second.target_funding)
        it->second.status = "funded";
}

// Cria o projeto Descin;
bool ProjectState::add_project(const ProjectsBody& project) {
    std::lock_guard<std::mutex> lock(_mtx);
    
    if (_projects.count(project.project_id)) {
        return false; // projeto já existe
    }
    
    _projects[project.project_id] = project;
    return true;
}




/*
 * Retorna os investimentos realizados em um projeto específico
 */
std::vector<InvestimentBody> ProjectState::investments_for(const std::string& id) const {
    // Locka a estrutura para ser thread-safe
    std::lock_guard<std::mutex> lock(_mtx);
    // Busca os investimentos no unordered map _investments
    auto it = _investments.find(id);
    // Retorna um vetor vazio caso o investimento não seja encontrado
    if (it == _investments.end()) return {};
    return it->second;
}
