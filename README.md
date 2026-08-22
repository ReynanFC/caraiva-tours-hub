# Caraíva Tours Hub

Plataforma para centralizar a operação de uma agência de passeios em Caraíva. O sistema reúne catálogo, clientes, reservas, participantes, pagamentos, cancelamentos, usuários e indicadores em um único lugar, substituindo controles espalhados em conversas e processos manuais.

O repositório contém a aplicação completa:

- **backend:** API em Java 21 e Spring Boot 4, com PostgreSQL, Redis, Flyway, JWT, relatórios e eventos SSE;
- **frontend:** aplicação Angular 22, com PrimeNG, Tailwind CSS e Chart.js;
- **infraestrutura:** Dockerfiles para as aplicações e Docker Compose para frontend, backend, PostgreSQL e Redis;
- **CI/CD:** testes, build e publicação automática das imagens no Docker Hub a cada envio para a branch `main`.

## Funcionalidades

- autenticação e autorização por papéis (`ADMIN` e `EMPLOYEE`);
- gestão de usuários, categorias, passeios e locais de embarque;
- reservas com cliente, participantes, descontos e histórico de status;
- pagamentos de sinal, comprovantes e solicitações de reembolso;
- dashboards operacionais e financeiros atualizados via SSE;
- recuperação de senha por e-mail;
- geração de relatórios em PDF;
- cache e rate limiting distribuídos com Redis.

## Como executar com Docker Compose

Esta é a forma recomendada de executar o projeto. É necessário ter Docker com o plugin Docker Compose instalado.

### 1. Clone o repositório

```bash
git clone https://github.com/ReynanFC/caraiva-tours-hub.git
cd caraiva-tours-hub
```

### 2. Configure o ambiente

Crie um arquivo `.env` na raiz do repositório, ao lado de `docker-compose.yml`:

```dotenv
# Imagens publicadas no Docker Hub
DOCKERHUB_USERNAME=reynanfc
IMAGE_TAG=latest

# PostgreSQL usado pelo Compose
DB_URL=jdbc:postgresql://postgres-db:5432/caraiva_tours_hub
DB_USERNAME=postgres
DB_PASSWORD=troque-por-uma-senha-segura

# Use uma chave longa, aleatória e exclusiva do ambiente
JWT_SECRET_KEY=troque-por-uma-chave-jwt-longa-e-segura

# SMTP usado na recuperação de senha
EMAIL_USERNAME=seu-email@gmail.com
EMAIL_PASSWORD=senha-de-aplicativo-do-provedor

# Administrador inicial (opcional)
BOOTSTRAP_ADMIN_ENABLED=true
BOOTSTRAP_ADMIN_USERNAME=administrador
BOOTSTRAP_ADMIN_FULL_NAME=Administrador do Sistema
BOOTSTRAP_ADMIN_EMAIL=admin@empresa.com
```

O `.env` contém segredos e não deve ser versionado. Para o envio de e-mails com Gmail, use uma senha de aplicativo, não a senha comum da conta.

Quando `BOOTSTRAP_ADMIN_ENABLED=true`, o backend cria o administrador inicial caso ele ainda não exista. Para definir a primeira senha, use **Esqueci minha senha** na tela de login com o endereço informado em `BOOTSTRAP_ADMIN_EMAIL`. Depois do primeiro acesso, recomenda-se desativar o bootstrap.

### 3. Baixe e inicie os containers

```bash
docker compose pull
docker compose up -d --no-build
```

O `--no-build` garante que o Compose use as imagens baixadas do Docker Hub, sem tentar construí-las localmente.

Serviços disponíveis:

| Serviço | Endereço |
| --- | --- |
| Aplicação web | <http://localhost> |
| API | <http://localhost:8080> |
| Swagger UI | <http://localhost:8080/swagger-ui/index.html> |
| PostgreSQL | `localhost:5432` |
| Redis | `localhost:6379` |

Comandos úteis:

```bash
# Verificar os containers
docker compose ps

# Acompanhar os logs
docker compose logs -f

# Encerrar os serviços preservando os dados
docker compose down
```

Os dados do PostgreSQL e do Redis são mantidos em volumes Docker. O comando `docker compose down -v` também remove esses volumes e, portanto, apaga os dados locais.

## Imagens Docker

As imagens oficiais deste projeto são:

```text
reynanfc/caraiva-tours-backend:<tag>
reynanfc/caraiva-tours-frontend:<tag>
```

Recomenda-se a tag `latest` para obter a versão mais recente publicada a partir da `main`:

```bash
docker pull reynanfc/caraiva-tours-backend:latest
docker pull reynanfc/caraiva-tours-frontend:latest
```

Também são publicadas tags imutáveis no formato `sha-<commit>`. Para executar uma versão específica ou facilitar um rollback, defina a mesma tag no `.env`:

```dotenv
DOCKERHUB_USERNAME=reynanfc
IMAGE_TAG=sha-2ad0fb65610915072a27ce15294af3762e239183
```

> `docker pull` baixa uma imagem publicada. `docker push` envia uma imagem para o registry e é usado pelo fluxo de publicação, não por quem apenas deseja executar o projeto.

## Build local

Para construir o frontend, crie o arquivo local `frontend/caraiva-tours-web/src/environment/environment.ts`. Ele é ignorado pelo Git para não versionar a chave:

```typescript
export const environment = {
  imgbbApiKey: 'sua-chave-do-imgbb',
  primeUILicense: 'sua-chave-de-licenca-primeui',
};
```

Depois, construa as imagens a partir dos Dockerfiles do repositório:

```bash
DOCKERHUB_USERNAME=local IMAGE_TAG=dev docker compose up -d --build
```

## Testes

### Backend

```bash
cd backend/caraiva-tours-hub
./mvnw test
```

Os testes de integração usam Testcontainers para criar PostgreSQL e Redis isolados. Por isso, o Docker precisa estar em execução. As credenciais do `.env` da aplicação não são usadas por esses containers de teste.

### Frontend

Crie antes o arquivo `src/environment/environment.ts` mostrado na seção de build local. Em seguida:

```bash
cd frontend/caraiva-tours-web
npm install
npm test
npm run build
```

## Publicação contínua

Ao receber alterações na branch `main`, os workflows do GitHub Actions:

1. executam os testes e o build de cada aplicação;
2. constroem as imagens usando os Dockerfiles do backend e do frontend;
3. publicam no Docker Hub as tags `latest` e `sha-<commit>`.

Os workflows utilizam os secrets `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `IMGBB_API_KEY` e `PRIMEUI_KEY` configurados no repositório. `IMGBB_API_KEY` e `PRIMEUI_KEY` são usados para gerar o `environment.ts` durante o build do frontend. Esses valores pertencem ao processo de build/publicação no GitHub e não precisam ser copiados para o `.env` ao executar imagens já publicadas.

## Documentação

Há documentação mais detalhada nas subpastas do projeto:

- [backend e execução local da API](backend/caraiva-tours-hub/README.md);
- [frontend, arquitetura e scripts](frontend/caraiva-tours-web/README.md);
- [modelagem de dados e diagramas](docs/README.md);
- documentação específica de cada domínio junto ao respectivo código no backend e no frontend.

As versões exatas das dependências são mantidas no [`pom.xml`](backend/caraiva-tours-hub/pom.xml) e no [`package.json`](frontend/caraiva-tours-web/package.json).
