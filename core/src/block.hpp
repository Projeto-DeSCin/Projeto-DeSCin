/*
 *   block.hpp Estruturando a classe bloco/base para todo o sistema de
 * blockchain
 *
 */

#ifndef BLOCK_HPP
#define BLOCK_HPP

// Importing default libraries
#include <string>
#include <iostream>

// Data structs to the clss
struct Header {
long nonce;
std::string hash_block;
};

struct Payload {
long sequence;
time_t timestamp;
std::string data; // Ainda não defini o tipo de data
std::string prev_hash;
};

class Block {
private:
  Header header;
  Payload payload;

public:
  // Constrcutor and destructor
  Block();
  ~Block();

  // Header methods
  void set_header(const Header& hd);
  Header get_header(void) const { return header;}

  // Payload methods
  void set_payload(const Payload& pd);
  Payload get_payload(void) const { return payload;}
  // Timestamp setting
  void set_timestamp(void);
  time_t get_timestamp(void) const { return payload.timestamp; }

  // Visual methods
  void display(void) const;
};

#endif
