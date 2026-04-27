// Importing our hpp libraries
#include "blockchain.hpp"
#include "transaction.hpp"
#include "mempool.hpp"
#include "wallet.hpp"

// Importing Utils
#include "utils/date.hpp"
#include "utils/encryptation/generate_key_pair.hpp"
#include "utils/encryptation/sign_message.hpp"

// Importing built in libraries
#include <iostream>
#include <vector>

int main(void) {

    Wallet wallet_sender, wallet_receiver;

    std::string sender = wallet_sender.publicKey;
    std::string receiver = wallet_receiver.publicKey;

    unsigned long amount = 1050;
    long long ts = date();

    std::string data_to_sign = wallet_sender.format_data(sender, receiver, amount, ts);
    std::string real_signature = wallet_sender.sign_with_private_key(data_to_sign);

    Transaction tsx(sender, receiver, amount, ts, real_signature);

    Mempool mempool;
    if (mempool.add_transaction(tsx)) {
        std::cout  << "Transação adicionada ao mempool!" << mempool.get_pending_transactions().size() << std::endl;
    }
    else {
        std::cout << "Falha ao adicionar transação ao mempool." << std::endl;
    }

  // Dificuldade para quebrar o hash do bloco
  int difficulty = 4;
  // Instancing base block of the blockchain
  Blockchain *blockchain = new Blockchain(difficulty);

  // Num blocks of the chain
  int num_blocks = 10;

  for (int i = 0; i <= num_blocks; i++) {
    std::shared_ptr<Block> block = blockchain->create_block(mempool.get_pending_transactions());
    std::shared_ptr<Block> mined_block = blockchain->mining_block(block);
    blockchain->send_block(mined_block);
  }

  // Display the blockchain
  blockchain -> display();

  return 0;
}
