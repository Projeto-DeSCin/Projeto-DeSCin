#ifndef PROJECTS_STATE_HPP
#define PROJECTS_STATE_HPP
/*
 *  Classe que 
 */

// Importing std libraries
#include <unordered_map>
#include <vector>
#include <mutex>
#include <string>


// Body ProjectState Structure
/*
 * Esses são os dados que compõe um proejeto dentro da plataforma DeSCin
 */
struct ProjectsBody {
    std::string     project_id;                 // ID do projeto
    std::string     name;                       // Nome do projeto
    std::string     description;                // Descrição do projeto
    std::string     category;                   // Categoria do projeto
    unsigned long   total_funding;              // Valor total arrecadado
    unsigned long   target_funding;             // Valor alvo de arrecadação
    unsigned long   investors_count;            // Número de investidores
    std::string     status;                     // "open" | "funded" | "closed"
    std::string     created_at;                 // Data de criação do projeto
    double          roi_estimate;               // Estimativa de retorno sobre investimento
};

// Body Investiment Structure
/*
 * Esses são os dados que compõe um investimento dentro da plataforma DeSCin
 */
struct InvestimentBody {
    std::string     project_id;                 // ID do projeto investido
    std::string     project_name;               // Nome do projeto investido
    unsigned long   amount_invested;            // Valor investido
    unsigned long   current_value;              // Valor atual do investimento
    long long       invested_at;                // Data do investimento
    std::string     status;                       // "active" | "exited" | "pending"
};


/*
 * Classe que representa o estado de um projeto na plataforma DeSCin
 */
class ProjectState {

private:
    // Estrutura mutex para sincronização de acesso aos dados
    mutable std::mutex _mtx;
    
    // Mapa não ordenado de projetos, mapeado pelo ID do projeto
    /*
     * Portanto, ele tem como chave o ID do projeto e como valor os dados do projeto.
     */
    std::unordered_map<std::string, ProjectsBody>                 _projects;
    
    // Mapa não ordenado de investimentos, mapeado pelo ID do projeto
    /*
     * Portanto, ele tem como chave o ID do projeto e como valor um vetor de investimentos.
     */
    std::unordered_map<std::string, std::vector<InvestimentBody>> _investments;

    // Método privado para popular repositório com dados iniciais
    void _seed();

public:
    
    // Constructors e Destructors methods
    ProjectState();
    ~ProjectState() = default;

    // ProjectState Methods
    std::vector<ProjectsBody> get_projects(const std::string& status_filter = "") const;
    const ProjectsBody* get_project_by_id(const std::string& id) const;
    std::string project_name(const std::string& id) const;
    bool is_project_active(const std::string& id) const;

    // Investiment Methods

    // Atualiza o funding de um investimento
    /*
     * Deve receber o endereço do investidor e o investimento a ser atualizado.
     */
    void update_funding(const std::string& investor_address,const InvestimentBody& inv);

    // Retorna um vetor comos investimentos de um projeto
    /*
     * Recebe o ID do projeto e retorna um vetor com os investimentos desse projeto.
     */
    std::vector<InvestimentBody> investments_for(const std::string& id) const;
};

#endif // PROJECTS_STATE_HPP
