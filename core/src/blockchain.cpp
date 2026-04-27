// Importing hpps
#include "blockchain.hpp"
#include "transaction.hpp"
//Utils
#include "utils/date.hpp"
#include "utils/hash.hpp"
#include "utils/hash_validation.hpp"

// Importing exxternal libraries
#include <nlohmann/json.hpp>
// Importing standard libraries
#include <iostream>
#include <string>
#include <stdexcept>
#include <deque>

using json = nlohmann::json;

// Defining constructor
Blockchain::Blockchain(int diff) : difficulty(diff) {
  chain.push_back(create_genesis_block());
}

// Base block
std::shared_ptr<Block> Blockchain::create_genesis_block(void) {

  // Instantiate the genesis block
  std::deque<Transaction> gensis_tx;
  auto genesis_block = std::make_shared<Block>(0, "", gensis_tx);

  // // Carrying infos by initial block of the chain
  // Payload payload_gen;
  // payload_gen.sequence = 0;
  // payload_gen.timestamp = date();
  // payload_gen.data = ;
  // payload_gen.prev_hash = "";

  // // Defining initial header by genesis_block
  // Header header_gen;
  // header_gen.nonce = 0;
  // header_gen.hash_block = genesis_block->calculate_hash_block();

  // // Setting payload and header for genesis block
  // genesis_block->set_payload(payload_gen);
  // genesis_block->set_header(header_gen);

  std::cout << "Genesis Block ----------" << std::endl;
  // Visualisating infos by genesis block
  genesis_block->display();

  return genesis_block;
}

// Create a new block
std::shared_ptr<Block> Blockchain::create_block(const std::deque<Transaction> &data_tx) {
    auto last_block = get_last_block();
    long next_sequence = last_block->get_payload().sequence + 1;
    std::string last_hash = last_block->get_header().hash_block;
    // Instantiate the new block
    auto new_block = std::make_shared<Block>(next_sequence, last_hash, data_tx);

  // Payload payload_new_block;
  // // Getting the sequence of the last block
  // payload_new_block.sequence = ;
  // payload_new_block.timestamp = date();
  // payload_new_block.data = data;
  // payload_new_block.prev_hash = get_hash_last_block();

  // // Calculating the hash of the new block and setting the header
  // Header header_new_block;
  // header_new_block.nonce = 0;
  // header_new_block.hash_block = new_block->calculate_hash_block();

  // // Setting the payload and header of the new block
  // new_block->set_payload(payload_new_block);
  // new_block->set_header(header_new_block);

  std::cout << "Bloco criado! " << std::endl;
  std::cout << json(new_block->get_header()).dump() << std::endl;
  std::cout << json(new_block->get_payload()).dump() << std::endl << std::endl;

  return new_block;
}

bool Blockchain::block_validation(const std::shared_ptr<Block>& block) const {
    if (block->get_payload().prev_hash != get_hash_last_block()){

        throw std::runtime_error("Hash Anterior Inválido! Sequence atual: " + std::to_string(block->get_payload().sequence)
            + ". Hash esperado: " + get_hash_last_block() + ". Hash recebido: " + block->get_payload().prev_hash);

    }

    std::string payload_data = json(block->get_payload()).dump();
    std::string hash_test = hash(payload_data + std::to_string(block->get_header().nonce));
    if (!hash_validation(hash_test, difficulty, pow_prefix)){
        throw std::runtime_error("Proof of work não bate! Sequence atual: " + std::to_string(block->get_payload().sequence)
            + " Nonce: " + std::to_string(block->get_header().nonce));
    }
    return true;
}

// Getters of the last block
std::shared_ptr<Block> Blockchain::get_last_block() const {
  // Case em que retorna um empty Block se não houver blocos na chain
  if (chain.size() == 0){
      throw std::runtime_error("Não existem blocos na chain. Bloco Genesis não encontrado.");
  }
  return chain.back();
}

std::string Blockchain::get_hash_last_block() const {
  return chain.back()->get_header().hash_block;
}

std::shared_ptr<Block> Blockchain::mining_block(std::shared_ptr<Block> mining_block) {
  Payload payload_data = mining_block->get_payload();
  std::string  json_payload_data = json(payload_data).dump();

  // Mining the block
  long nonce = 0;
  long long start_time = date();

  while (true){
    std::string hash_pow = hash(json_payload_data + std::to_string(nonce));

        if (hash_validation(hash_pow, difficulty, pow_prefix)) {
            long long final_time = date();
            std::string reduced_hash = hash_pow.substr(0, 12);
            long long time_taken = (final_time - start_time);

            std::cout << "Bloco de sequência: " << payload_data.sequence << " | minerado em " << time_taken << "s." << std::endl
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

void Blockchain::send_block(std::shared_ptr<Block> block) {
    if(block_validation(block)){
        chain.push_back(block);
        std::cout << "Bloco de sequencia: (" << block->get_payload().sequence << ") enviado com sucesso!" << std::endl
                << json(block->get_payload()).dump(4) << std::endl;
    }
}

// Visual information about the chain
void Blockchain::display(void) const {
  std::cout << "Blocos Atuais da chain --------------------------------------------------" << std::endl;
  for (const auto& block : chain) {
    block->display();
  }
}
