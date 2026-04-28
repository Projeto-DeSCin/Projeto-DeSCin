// Importing hpps
#include "blockchain.hpp"
#include "transaction.hpp"
//Utils
#include "utils/date.hpp"
#include "utils/hashing/hash.hpp"
#include "utils/hashing/hash_validation.hpp"

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

    json j;
    j["sequence"] = payload_data.sequence;
    j["timestamp"] = payload_data.timestamp;
    j["data"] = payload_data.data;
    j["prev_hash"] = payload_data.prev_hash;

  std::string json_payload_data = j.dump();

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

bool Blockchain::send_block(std::shared_ptr<Block> block) {
    try {
        if(block_validation(block)){
            chain.push_back(block);
            std::cout << "Bloco de sequencia: (" << block->get_payload().sequence << ") enviado com sucesso!" << std::endl
                << json(block->get_payload()).dump(4) << std::endl;
            return true;
        }
    } catch (const std::exception& e) {
        std::cerr << "Erro ao enviar bloco: " << e.what() << std::endl;
    }
    return false;
}

// Visual information about the chain
void Blockchain::display(void) const {
  std::cout << "Blocos Atuais da chain --------------------------------------------------" << std::endl;
  for (const auto& block : chain) {
    block->display();
  }
}
