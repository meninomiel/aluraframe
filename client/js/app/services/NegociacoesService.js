class NegociacoesService {

    constructor(){
        this._http = new HttpService();
        this._período = {
                semana: 'negociações da semana',
                semanaAnterior: 'negociações da semana anterior',
                semanaRetrasada: 'negociações da semana retrasada'
            };
    }

    Semana(){
          return this.ObterNegociacoes('negociacoes/semana', this._período.semana);
    }

    SemanaAnterior(){
          return this.ObterNegociacoes('negociacoes/anterior', this._período.semanaAnterior);
    }

    SemanaRetrasada(){
        return this.ObterNegociacoes('negociacoes/retrasada', this._período.semanaRetrasada);
    }

    ObterNegociacoes(url, descricao){
        
        return this._http.get(url).then(negociacoes => {
            return negociacoes.map(obj =>
                new Negociacao(
                    new Date(obj.data), 
                    obj.quantidade, 
                    obj.valor
                )
            );
        }).catch(erro => {
            console.log(erro);
            throw new Error(`Não foi possível adicionar as ${descricao}!`)
        });     
    }
}