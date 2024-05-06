/*
      Programa de Conexão Bluetooth com Arduino e App Android desenvolvido na plataforma APP inventor
      Pode ser expandido para mais troca dados entre celular e Arduino

      Componentes:
        - Arduino Mega 2560;
        - Módulo Bluetooth HC-05;
        - Resistor de 1k Ohms e 2k Ohms para converter 5V de saída do Arduino para 3.3V (Divisor de tensão);
        - Botão;
        - Led simples e resistor de 1k Ohms para o Led.

      Versão 1.0 - Versão inicial que recebe e envia dados - 27/Dez/2020

 *    * Criado por Cleber Borges - FunBots - @cleber.funbots  *     *

      Instagram: https://www.instagram.com/cleber.funbots/
      Facebook: https://www.facebook.com/cleber.funbots
      YouTube: https://www.youtube.com/channel/UCKs2l5weIqgJQxiLj0A6Atw
      Telegram: https://t.me/cleberfunbots

*/

// Biblioteca para Serial
#include <SoftwareSerial.h>

// Define Pinos
#define ledPin 12
#define buttonPin 8

// Cria variáveis
int state = 0;
int flagOFF = 0;
int flagON = 0;

void setup() {
  // Configura Pinos
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);

  // Pisca LED na inicalização
  digitalWrite(ledPin, LOW);
  delay(500);
  digitalWrite(ledPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);
  delay(500);
  digitalWrite(ledPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);

  // Inicia Seriais
  Serial.begin(9600);   // Serial para Monitor Arduino para debug
}

void loop() {

  // Checa se botão foi pressionado
  if (digitalRead(buttonPin) == LOW) {
    if (flagON == 0) {
      Serial.write("ON");
      flagON = 1;           // Altera estado da flag para evitar de ficar escrevendo repetidamente na serial BT
      flagOFF = 0;
    }
  } else if (flagOFF == 0) {  // Botão não foi pressionado
    Serial.write("OFF");
    flagOFF = 1;          // Altera estado da flag para evitar de ficar escrevendo repetidamente na serial BT
    flagON = 0;
  }

  // Se serial está com dados disponíveis, faz leitura
  if (Serial.available() > 0) {
    state = Serial.read();       // guarda leitura
  }

  // Checa dado recebido
  if (state == '1') {             // Se dado foi 1, acende LED
    digitalWrite(ledPin, HIGH);   // acende LED
    state = 0;                    // reseta variável de leitura
  } else if (state == '2') {      // Se dado foi 2, apaga LED
    digitalWrite(ledPin, LOW);    // apaga LED
    state = 0;                    // reseta variável de leitura
  }

}
