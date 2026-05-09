#ifndef CONTROLLER_HPP
#define CONTROLLER_HPP

#include <crow.h>

/*
 * Abstract base class for all controllers. 
 */
class Controller {
protected:
    
public:
    virtual ~Controller() = default;
    
    // Pure virtual methods for HTTP methods.
    // These methods must be implemented by derived classes.
    // This class get an object by its id.
    virtual crow::response get_by_id(const crow::request& req, const std::string& id) const = 0; // GET/api/:id
    // This class get many objects.
    virtual crow::response get_many(const crow::request& req) const = 0; // GET/api/
    // This class get all objects.
    virtual crow::response get_all(const crow::request& req) const = 0; // GET/api/   
    
    // This class post a new object.
    virtual crow::response post(const crow::request& req) = 0; // POST/api/
    // This class put an existing object.
    virtual crow::response put(const crow::request& req, const std::string& id) = 0; // PUT/api/:id
    // This class delete an object by its id.
    virtual crow::response del(const crow::request& req, const std::string& id  ) = 0; // DELETE/api/:id
};

#endif // CONTROLLER_HPP
