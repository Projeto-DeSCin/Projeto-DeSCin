#ifndef PROJECTS_STATE_HPP
#define PROJECTS_STATE_HPP

#include <unordered_map>
#include <vector>
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
    std::string     status;
    std::string     created_at;
    double          roi_estimate;
};

struct InvestimentBody {
    std::string     project_id;
    std::string     project_name;
    unsigned long   amount_invested;
    unsigned long   current_value;
    long long       invested_at;
    std::string     status;
};

class ProjectState {
private:
    mutable std::mutex _mtx;
    std::unordered_map<std::string, ProjectsBody>                 _projects;
    std::unordered_map<std::string, std::vector<InvestimentBody>> _investments;
    void _seed();

public:
    ProjectState();
    ~ProjectState() = default;

    std::vector<ProjectsBody> get_projects(const std::string& status_filter = "") const;
    const ProjectsBody* get_project_by_id(const std::string& id) const;
    std::string project_name(const std::string& id) const;
    bool is_project_active(const std::string& id) const;
    bool add_project(const ProjectsBody& project);

    void update_funding(const std::string& investor_address, const InvestimentBody& inv);
    std::vector<InvestimentBody> investments_for(const std::string& id) const;
    bool process_refund(const std::string& investor_address, const std::string& project_id, unsigned long amount);
};

#endif // PROJECTS_STATE_HPP
