#ifndef ROUTES_HPP
#define ROUTES_HPP

// Include libraries
#include <crow.h>
// Include controllers
#include "../controllers/controller.hpp"

/*
 * Classe para configurar as rotas da aplicação.
 * Define a abstração dos demais tipos de rotas criado, desde a autenticação até as de projeto.
 * Cada classe filha deverá recceber um controller específico, logo vale a utilização do template
 */

template <typename Controller>
class Routes {
    protected:
        // Classe rotas recebe uma objeto Crow App queque será configurada para receber as rotas.
        // E é utilizado template para permitir que a classe seja genérica e possa ser usada com qualquer tipo de App.
        // A exemplo, a classe AuthRoutes utiliza um template para receber um tipo de App específico.
        crow::App<>& app;

        // Controller utilizado para gerenciar as rotas dessa classe.
        Controller& controller;
        
    public:
        // Constructor and Destructor
        Routes(crow::App<>& app, Controller& control) : app(app), controller(control) {};
        virtual ~Routes() = default;
        
        // Routes Methods
        virtual void setup_routes() = 0;
};


#endif