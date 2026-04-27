// Importing std libraries
#include <deque>
// Importing hpp libraries
#include "transaction.hpp"
#include "block.hpp"
#include "utils/date.hpp"
#include "utils/hash.hpp"
// Importing ext libraries
#include <nlohmann/json.hpp>

// Configuring nlohmann json for non-intrusive serialization
using json = nlohmann::json;

// Class methods
Block::Block(long sequence, std::string prev_hash, const std::deque<Transaction>& data) {
    payload.sequence = sequence;
    payload.timestamp = get_timestamp();
    payload.data = data;
    payload.prev_hash = prev_hash;

    header.nonce = 0;
    header.hash_block = calculate_hash_block();
}

// Header methods
void Block::set_header(const Header& hd) {
    header = hd;
}

// Payload methods
void Block::set_payload(const Payload& pd) {
    payload = pd;
}

std::string Block::calculate_hash_block(void) const {
    json block_payload;
    block_payload["nonce"] = header.nonce;
    block_payload["sequence"] = payload.sequence;
    block_payload["previous_hash"] = payload.prev_hash;
    block_payload["timestamp"] = payload.timestamp;

    json tx_array = json::array();

    for (const auto& tx : payload.data) {

        TransactionBody tx_body = tx.get_body();

        json tx_json;
        tx_json["sender_key"] = tx_body.sender_key;
        tx_json["receiver_key"] = tx_body.receiver_key;
        tx_json["amount"] = tx_body.amount;
        tx_json["timestamp"] = tx_body.timestamp;
        tx_json["signature"] = tx_body.signature;
        tx_json["hash"] = tx_body.transaction_hash;

        tx_array.push_back(tx_json);
    }

    block_payload["data"] = tx_array;

    std::string payload_string = block_payload.dump();

    return hash(payload_string);
}

void Block::set_timestamp(void) {
    payload.timestamp = date();
}

void Block::display(void) const {
    std::cout   << "Header Block --" << std::endl
                << "Nonce:\t" << header.nonce << std::endl
                << "Hash do block:\t" << header.hash_block << std::endl << std::endl
                << "Payload Block --" << std:: endl
                << "Sequence:\t" << payload.sequence << std::endl
                << "Timestamp:\t" << payload.timestamp << std::endl
                << "Data (Lista de Transações):\t" << std::endl
                << "- Numero de transações: " << payload.data.size() << std::endl;
    std::cout   << "Prev_hash:\t" << payload.prev_hash << std::endl << std::endl;
}
