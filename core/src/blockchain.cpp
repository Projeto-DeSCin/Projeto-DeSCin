#include "blockchain.hpp"
#include "utils/date.hpp"
#include "utils/hash.hpp"
#include <nlohmann/json.hpp>

using json = nlohmann::json;
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Payload, sequence, timestamp, data,
                                   prev_hash)

// Defining constructor
Blockchain::Blockchain(int diff) : difficulty(diff) {
  chain.push_back(create_genesis_block());

  std::cout << "O Bloco Genesis -----------------" << std::endl;
  display();
}

Blockchain::~Blockchain() {}

// Base block
const Block *Blockchain::create_genesis_block(void) {

  // Instantiate the genesis block
  Block *genesis_block = new Block();

  // Carrying infos by initial block of the chain
  Payload payload_gen;
  payload_gen.sequence = 0;
  payload_gen.timestamp = date();
  payload_gen.data = "Bloco Inicial";
  payload_gen.prev_hash = "";

  genesis_block->set_payload(payload_gen);

  // Defining initial header by genesis_block
  Header header_gen;
  header_gen.nonce = 0;

  json json_to_payload = genesis_block->get_payload();
  std::string json_stringify = json_to_payload.dump();
  header_gen.hash_block = hash(json_stringify);

  genesis_block->set_header(header_gen);

  // Visualisating infos by genesis block
  genesis_block->display();

  return genesis_block;
}

// Create a new block
const Block *Blockchain::create_block(const std::string &data) {
  // Instantiate the new block
  Block *new_block = new Block();

  Payload payload_new_block;
  // Getting the sequence of the last block
  payload_new_block.sequence = get_last_block().get_payload().sequence + 1;
  payload_new_block.timestamp = date();
  payload_new_block.data = data;
  payload_new_block.prev_hash = get_hash_last_block();

  new_block->set_payload(payload_new_block);

  Header header_new_block;
  header_new_block.nonce = 0;

  json json_to_payload = new_block->get_payload();
  std::string json_stringify = json_to_payload.dump();
  header_new_block.hash_block = hash(json_stringify);

  new_block->set_header(header_new_block);

  chain.push_back(new_block);

  return new_block;
}

// Getters of the last block

const Block &Blockchain::get_last_block(void) const {
  // Case em que retorna um empty Block se não houver blocos na chain
  if (chain.size() == 0)
    return *new Block();
  return *chain.back();
}

std::string Blockchain::get_hash_last_block(void) const {
  return chain.back()->get_header().hash_block;
}

void Blockchain::mining_block(const Payload &data) {

  long nonce = 0;
  std::string hash_block;
}

// Visual information about the chain
void Blockchain::display(void) const {
  std::cout << "Blocos Atuais da chain -----------------" << std::endl;
  for (const Block *block : chain) {
    block->display();
  }
}
