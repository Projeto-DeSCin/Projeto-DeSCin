// Include adt
#include "supabase.hpp"

// Include libraries
#include <string>
#include <stdexcept>

std::string Supabase::buildConnectionString() {
    // Catch das variáveis de ambiente
    const char* host     = std::getenv("DB_HOST");
    const char* port     = std::getenv("DB_PORT");
    const char* dbname   = std::getenv("DB_NAME");
    const char* user     = std::getenv("DB_USER");
    const char* password = std::getenv("DB_PASSWORD");

    // Validação das variáveis de ambiente
    if (!host || !port || !dbname || !user || !password)
        throw std::runtime_error("Variáveis de ambiente do banco não configuradas");

    // Retorna um linguição de conexão com o banco de dados
    return "host="     + std::string(host)     +
           " port="    + std::string(port)     +
           " dbname="  + std::string(dbname)   +
           " user="    + std::string(user)     +
           " password="+ std::string(password) +
           " sslmode=require";
}