class Automato {
    constructor() {
        this.alfabeto = 'abcdefghijklmnopqrstuvwxyz'.split('');
        this.estados = ['q0'];
        this.estadosFinais = [];
        this.transicoes = {};
    }

    adicionarPalavra(palavra) {
        let estadoAtual = 'q0';
    
        for (let i = 0; i < palavra.length; i++) {
            const char = palavra[i];
            const proximoEstado = `q${this.estados.length}`;
    
            if (!this.transicoes[estadoAtual]) {
                this.transicoes[estadoAtual] = {};
            }
    
            if (!this.transicoes[estadoAtual][char]) {
                this.transicoes[estadoAtual][char] = proximoEstado;
                this.estados.push(proximoEstado);
                estadoAtual = proximoEstado;
            } else {
                estadoAtual = this.transicoes[estadoAtual][char];
            }
        }
    
        this.estadosFinais.push(estadoAtual);
        return true;
    }
    

    testarPalavra(palavra) {
        let estadoAtual = 'q0';
        
        for (const char of palavra) {
            if (!this.transicoes[estadoAtual] || !this.transicoes[estadoAtual][char]) {
                return false;
            }
            estadoAtual = this.transicoes[estadoAtual][char];
        }

        return this.estadosFinais.includes(estadoAtual);
    }
}