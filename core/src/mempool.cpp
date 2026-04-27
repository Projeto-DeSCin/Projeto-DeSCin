#include "mempool.hpp"
#include "transaction.hpp"
#include <deque>
#include <iostream>

bool Mempool::add_transaction(const Transaction& tx) {
    // Check if the transaction is valid before adding it to the mempool
    if (!tx.is_transaction_valid()){
        std::cout << "Transação inválida!" << std::endl;
        return false;
    }

    std::lock_guard<std::mutex> lock(mempool_mutex);

    pending_transactions.push_back(tx);
    return true;
}

std::deque<Transaction> Mempool::get_pending_transactions(void) const {
    std::lock_guard<std::mutex> lock(mempool_mutex);

    return pending_transactions;
}

void Mempool::clear_pending_transactions(size_t count) {
    //
    std::lock_guard<std::mutex> lock(mempool_mutex);

    // Verifica se o número de transações a serem removidas é maior que o tamanho do mempool
    if (count  > pending_transactions.size()) {
        count = pending_transactions.size();
    }
    pending_transactions.erase(pending_transactions.begin(), pending_transactions.begin() + count);

}
