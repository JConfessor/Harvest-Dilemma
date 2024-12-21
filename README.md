# Harvest Dilemma

## Descrição

"Harvest Dilemma" é um jogo sério focado em práticas agrícolas sustentáveis, uso responsável de agrotóxicos e manejo do solo. Nele, você controla um(a) fazendeiro(Gato) que precisa plantar, cuidar e colher diferentes culturas, vender a produção no cercado à direita da casa, e investir tanto na melhoria do solo quanto em insumos que podem facilitar a produção.

A proposta é incentivar reflexões sobre a sustentabilidade, o equilíbrio entre economia e cuidado ambiental, e a importância da preservação da saúde do solo e do meio ambiente.

## Como Jogar

### Movimentação e Interação

- **Movimento:** Use as setas do teclado (↑, ↓, ←, →) para mover o personagem.
- **Interação (Espaço):** Ao estar próximo de um objeto ou local de interesse (casa, semente, área de venda), pressione **Espaço** para interagir.

### Coleta de Sementes e Agrotóxicos

- **Coleta de Sementes:** As sementes ficam **acima de cada terreno de plantio**. Aproxime-se e pressione **Espaço** para obter a semente.
- **Escolha sobre Agrotóxico:** **No momento em que você pega a semente**, surgirá um diálogo perguntando se deseja utilizar agrotóxicos ou não.
  - **Usar Agrotóxico:** Acelera o crescimento da planta, mas degrada o solo.
  - **Não Usar Agrotóxico (Orgânico):** Mantém o solo mais saudável a longo prazo, porém o crescimento é mais lento.

### Plantar, Regar e Colher

- **Plantar (P):** Com a semente obtida, vá até o terreno designado para o plantio e pressione **P** para plantar.
- **Regar (R):** Após plantar, aproxime-se da muda e pressione **E** para regar. Isso inicia o ciclo de crescimento.
- **Colher (C):** Quando a planta estiver madura, pressione **R** próximo a ela para colher.

#### Auto Regar/Colher

Se você adquirir a melhoria de **Auto Regar/Colher** na loja, suas plantas serão automaticamente cuidadas e colhidas quando prontas, não sendo necessário apertar **E** ou **R**.

### Venda de Itens

- A venda de itens ocorre **no cercado à direita da casa**. Aproxime-se e pressione **Espaço** para vender suas colheitas, obtendo moedas.

### Entrar na Casa

- Aproxime-se da casa e pressione **Espaço** para entrar, podendo gerenciar estoques, visualizar informações e dados do seu progresso.

### Menu de Compras (G)

- Pressione **G** para abrir ou fechar a loja.
- Use as setas **↑/↓** para navegar entre as opções e **ENTER** para confirmar a compra.
- Pressione **ESC** para sair da loja sem comprar.

**Opções disponíveis:**

- **Auto Regar/Colher (1000 moedas):** Automatiza o cuidado e a colheita das plantas.
- **Cuidar do Solo (250 moedas, +10% solo):** Recupera significativamente a saúde do solo.
- **Adubo Especial (150 moedas, +5% solo):** Melhora um pouco a saúde do solo.
- **Sementes Especiais (200 moedas):** A próxima colheita rende frutos adicionais.

### Economia e Solo

- Você começa com 1500 moedas (caso não haja dados salvos).
- Cada produto colhido possui um valor de venda específico.
- O solo é afetado pelo uso de agrotóxicos e práticas agrícolas. Se chegar a 0% de saúde, não será mais possível plantar até que o solo seja recuperado via melhorias da loja.

## Instalação

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Baixe ou clone o repositório do jogo.
3. No diretório raiz do projeto, instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Abra o navegador no endereço indicado pelo terminal (ex: http://localhost:5173).

## Dicas de Jogo

- Escolha com cuidado o uso de agrotóxicos: eles aceleram resultados imediatos, mas podem tornar o solo estéril a longo prazo, exigindo gastos com recuperação.
- Plantar organicamente é mais lento, mas mantém o solo fértil e reduz custos futuros.
- Equilibre suas finanças entre melhorias, recuperação do solo e expansão da produção.
- Aproveite as sementes especiais para aumentar a produção quando realmente precisar.

## Objetivo Educacional

"Harvest Dilemma" não é apenas um jogo de fazenda: é um jogo sério, cujo propósito é conscientizar sobre a complexidade da agricultura sustentável. Ao lidar com decisões sobre produção, uso de agrotóxicos, manejo do solo e economia agrária, o jogador compreende que a busca por lucro imediato deve ser equilibrada com a preservação ambiental e a saúde do solo.
