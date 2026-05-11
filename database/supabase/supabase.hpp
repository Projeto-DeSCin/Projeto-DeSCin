#ifndef SUPABASE_HPP
#define SUPABASE_HPP

// Include Libraries
#include <pqxx/pqxx>
#include <string>

class Supabase {
private:
    // Database connection
    pqxx::connection conn;

    // Constrói a conexão com o db
    static std::string buildConnectionString();

public:
    Supabase() : conn(buildConnectionString()) {}
    pqxx::connection& getConnection() { return conn; }

};

#endif // SUPABASE_HPP