#ifndef ROUTES_HPP
#define ROUTES_HPP

// Include libraries
#include <crow.h>
// Include controllers
#include "../controllers/controller.hpp"

/*
 * Classe para configurar as rotas da aplicação.
 * Define a abstração dos demais tipos de rotas criado, desde a autenticação até as de projeto.
 */

class Routes {
    protected:
        // Classe rotas recebe uma objeto Crow App queque será configurada para receber as rotas.
        // E é utilizado template para permitir que a classe seja genérica e possa ser usada com qualquer tipo de App.
        // A exemplo, a classe AuthRoutes utiliza um template para receber um tipo de App específico.
        crow::App<>& app;

        // Controller utilizado para gerenciar as rotas dessa classe.
        Controller& control;
        
    public:
        // Constructor and Destructor
        Routes(crow::App<>& app, Controller& controller) : app(app), controller(control) {};
        ~Routes() = default;
        
        // Routes Methods
        virtual void setup_routes(Controller& controller) = 0;
};


#endif