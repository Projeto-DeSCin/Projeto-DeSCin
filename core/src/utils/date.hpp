#ifndef DATE_HPP
#define DATE_HPP

#include <chrono>

inline long long date (void) {
    auto cur_time = std::chrono::system_clock::now();
    auto duration_object = cur_time.time_since_epoch();

    return std::chrono::duration_cast<std::chrono::seconds>(duration_object).count();
};

#endif // DATE_HPP
