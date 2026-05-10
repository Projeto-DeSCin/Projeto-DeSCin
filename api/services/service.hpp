#ifndef SERVICE_HPP
#define SERVICE_HPP

// Include models
#include "../models/model.hpp"

// Include libraries
#include <crow.h>
#include <string>
#include <vector>
#include <optional>

template <typename Model>
class Service {
public:
    // Default constructor and destructor
    Service() = default;
    virtual ~Service() = default;

    // Services Methods
    virtual std::optional<Model> show(const std::string id) const = 0;
    virtual std::vector<Model> index() const = 0;
    virtual Model create(const crow::json::rvalue& body) = 0;
    virtual Model update(const crow::json::rvalue& body, const std::string id) = 0;
    virtual Model destroy(const std::string id) = 0;
    
};

#endif // SERVICE_HPP
