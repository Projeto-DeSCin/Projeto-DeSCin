#ifndef BLOCKCHAIN_HPP
#define BLOCKCHAIN_HPP

// Importing hpps
#include "block.hpp"
// Importing external libraries
// Importing standard libraries
#include <iostream>
#include <vector>

class Blockchain {
private:
  int difficulty;
  char pow_prefix = '0';
  std::vector<Block *> chain;

  /* Private methods */
  // Create blocks
  Block* create_genesis_block(void);

  // Validation Block
  bool block_validation(Block& block) const;

  Block& get_last_block(void) const;
  std::string get_hash_last_block(void) const;

public:
// Blockchain constructor and destructor
  Blockchain(int diff = 4);
  ~Blockchain();

  // Getters
  int get_difficulty(void) const { return difficulty; }
  char get_pow_prefix(void) const { return pow_prefix; }

  // Create block method
  Block* create_block(const std::string& data);

  Block* mining_block(Block& block);
  std::vector<Block*> send_block(Block& block);

  // Visualizating the blocks/chain
  void display(void) const;

};

#endif // BLOCKCHAIN_HPP
