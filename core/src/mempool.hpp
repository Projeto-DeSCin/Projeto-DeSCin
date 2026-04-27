#ifndef MEMPOOL_HPP
#define MEMPOOL_HPP

#include <deque>
#include <mutex>
#include "transaction.hpp"

class Mempool {
private:
    std::deque<Transaction> pending_transactions;
    // Precisa-se entender o modificar muteble e o tipo mutex
    mutable std::mutex mempool_mutex;

public:
    // Constructor and Destructor
    Mempool() = default;
    ~Mempool() = default;

    bool add_transaction(const Transaction& tx);
    std::deque<Transaction> get_pending_transactions(void) const;
    void clear_pending_transactions(size_t count);

};

#endif // MEMPOOL_HPP
