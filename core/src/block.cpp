#include "block.hpp"
#include "utils/date.hpp"

Block::Block() {}

Block::~Block(){}

// Header methods
void Block::set_header(const Header& hd) {
    header = hd;
}

// Payload methods
void Block::set_payload(const Payload& pd) {
    payload = pd;
}

void Block::set_timestamp(void) {
    payload.timestamp = date();
}

void Block::display(void) const {
    std::cout   << "Header Block -----------------------" << std::endl
                << "Nonce:\t" << header.nonce << std::endl
                << "Hash do block:\t" << header.hash_block << std::endl << std::endl
                << "Payload Block -----------------------" << std:: endl
                << "Sequence:\t" << payload.sequence << std::endl
                // << "Timestamp:\t" << payload.timestamp !=  ? std::ctime(payload.timestamp) << std::endl
                << "Data:\t" << payload.data << std::endl
                << "Prev_hash:\t" << payload.prev_hash << std::endl << std::endl;
}
