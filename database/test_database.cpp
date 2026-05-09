#include "database.hpp"
#include <iostream>
#include <fstream>
#include <cstdint>
#include <string>
#include <vector>
#include <cstdio> // Para std::remove
#include <openssl/rand.h>

using namespace descin::db;

struct TestCase {
    std::string user_id;
    std::string plaintext;
};

std::vector<TestCase> cases = {
    {"Alice", "Hello, World!"},
    {"Victor", "This is a test."},
    {"Charlie", "Another test case."}
};

int main() {
    const std::string password = "test123";
    const std::string path = "test.dat";

    std::remove(path.c_str()); // Remove o arquivo se ele já existir para garantir um teste limpo

    std::cout << "--- Iniciando Gravação ---" << std::endl;

    for (const auto& test_case : cases) {
        unsigned char salt[SALT_SIZE];
        unsigned char iv[IV_SIZE];
        unsigned char key[KEY_SIZE];

        if (RAND_bytes(salt, SALT_SIZE) != 1 || RAND_bytes(iv, IV_SIZE) != 1) { // Gerar salt e IV aleatórios
            std::cerr << "Erro no OpenSSL" << std::endl;
            return 1;
        }

        derive_key(password, salt, key); // Deriva a chave usando a senha e o salt
        std::vector<unsigned char> cipher = encrypt(test_case.plaintext, key, iv);

        if (!append_block(path, test_case.user_id, salt, iv, cipher)) { // Grava o bloco no arquivo
            std::cerr << "Erro ao gravar " << test_case.user_id << std::endl;
            return 1;
        }
        std::cout << "[+] Gravado: " << test_case.user_id << std::endl;
    }

    std::cout << "\n--- Iniciando Leitura e Validação ---\n" << std::endl;

    std::vector<EncryptedBlock> blocks = read_all_blocks(path); // Lê todos os blocos do arquivo para validar

    if (blocks.empty()) { // Se não leu nenhum bloco, algo deu errado
        std::cerr << "Erro: Nenhum bloco lido!" << std::endl;
        return 1;
    }

    for (const auto& block : blocks) { // Para cada bloco lido, tentamos decifrar e validar
        unsigned char key[KEY_SIZE];

        // CORREÇÃO 1: Usar .data() para passar o ponteiro do vector
        derive_key(password, block.salt.data(), key);

        // CORREÇÃO 2: Usar .data() para o IV e converter o retorno para string
        std::vector<unsigned char> decrypted_data = decrypt(block.data, key, block.iv.data()); // Decifra os dados usando a chave derivada e o IV lido do arquivo
        std::string decrypted_text(decrypted_data.begin(), decrypted_data.end());

        std::cout << "Usuário: " << block.user_id << std::endl;
        std::cout << "Decifrado: " << decrypted_text << std::endl;

        bool match = false;
        for(const auto& c : cases) { // Verifica se o user_id e o texto decifrado correspondem a algum dos casos de teste originais
            if(c.user_id == block.user_id && c.plaintext == decrypted_text) {
                match = true;
                break;
            }
        }

        if (match) {
            std::cout << "✅ STATUS: OK" << std::endl;
        } else {
            std::cout << "❌ STATUS: FALHA" << std::endl;
        }
        std::cout << "-----------------------" << std::endl;
    }

    return 0;
}