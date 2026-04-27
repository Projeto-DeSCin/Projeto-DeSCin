#ifndef BLOCKCHAIN_HPP
#define BLOCKCHAIN_HPP

// Importing hpps
#include "block.hpp"
// Importing external libraries
// Importing standard libraries
#include <iostream>
#include <memory>
#include <vector>
#include <deque>

class Blockchain {
private:
  int difficulty;
  char pow_prefix = '1';
  std::vector<std::shared_ptr<Block>> chain;

  /* Private methods */
  // Create blocks
  std::shared_ptr<Block> create_genesis_block(void);
  std::shared_ptr<Block> get_last_block(void) const;
  std::string get_hash_last_block(void) const;

  // Validation Block
  bool block_validation(const std::shared_ptr<Block>& block) const;

public:
// Blockchain constructor and destructor
  Blockchain(int diff = 4);
  ~Blockchain() = default;

  // Getters
  int get_difficulty(void) const { return difficulty; }
  char get_pow_prefix(void) const { return pow_prefix; }

  // Create block method
  std::shared_ptr<Block> create_block(const std::deque<Transaction> &data_tx);
  std::shared_ptr<Block> mining_block(const std::shared_ptr<Block> mining_block);
  void send_block(std::shared_ptr<Block>);

  // Visualizating the blocks/chain
  void display(void) const;

};

#endif // BLOCKCHAIN_HPP
