class Interface {
    constructor(automato) {
        this.automato = automato;
        this.palavrasAceitas = [];
        this.palavrasReconhecidas = [];
        this.palavrasNaoReconhecidas = [];
        this.estadoAtualTeste = 'q0';
        this.celulasPercorridas = [];
        this.erro = false;
    }

    criarElemento(tag, texto) {
        const elemento = document.createElement(tag);
        elemento.textContent = texto;
        return elemento;
    }

    atualizarTabelaTransicoes() {
        const tabela = document.getElementById('tabela-transicoes');
        tabela.innerHTML = '';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.appendChild(this.criarElemento('th', 'Estado'));
        this.automato.alfabeto.forEach(letra => {
            headerRow.appendChild(this.criarElemento('th', letra));
        });
        thead.appendChild(headerRow);
        tabela.appendChild(thead);

        const tbody = document.createElement('tbody');
        this.automato.estados.forEach(estado => {
            const row = document.createElement('tr');
            const estadoCell = this.criarElemento('td', estado);
            if (this.automato.estadosFinais.includes(estado)) {
                estadoCell.classList.add('estado-final');
            }
            row.appendChild(estadoCell);

            this.automato.alfabeto.forEach(letra => {
                const transicao = this.automato.transicoes[estado]?.[letra] || '-';
                row.appendChild(this.criarElemento('td', transicao));
            });
            tbody.appendChild(row);
        });
        tabela.appendChild(tbody);
    }

    atualizarPalavrasAceitas() {
        const container = document.getElementById('palavras-aceitas');
        container.innerHTML = '';
        this.palavrasAceitas.forEach(palavra => {
            const span = this.criarElemento('span', palavra);
            span.classList.add('palavra-item', 'palavra-aceita');
            container.appendChild(span);
        });
    }

    atualizarPalavrasReconhecidas() {
        const reconhecidas = document.getElementById('palavras-reconhecidas');
        const naoReconhecidas = document.getElementById('palavras-nao-reconhecidas');
        
        reconhecidas.innerHTML = '';
        naoReconhecidas.innerHTML = '';

        this.palavrasReconhecidas.forEach(palavra => {
            const span = document.createElement('span');
            span.textContent = palavra;
            span.classList.add('palavra-item', 'palavra-reconhecida');
            reconhecidas.appendChild(span);
        });

        this.palavrasNaoReconhecidas.forEach(palavra => {
            const span = document.createElement('span');
            span.textContent = palavra;
            span.classList.add('palavra-item', 'palavra-nao-reconhecida');
            naoReconhecidas.appendChild(span);
        });

        this.celulasPercorridas = [];
        this.estadoAtualTeste = 'q0';
    }

    limparDestaquesTabela() {
        const celulas = document.querySelectorAll('td');
        celulas.forEach(celula => {
            celula.classList.remove('celula-atual', 'celula-percorrida', 'celula-invalida', 'estado-futuro');
        });
    }

    destacarCelula(estado, letra, invalida = false) {
        this.limparDestaquesTabela();
        
        const linhas = document.querySelectorAll('tr');
        linhas.forEach(linha => {
            const primeiraColuna = linha.querySelector('td');
            if (primeiraColuna && primeiraColuna.textContent === estado) {
                if (!invalida) {
                    primeiraColuna.classList.add('celula-atual');
                }
                
                const colunas = linha.querySelectorAll('td');
                const indiceLetra = this.automato.alfabeto.indexOf(letra) + 1;
                if (indiceLetra > 0) {
                    if (invalida) {
                        colunas[indiceLetra].classList.add('celula-invalida');
                        this.erro = true;
                    } else {
                        colunas[indiceLetra].classList.add('celula-atual');
                        
                        const estadoFuturo = colunas[indiceLetra].textContent;
                        linhas.forEach(linha => {
                            const tdEstado = linha.querySelector('td');
                            if (tdEstado && tdEstado.textContent === estadoFuturo) {
                                tdEstado.classList.add('estado-futuro');
                            }
                        })                        
                    }
                }
            }
        });

        this.celulasPercorridas.forEach(({estado, letra}) => {
            linhas.forEach(linha => {
                const primeiraColuna = linha.querySelector('td');
                if (primeiraColuna && primeiraColuna.textContent === estado) {
                    const colunas = linha.querySelectorAll('td');
                    const indiceLetra = this.automato.alfabeto.indexOf(letra) + 1;
                    if (indiceLetra > 0) {
                        colunas[indiceLetra].classList.add('celula-percorrida');
                        primeiraColuna.classList.add('celula-percorrida');
                    }
                }
            });
        });
        this.erro = false;
    }

    processarLetraTeste(letra) {
        if (!this.automato.transicoes[this.estadoAtualTeste]) {
            this.destacarCelula(this.estadoAtualTeste, letra, true);
            this.celulasPercorridas.push({estado: this.estadoAtualTeste, letra});
            return false;
        }

        const proximoEstado = this.automato.transicoes[this.estadoAtualTeste][letra];
        if (!proximoEstado) {
            this.destacarCelula(this.estadoAtualTeste, letra, true);
            this.celulasPercorridas.push({estado: this.estadoAtualTeste, letra});
            return false;
        }
        if (this.erro) {
            this.destacarCelula(this.estadoAtualTeste, letra, true);
        }
        else {
            this.destacarCelula(this.estadoAtualTeste, letra);
        }
        
        this.celulasPercorridas.push({estado: this.estadoAtualTeste, letra});
        this.estadoAtualTeste = proximoEstado;
        return true;
    }
}


