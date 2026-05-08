#ifndef ROUTES_HPP
#define ROUTES_HPP

#include <crow.h>

/*
 * Classe para configurar as rotas da aplicação.
 * Define
 */
class Routes {
    private:
        crow::SimpleApp& app;
        
    public:
        // Constructor and Destructor
        Routes(crow::SimpleApp& app);
        ~Routes() = default;
    
        // Routes Methods
        void setup_routes();
};


#endif