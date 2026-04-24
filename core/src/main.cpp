// Importing our hpp libraries
#include "blockchain.hpp"
// Importing built in libraries
#include <iostream>
#include <vector>

int main(void) {

  int difficulty = 5; // Dificuldade para quebrar o hash do bloco
  // Instancing base block of the blockchain
  Blockchain *blockchain = new Blockchain(difficulty);

  // Num blocks of the chain
  int num_blocks = 10;

  for (int i = 0; i <= num_blocks; i++) {
    Block* block = blockchain->create_block("Bloco " + std::to_string(i));
    Block* mined_block = blockchain->mining_block(*block);
    std::vector < Block *> chain = blockchain->send_block(*mined_block);
    std::cout << "---------- BLOCKCHAIN -----------" << std::endl << chain[i] << std::endl;
  }

  // std::cout << "---------- INITIAL BLOCKCHAIN -----------" << std::endl << chain <<
  // std::endl;
  return 0;
}
