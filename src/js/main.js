const automato = new Automato();
const interface = new Interface(automato);

function adicionarPalavra(palavra) {
    const input = document.getElementById('palavra-input');
    if (!palavra || interface.palavrasAceitas.includes(palavra)) {
        palavra = input.value.toLowerCase().trim();
    } 

    if (!palavra || interface.palavrasAceitas.includes(palavra)) {
        return;
    }

    automato.adicionarPalavra(palavra);
    interface.palavrasAceitas.push(palavra);
    input.value = '';

    interface.atualizarTabelaTransicoes();
    interface.atualizarPalavrasAceitas();
}

function gerarPalavraAleatoria() {
    const TAMANHO_MAX_PALAVRA = 5;
    let palavra = '';
    const alfabeto = automato.alfabeto;

    // Define o tamanho da palavra aleatória entre 1 e TAMANHO_MAX_PALAVRA
    const tamanho = Math.floor(Math.random() * TAMANHO_MAX_PALAVRA) + 1;

    // Constrói a palavra escolhendo letras aleatórias do alfabeto
    for (let i = 0; i < tamanho; i++) {
        const indiceAleatorio = Math.floor(Math.random() * alfabeto.length);
        palavra += alfabeto[indiceAleatorio];
    }

    // Adiciona a palavra à lista de palavras aceitas
    adicionarPalavra(palavra);
}

function testarPalavra() {
    const input = document.getElementById('teste-input');
    const palavra = input.value.toLowerCase().trim();

    if (!palavra) return;

    interface.estadoAtualTeste = 'q0';
    interface.celulasPercorridas = [];

    let reconhecida = true;
    for (const char of palavra) {
        if (!interface.processarLetraTeste(char)) {
            reconhecida = false;
            break;
        }
    }

    reconhecida = reconhecida && automato.estadosFinais.includes(interface.estadoAtualTeste);

    if (reconhecida) {
        interface.palavrasReconhecidas.push(palavra);
    } else {
        interface.palavrasNaoReconhecidas.push(palavra);
    }

    input.value = '';
    interface.atualizarPalavrasReconhecidas();
    interface.limparDestaquesTabela();
}

function exibirInputAlfabeto() {
    document.getElementById('alfabeto-input-container').style.display = 'block';
}

function atualizarAlfabeto() {
    const novoAlfabeto = document.getElementById('alfabeto-input').value;

    // Define o novo alfabeto, dividindo-o em um array de caracteres
    automato.alfabeto = novoAlfabeto.split('');

    // Salva a nova configuração no localStorage (opcional, para persistir entre recarregamentos)
    localStorage.setItem('automatoAlfabeto', JSON.stringify(automato.alfabeto));

    // Recarrega a página para aplicar o novo alfabeto
    location.reload();
}

function alfabetoPadrao() {
    const novoAlfabeto = 'abcdefghijklmnopqrstuvwxyz';
    automato.alfabeto = novoAlfabeto.split('');
    localStorage.setItem('automatoAlfabeto', JSON.stringify(automato.alfabeto));
    location.reload();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('palavra-input').addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            adicionarPalavra();
        }
    });

    document.getElementById('palavra-input').addEventListener('input', (e) => {
        const letra = e.target.value.slice(-1).toLowerCase();
        if (letra && !automato.alfabeto.includes(letra)) {
            e.target.value = e.target.value.slice(0, -1);
        }
    });

    document.getElementById('teste-input').addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            testarPalavra();
        }
    });

    document.getElementById('teste-input').addEventListener('keydown', (e) => {
        if (e.code === 'Backspace') {
            interface.erro = false;
            interface.celulasPercorridas.pop();
            const ultimoValor = interface.celulasPercorridas.pop();
            if (ultimoValor) {
                interface.estadoAtualTeste = ultimoValor.estado;
            }
            else {
                interface.estadoAtualTeste = "q0";
                interface.limparDestaquesTabela();
            }
        }
    });

    document.getElementById('teste-input').addEventListener('input', (e) => {
        const letra = e.target.value.slice(-1).toLowerCase();
        if (letra && automato.alfabeto.includes(letra)) {
            interface.processarLetraTeste(letra);
        }
        else {
            e.target.value = e.target.value.slice(0, -1);
        }
    });

    interface.atualizarTabelaTransicoes();
});


document.addEventListener('DOMContentLoaded', () => {
    const alfabetoSalvo = JSON.parse(localStorage.getItem('automatoAlfabeto'));
    if (alfabetoSalvo) {
        automato.alfabeto = alfabetoSalvo;
    }
    interface.atualizarTabelaTransicoes();  // Atualiza a tabela com o alfabeto carregado
});