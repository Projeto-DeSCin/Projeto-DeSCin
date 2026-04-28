#ifndef PROJECT_REPOSITORY_HPP
#define PROJECT_REPOSITORY_HPP

#include "api_types.hpp"
#include <unordered_map>
#include <vector>
#include <optional>
#include <mutex>

class ProjectRepository {

private:
    mutable std::mutex _mtx;
    std::unordered_map<std::string, ApiProject>               _projects;
    std::unordered_map<std::string, std::vector<ApiInvestment>> _investments;

    void _seed();

public:
    ProjectRepository();
    ~ProjectRepository() = default;

    // Projetos
    std::vector<ApiProject> list(const std::string& status_filter = "") const;

    std::optional<ApiProject> find(const std::string& id) const;

    // Retorna false se o projeto não existe ou não está "open"
    bool is_open(const std::string& id) const;

    std::string project_name(const std::string& id) const;

    // Investimentos
    void record_investment(const std::string& investor_address,
                           const ApiInvestment& inv);

    std::vector<ApiInvestment> investments_for(const std::string& address) const;
};

#endif // PROJECT_REPOSITORY_HPP
