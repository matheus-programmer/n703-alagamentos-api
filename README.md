# N703 - API de Alerta de Alagamentos em Fortaleza

##Equipe
Matheus Alves Medeiros – 2323804 

## 1. Objetivo do Projeto

Este projeto consiste em uma API RESTful desenvolvida em Node.js com Express, criada como parte da disciplina **N703 – Técnicas de Integração de Sistemas**. O objetivo é criar um sistema de alerta que monitora dados de chuva em Fortaleza, integrando-se a uma API de clima externa, e notifica moradores sobre riscos de alagamento via e-mail.

## 2. Descrição Funcional da Solução

O sistema funciona da seguinte forma:
1.  **Consulta de Clima**: A API possui um endpoint que busca dados meteorológicos em tempo real para a cidade de Fortaleza, utilizando a API da OpenWeather.
2.  **Armazenamento de Dados**: Cada consulta bem-sucedida de dados de chuva é registrada em um banco de dados MongoDB, criando um histórico que poderia ser usado para análises futuras.
3.  **Envio de Alertas**: Um segundo endpoint permite o disparo manual de alertas. Ao ser acionado, o sistema envia um e-mail (via SMTP) para uma lista pré-configurada de destinatários, informando sobre o risco de alagamento.
4.  **Segurança**: O acesso aos endpoints é protegido por um token de autenticação (Bearer Token) para garantir que apenas sistemas autorizados possam consultar dados e enviar alertas.

## 3. Arquitetura da API

A arquitetura segue um modelo de camadas para separar as responsabilidades, facilitando a manutenção e os testes.

```mermaid
graph TD
    A[Cliente API] -- Requisição HTTP --> B[Express Server];
    B -- /api/* --> C[Middleware de Autenticação];
    C -- Token Válido --> D[Router];

    D -- /chuva --> E[WeatherController];
    E -- Chama --> F[WeatherService];
    F -- GET --> G[OpenWeather API];
    G -- Resposta JSON --> F;
    F -- Retorna Dados --> E;
    E -- Salva no --> H[MongoDB];
    E -- Resposta JSON --> A;

    D -- /alerta --> I[AlertController];
    I -- Chama --> J[NotificationService];
    J -- Envia E-mail via --> K[Servidor SMTP];
    K -- Confirmação --> J;
    J -- Retorna Sucesso --> I;
    I -- Resposta JSON --> A;

    subgraph "Banco de Dados"
        H
    end

    subgraph "Serviços Externos"
        G
        K
    end
```

## 4. Endpoints da API

**URL Base**: `http://localhost:3000/api`

### 4.1. Consultar Previsão de Chuva

-   **Endpoint**: `GET /chuva`
-   **Descrição**: Retorna os dados de chuva e clima atuais para Fortaleza.
-   **Autenticação**: `Bearer Token` obrigatório no cabeçalho `Authorization`.
-   **Exemplo de Requisição (cURL)**:
    ```bash
    curl -X GET http://localhost:3000/api/chuva \
      -H "Authorization: Bearer seu-token-secreto-para-autenticacao"
    ```
-   **Exemplo de Resposta (Sucesso 200)**:
    ```json
    {
        "cidade": "Fortaleza",
        "pais": "BR",
        "temperatura": 27.99,
        "sensacao_termica": 31.99,
        "umidade": 89,
        "descricao_clima": "chuva leve",
        "precipitacao_1h_mm": 0.5,
        "timestamp": "2025-09-26T13:47:00.000Z"
    }
    ```

### 4.2. Enviar Alerta de Alagamento

-   **Endpoint**: `POST /alerta`
-   **Descrição**: Dispara um e-mail de alerta para os destinatários configurados.
-   **Autenticação**: `Bearer Token` obrigatório no cabeçalho `Authorization`.
-   **Corpo da Requisição (JSON - opcional)**:
    ```json
    {
        "subject": "ALERTA: Risco Elevado de Alagamento",
        "message": "Novas previsões indicam chuvas intensas nas próximas horas. Evite deslocamentos desnecessários."
    }
    ```
-   **Exemplo de Requisição (cURL)**:
    ```bash
    curl -X POST http://localhost:3000/api/alerta \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer seu-token-secreto-para-autenticacao" \
      -d '{ "message": "Teste de envio de alerta via API." }'
    ```
-   **Exemplo de Resposta (Sucesso 200)**:
    ```json
    {
        "message": "Alerta enviado com sucesso para 2 destinatário(s)."
    }
    ```

## 5. Instruções para Rodar o Projeto

1.  **Pré-requisitos**:
    -   Node.js (v18 ou superior)
    -   NPM
    -   MongoDB (rodando localmente ou uma instância na nuvem como o MongoDB Atlas)
    -   Git

2.  **Clonar o Repositório**:
    ```bash
    git clone [https://github.com/seu-usuario/n703-alagamentos-api.git](https://github.com/seu-usuario/n703-alagamentos-api.git)
    cd n703-alagamentos-api
    ```

3.  **Instalar Dependências**:
    ```bash
    npm install
    ```

4.  **Configurar Variáveis de Ambiente**:
    -   Renomeie o arquivo `.env.example` para `.env`.
    -   Abra o arquivo `.env` e preencha todas as variáveis necessárias:
        -   `OPENWEATHER_API_KEY`: Sua chave da API OpenWeather.
        -   `API_TOKEN`: Crie um token seguro para proteger sua API.
        -   `MONGO_URI`: A string de conexão do seu banco MongoDB.
        -   `SMTP_*`: As credenciais do seu servidor de e-mail.
        -   `ALERT_RECIPIENT_EMAIL`: Lista de e-mails para receber os alertas.

5.  **Iniciar o Servidor**:
    -   Para produção:
        ```bash
    npm start
        ```
    -   Para desenvolvimento (com hot-reload):
        ```bash
        npm run dev
        ```
    A API estará disponível em `http://localhost:3000`.

6.  **Rodar os Testes Unitários**:
    ```bash
    npm test
    ```

## 6. Relação com o ODS 11 – Cidades e Comunidades Sustentáveis

Este projeto se conecta diretamente à meta 11.5 do ODS 11, que visa reduzir significativamente o número de mortes e perdas econômicas causadas por desastres, incluindo os relacionados à água. Ao fornecer um sistema de alerta precoce para alagamentos, a solução ajuda a criar uma cidade mais resiliente e segura, permitindo que os cidadãos tomem medidas preventivas para proteger suas vidas e propriedades.
