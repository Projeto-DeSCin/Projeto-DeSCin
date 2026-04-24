#ifndef BLOCKCHAIN_HPP
#define BLOCKCHAIN_HPP

// Importing hpps
#include "block.hpp"
// Importing external libraries
// Importing standard libraries
#include <chrono>
#include <iostream>
#include <vector>

class Blockchain {
private:
  int difficulty;
  char pow_prefix = '0';
  std::vector<const Block *> chain;

  /* Private methods */

  // Crreate blocks
  const Block* create_genesis_block(void);

  const Block& get_last_block(void) const;
  std::string get_hash_last_block(void) const;

public:
// Blockchain constructor and destructor
  Blockchain(int diff = 4);
  ~Blockchain();

  // Create block method
  const Block* create_block(const std::string& data);

  void mining_block(const Payload& data);

  // Visualizating the blocks/chain
  void display(void) const;

};

#endif // BLOCKCHAIN_HPP
