#ifndef PROJECT_REPOSITORY_HPP
#define PROJECT_REPOSITORY_HPP

// Importing std libraries
#include <unordered_map>
#include <vector>
#include <optional>
#include <mutex>
#include <string>

struct ProjectsBody {
    std::string     project_id;
    std::string     name;
    std::string     description;
    std::string     category;
    unsigned long   total_funding;
    unsigned long   target_funding;
    unsigned long   investors_count;
    std::string     status;        // "open" | "funded" | "closed"
    std::string     created_at;
    double          roi_estimate;
};

struct InvestimentBody {
    std::string     project_id;
    std::string     project_name;
    unsigned long   amount_invested;
    unsigned long   current_value;
    long long       invested_at;
    std::string     status;   // "active" | "exited" | "pending"
};

class ProjectRepository {

private:
    mutable std::mutex _mtx;
    std::unordered_map<std::string, ProjectsBody>                 _projects;
    std::unordered_map<std::string, std::vector<InvestimentBody>> _investments;

    void _seed();

public:
    ProjectRepository();
    ~ProjectRepository() = default;

    // Projetos
    std::vector<ProjectsBody> get_projects(const std::string& status_filter = "") const;
    std::optional<ProjectsBody> get_project_by_id(const std::string& id) const;

    // Retorna false se o projeto não existe ou não está "open"
    bool is_project_active(const std::string& id) const;
    std::string project_name(const std::string& id) const;

    // Investimentos
    void update_funding(const std::string& investor_address,
                           const InvestimentBody& inv);

    std::vector<InvestimentBody> investments_for(const std::string& address) const;
};

#endif // PROJECT_REPOSITORY_HPP
