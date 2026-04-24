// IMporting hpps
#include "blockchain.hpp"
#include "utils/date.hpp"
#include "utils/hash.hpp"
#include "utils/hash_validation.hpp"

// Importing exxternal libraries
#include <nlohmann/json.hpp>
// Importing standard libraries
#include <iostream>
#include <string>
#include <stdexcept>


using json = nlohmann::json;
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Payload, sequence, timestamp, data,
                                   prev_hash)
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Header, nonce, hash_block)

// Defining constructor
Blockchain::Blockchain(int diff) : difficulty(diff) {
  chain.push_back(create_genesis_block());
}

Blockchain::~Blockchain() {}

// Base block
Block *Blockchain::create_genesis_block(void) {

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

  std::cout << "Genesis Block ----------" << std::endl;
  // Visualisating infos by genesis block
  genesis_block->display();

  return genesis_block;
}

// Create a new block
Block *Blockchain::create_block(const std::string &data) {
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

  std::cout << json_to_payload.dump() << std::endl;
  std::cout << json(new_block->get_header()).dump() << std::endl;

  // chain.push_back(new_block);

  return new_block;
}

bool Blockchain::block_validation(Block &block) const {
    if (block.get_payload().prev_hash != get_hash_last_block()){

        throw std::runtime_error("Previous hash does not match the hash of the last block. Block sequence Invalid: " + std::to_string(block.get_payload().sequence)
            + ". Expected: " + get_hash_last_block() + ". Got: " + block.get_payload().prev_hash);

    }

    std::string payload_data = json(block.get_payload()).dump();
    std::string hash_test = hash(payload_data + std::to_string(block.get_header().nonce));
    if (!hash_validation(hash_test, difficulty, pow_prefix)){
        throw std::runtime_error("Previous hash does not match the hash of the last block. Block sequence: " + std::to_string(block.get_payload().sequence)
            + " Nonce: " + std::to_string(block.get_header().nonce));
    }
    return true;
}

// Getters of the last block
Block &Blockchain::get_last_block(void) const {
  // Case em que retorna um empty Block se não houver blocos na chain
  if (chain.size() == 0)
    return *new Block();
  return *chain.back();
}

std::string Blockchain::get_hash_last_block(void) const {
  return chain.back()->get_header().hash_block;
}

Block* Blockchain::mining_block(Block &block) {
    // Getting a pointer to the block to mine
Block* mining_block = &block;
  Payload data = mining_block->get_payload();
  std::string  json_data = json(data).dump();
    // Infos do payload em json
    std::cout << json_data << std::endl;

  // Mining the block
  long nonce = 0;
  long long start_time = date();

  while (true){
    std::string hash_pow = hash(json_data + std::to_string(nonce));

        if (hash_validation(hash_pow, difficulty, pow_prefix)) {
            long long final_time = date();
            std::string reduced_hash = hash_pow.substr(0, 12);
            long long time_taken = (final_time - start_time);

            std::cout << "Bloco de sequência: " << data.sequence << " | minerado em " << time_taken << "s." << std::endl
                        << "Hash " << reduced_hash <<  " em " << nonce << " tentativas." << std::endl;

            Header mine_header_res;
            mine_header_res.nonce = nonce;
            mine_header_res.hash_block = hash_pow;

            mining_block->set_header(mine_header_res);
            return mining_block;
        }

        nonce++;
  }
}


std::vector<Block*> Blockchain::send_block(Block& block) {
    Block* block_ptr = &block;
  if (block_validation(*block_ptr)){
      chain.push_back(block_ptr);
      std::cout << "Bloco de sequencia: (" << block_ptr->get_payload().sequence << ") enviado com sucesso!" << std::endl
                << json(block_ptr->get_payload()).dump(4) << std::endl;
  }
  return chain;
}

// Visual information about the chain
void Blockchain::display(void) const {
  std::cout << "Blocos Atuais da chain -----------------" << std::endl;
  for (const Block *block : chain) {
    block->display();
  }
}
