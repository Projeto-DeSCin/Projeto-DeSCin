#include "date.hpp"

std::time_t date (void) {
    auto current = std::chrono::system_clock::now();
    std::time_t cur_time = std::chrono::system_clock::to_time_t(current);

    return cur_time;
}
