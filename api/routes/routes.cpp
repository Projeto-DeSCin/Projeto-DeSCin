#include "routes.hpp"

Routes::Routes(crow::App<>& app, DescinNode& node) : app(app), node(node) {}
