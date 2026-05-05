/*
 *   block.hpp Estruturando a classe bloco/base para todo o sistema de
 * blockchain
 *
 */

#ifndef BLOCK_HPP
#define BLOCK_HPP

// Importing std libraries
#include <string>
#include <iostream>
#include <deque>
// Importing hpp libraries
#include "transaction.hpp"
#include <nlohmann/json.hpp>


// Data structs to the class
struct Header {
long nonce;
std::string hash_block;
};

struct Payload {
long sequence;
long long timestamp;
std::deque<Transaction> data; // Agora a data é um vetor de transações
std::string prev_hash;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Header, nonce, hash_block)
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Payload, sequence, timestamp, data, prev_hash)

class Block {
private:
  Header header;
  Payload payload;

public:
  // Constrcutor and destructor
  Block() = default;
  Block(long sequence, std::string prev_hash, const std::deque<Transaction>& data);
  ~Block() = default;

  NLOHMANN_DEFINE_TYPE_INTRUSIVE(Block, header, payload)

  // Header methods
  void set_header(const Header& hd);
  Header get_header(void) const { return header;}

  // Payload methods
  void set_payload(const Payload& pd);
  Payload get_payload(void) const { return payload;}
  std::string calculate_hash_block(void) const;
  // Timestamp setting
  void set_timestamp(void);
  long long get_timestamp(void) const { return payload.timestamp; }

  // Visual methods
  void display(void) const;
};

#endif
