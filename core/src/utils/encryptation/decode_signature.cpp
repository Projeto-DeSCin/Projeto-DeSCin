#include "decode_signature.hpp"
#include <vector>
#include <string>
#include <stdexcept>

std::vector<unsigned char> decode_signature(const std::string& signature) {
    std::vector<unsigned char> bytes;

    if (signature.length() % 2 != 0) {
        throw std::invalid_argument("Tamanho de assinatura hexadecimal inválido.");
    }

    for (size_t i = 0; i < signature.length(); i += 2) {

        std::string byteString = signature.substr(i, 2);
        unsigned char byte = static_cast<unsigned char>(strtol(byteString.c_str(), nullptr, 16));

        bytes.push_back(byte);
    }

    return bytes;
}
