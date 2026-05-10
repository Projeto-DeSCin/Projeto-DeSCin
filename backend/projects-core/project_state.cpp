// Include the header file
#include "project_state.hpp"
// Include the necessary standard library headers
#include <unordered_map>
#include <vector>
#include <mutex>

#include <fstream> // std::ofstream
#include <filesystem> // create_directories

#include <nlohmann/json.hpp> // JSON library

// Constructor
ProjectState::ProjectState() {
    // Tenta carregar estado persistido. Se falhar (arquivo não existe
    // ou está corrompido), faz seed com os projetos padrão.
    if (!_load_from_disk()) {
        _seed();
    }
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

// Implementação do método update_funding que atualiza o funding de um investimento e o status do projeto correspondente 

void ProjectState::update_funding(const std::string& investor_address,
                                  const InvestimentBody& inv) {
    std::lock_guard<std::mutex> lock(_mtx);

    // 1. Achar o projeto. Se não existe, nada a fazer.
    auto it = _projects.find(inv.project_id);
    if (it == _projects.end()) return;

    ProjectsBody& project = it->second;

    // 2. Só aceita aporte em projeto "open".
    if (project.status != "open") return;

    // 3. Verifica se este investidor já apostou aqui antes.
    bool first_time_investor = true;
    auto& project_investments = _investments[inv.project_id];
    for (const auto& existing : project_investments) {
        if (existing.investor_address == investor_address) {
            first_time_investor = false;
            break;
        }
    }

    // 4. Aplica os efeitos.
    project.total_funding += inv.amount_invested;
    if (first_time_investor) {
        project.investors_count += 1;
    }

    // 5. Se alcançou o target, marca como funded.
    if (project.total_funding >= project.target_funding) {
        project.status = "funded";
    }

    // 6. Registra o investimento (cópia entra no vetor).
    project_investments.push_back(inv);
    
    // 7. Persiste o novo estado no disco.
    _save_to_disk();

}

void ProjectState::_save_to_disk() const {
    const std::string path = "data/projects.json";

    // Garante que o diretório data/ existe.
    std::error_code ec;
    std::filesystem::create_directories("data", ec);
    // Ignoramos ec — se falhar criar, o ofstream falha logo abaixo.

    // Monta o JSON usando as macros NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE.
    nlohmann::json j;
    j["projects"]    = _projects;
    j["investments"] = _investments;

    // Abre em modo write (trunca conteúdo anterior).
    std::ofstream out(path);
    if (!out.is_open()) return;

    // dump(2) = JSON indentado com 2 espaços (legível pra humano).
    out << j.dump(2);

}

bool ProjectState::_load_from_disk() {
    const std::string path = "data/projects.json";

    // Arquivo não existe → primeira execução, retorna false pro construtor seedar.
    if (!std::filesystem::exists(path)) return false;

    try {
        // Abre e parseia.
        std::ifstream in(path);
        if (!in.is_open()) return false;

        nlohmann::json j;
        in >> j;  // parse direto do stream

        // Lê os campos com defaults caso estejam ausentes.
        _projects    = j.value("projects",    nlohmann::json::object())
                          .get<std::unordered_map<std::string, ProjectsBody>>();
        _investments = j.value("investments", nlohmann::json::object())
                          .get<std::unordered_map<std::string, std::vector<InvestimentBody>>>();

        return true;
    } catch (const std::exception&) {
        // JSON malformado, tipo errado, etc. Voltamos como se não tivesse arquivo.
        return false;
    }
}





