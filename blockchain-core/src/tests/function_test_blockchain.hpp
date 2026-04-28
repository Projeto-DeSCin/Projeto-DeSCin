#ifndef FUNCTION_TEST_BLOCKCHAIN_HPP
#define FUNCTION_TEST_BLOCKCHAIN_HPP

// Importing our hpp libraries
#include "../blockchain.hpp"
#include "../transaction.hpp"
#include "../mempool.hpp"
#include "../wallet.hpp"

// Importing Utils
#include "../utils/date.hpp"
#include "../utils/encryptation/generate_key_pair.hpp"
#include "../utils/encryptation/sign_message.hpp"

// Importing built in libraries
#include <iostream>
#include <vector>

int function_test_blockchain(void) {
    std::cout << "Iniciando teste da Blockchain..." << std::endl
              << "Wallet A: 5000, Wallet B: 0" << std::endl
              << "Deve ocorrer uma transação entre wallet_A e wallet_B" << std::endl;

    Wallet wallet_sender("wallet_A", 5000), wallet_receiver("wallet_B", 0);

    std::string sender = wallet_sender.get_public_key();
    std::string receiver = wallet_receiver.get_public_key();

    unsigned long amount = 1050;
    long long ts = date();

    std::cout << "Assinando transação..." << std::endl;

    std::cout << "Public Key Sender: \n" << sender << std::endl;
    std::string data_to_sign = wallet_sender.format_data(sender, receiver, amount, ts);
    std::cout << "Dados formatados com sucesso. Tamanho: " << data_to_sign.length() << std::endl;

    std::cout << "Entrando no sign_with_private_key..." << std::endl;
    std::string real_signature = wallet_sender.sign_with_private_key(data_to_sign);
    std::cout << "Assinatura gerada com sucesso!" << std::endl;

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
  Blockchain blockchain(difficulty);

  // Num blocks of the chain
  int num_blocks = 100;

  std::cout << "Iniciando mineração de " << num_blocks << " blocos..." << std::endl;
  for (int i = 0; i <= num_blocks; i++) {
    auto pending_txs = mempool.get_pending_transactions();
    std::shared_ptr<Block> block = blockchain.create_block(pending_txs);
    std::shared_ptr<Block> mined_block = blockchain.mining_block(block);
    blockchain.send_block(mined_block);
  }

  // Display the blockchain
  blockchain.display();

  std::cout << "Teste concluído com sucesso!" << std::endl;
  return 0;
}

#endif
