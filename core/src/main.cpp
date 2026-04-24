// Importing our hpp libraries
#include "blockchain.hpp"
// Importing built in libraries
#include <iostream>
#include <vector>


#define endl '\n'

int main(void) {

  int difficulty = 4; // Dificuldade para quebrar o hash do bloco
  // Instancing base block of the blockchain
  Blockchain *blockchain = new Blockchain(difficulty);

  // Num blocks of the chain
  int num_blocks = 10;

  for (int i = 0; i <= num_blocks; i++) {
    const Block* block = blockchain->create_block("Bloco " + std::to_string(i));
    // long long mine_info = blockchain->mining_block(block);
    // chain = blockchain->send_block(mine_info.mined_block);
  }

  // std::cout << "---------- INITIAL BLOCKCHAIN -----------" << std::endl << chain <<
  // std::endl;
  return 0;
}
