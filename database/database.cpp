#include "database.hpp"
#include <iostream>
#include <fstream>
#include <cstdint>
#include <string>
#include <vector>
#include <openssl/evp.h> // "A caixa de ferramentas" principal do OpenSSl
#include <openssl/rand.h> // Usada para gerar números verdadeiramente aleatórios SALT
#include <openssl/aes.h>


namespace descin::db {


void derive_key(const std::string& password, const unsigned char* salt, unsigned char* final_key) {
    int iterations = 10000; // Quanto mais interações mais difícil de quebrar
    // Esta função do OpenSSL faz todo o trabalho matemático
    PKCS5_PBKDF2_HMAC_SHA1(
        password.c_str(),    // A senha convertida para estilo C
        password.length(),   // O tamanho da senha
        salt,             // O sal aleatório
        SALT_SIZE,       // Usamos 16 bytes para o salt também
        iterations,        // O número de rodadas de embaralhamento
        KEY_SIZE,    // Quanto queremos no final (32 bytes)
        final_key         // Onde o resultado será guardado
    );

}

std::vector<unsigned char> encrypt(const std::string& text, const unsigned char* key, const unsigned char* iv) {
    // 1. O "Cérebro" da Operação (Contexto)
    // EVP_CIPHER_CTX é uma estrutura que guarda o estado da nossa encriptação.
    // Usamos um ponteiro (*) porque o OpenSSL gerencia essa memória internamente.
    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();

    // 2. Preparando o "balde" para o resultado
    // O texto secreto pode ser um pouco maior que o original (por causa do padding).
    // Reservamos o tamanho do texto + 16 bytes (tamanho de um bloco AES).
    std::vector<unsigned char> ciphered_data(text.length() + SALT_SIZE);

    int len;          // Quantos bytes foram processados agora
    int total_size; // Total de bytes encriptados no final

    // 3. ESTÁGIO: INIT (O Início)
    // Aqui dizemos: "Use o algoritmo AES-256 no modo CBC com esta chave e este IV".
    EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv);

    EVP_EncryptUpdate(ctx, 
                 ciphered_data.data(), // Onde os dados cifrados serão salvos
                 &len,                   // Recebe quantos bytes foram gerados agora
                 (unsigned char*)text.c_str(), // O texto puro em formato de bytes
                 text.length());        // O tamanho original


    total_size = len; // Guardamos o total até agora

    EVP_EncryptFinal_ex(ctx, ciphered_data.data() + total_size, &len);
    total_size += len; // Agora temos o tamanho final real de tudo o que foi trancado!
    
    // Limpando a "Bancada de trabalho"/ Estrutura de dados que lida com a encriptação
    EVP_CIPHER_CTX_free(ctx);

    ciphered_data.resize(total_size);
    // Para termos um vetor de tamanho adequado ao numero de bits ocupados
    return ciphered_data;

}

std::vector<unsigned char> decrypt(const std::vector<unsigned char>& ciphered_data, const unsigned char* key, const unsigned char* iv) {
    EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
    int len;
    int total_size; // Para acompanhar o tamanho total dos dados de saída

    // Cria um vetor para o resultado (mesmo tamanho do cifrado)
    std::vector<unsigned char> clear_data(ciphered_data.size());

    // Inicializa o motor de decriptação para AES-256 em modo CBC
    EVP_DecryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, key, iv);

    // Processa os blocos de dados
    EVP_DecryptUpdate(ctx, clear_data.data(), &len, ciphered_data.data(), ciphered_data.size());
    total_size = len;

    // Finaliza e remove o padding (aqui é onde a senha errada é detectada!)
    if (EVP_DecryptFinal_ex(ctx, clear_data.data() + len, &len) <= 0) {
        EVP_CIPHER_CTX_free(ctx);
        return {}; // Retorna vazio se a senha estiver incorreta ou dados corrompidos
    }
    total_size += len;

    EVP_CIPHER_CTX_free(ctx);

    // Ajusta o vetor para o tamanho real sem o padding
    clear_data.resize(total_size);

    return clear_data;
}

bool append_block(const std::string& path, const std::string& user_id, const unsigned char* salt, const unsigned char* iv, const std::vector<unsigned char>& ciphered_data) {

    // Abrindo o ficheiro para a escrita
    std::ofstream ficheiro(path, std::ios::binary | std::ios::app);

    if (ficheiro.is_open()){
    // Primeiro argumento do .write é onde o dado começa e o outro é o quão grande ele é
    // Gravando o Salt ( sempre 16 byes )

    uint32_t user_id_size = user_id.size();

    ficheiro.write((char*)&user_id_size, sizeof(user_id_size)); // Escreve o tamanho do user_id para que o programa saiba quantos bytes ler para o user_id

    ficheiro.write(user_id.c_str(), user_id.size()); // Escreve o user_id em si

    ficheiro.write((char*)salt, SALT_SIZE);



    // gravando o IV ( sempre 16 byes)
    ficheiro.write((char*)iv, IV_SIZE);

    // Gravando o tamanho do próximo block, para que o programa saiba quando o dado acaba e possa começar a ler outro dado no mesmo cicli, salt, iv, tamanho, dado, salt, iv, tamanho, dado...
    // Gravamos isso para que o programa fique previsível e consiga avanaçar entre os blocos.
    uint64_t cipher_len = ciphered_data.size();
    ficheiro.write((char*)&cipher_len, sizeof(cipher_len));

    // Gravando os Dados
    ficheiro.write((char*)ciphered_data.data(), ciphered_data.size());

    ficheiro.close();
    return true;
    }
    return false;
}

std::vector<EncryptedBlock> read_all_blocks(const std::string& path) {
    std::ifstream file(path, std::ios::binary); // Abre o binário para leitura
    if (!file.is_open()) {return {};} // Checa se tem algum erro antes de rodar o loop

    std::vector<EncryptedBlock> result; // Declara o vetor que vai guardar os blocos lidos do arquivo


    while(true) {
        EncryptedBlock block; // Declara um bloco vazio para ser preenchido com os dados lidos do arquivo


        uint32_t user_id_size;
        file.read((char*)&user_id_size, sizeof(user_id_size));
        if (!file) break; // Checa se acabou o arquivo ou se tem algum erro de leitura, se sim, sai do loop

        block.user_id.resize(user_id_size); // Pré-aloca o espaço necessário para o user_id, baseado no tamanho lido do arquivo
        file.read(&block.user_id[0], user_id_size); // Lê o user_id do arquivo e armazena no bloco

        block.salt.resize(SALT_SIZE); // Pré-aloca o espaço para o salt, que tem um tamanho fixo de 16 bytes
        file.read((char*)block.salt.data(), SALT_SIZE); // Lê o salt do arquivo e armazena no bloco

        block.iv.resize(IV_SIZE); // Pré-aloca o espaço para o IV, que tem um tamanho fixo de 16 bytes
        file.read((char*)block.iv.data(), IV_SIZE); // Lê o IV do arquivo e armazena no bloco

        uint64_t cipher_len; // Lê o tamanho do próximo bloco de dados cifrados para saber quantos bytes ler a seguir
        file.read((char*)&cipher_len, sizeof(cipher_len)); // Checa se tem algum erro de leitura, se sim, sai do loop

        block.data.resize(cipher_len); // Pré-aloca o espaço para os dados cifrados, baseado no tamanho lido do arquivo
        file.read((char*)block.data.data(), cipher_len); // Lê os dados cifrados do arquivo e armazena no bloco

        result.push_back(block); // Adiciona o bloco preenchido ao vetor de resultados



    }

    return result;

}

}
