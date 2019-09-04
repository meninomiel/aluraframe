class NegociacaoController {
    constructor(){
        let $ = document.querySelector.bind(document);

        this._inputData = $("#data");
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor");

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($("#negociacoesView")),
            "adiciona", "esvaziar", "ordena", "inverteOrdem"
        );
               
        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($("#mensagemView")),
            'texto'
        );

        this._ordemAtual = "";
    }

    importaNegociacoes() {
        let negociacoesService = new NegociacoesService();

        Promise.all([
            negociacoesService.Semana(),
            negociacoesService.SemanaAnterior(),
            negociacoesService.SemanaRetrasada()
        ]).then(negociacoes => {
            negociacoes
            .reduce((novoArray, array) => novoArray.concat(array), [])
            .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            this._mensagem.texto = "Negociações Importadas com Sucesso!";
        }).catch(erro =>
            this._mensagem.texto = erro);
    }

    adicionar(event) {
        event.preventDefault();
        this._listaNegociacoes.adiciona(this._criaNegociacao());
        this._mensagem.texto = "Negociação Adicionada com Sucesso!";
        this._limparCampos();
    }

    limpar(){
        this._listaNegociacoes.esvaziar();
        this._mensagem.texto = "Negociações Removidas com Sucesso!";
    }

    _criaNegociacao(){
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value, 
            this._inputValor.value
        );
    }

    _limparCampos(){
        this._inputData.value = "";
        this._inputQuantidade.value = "";
        this._inputValor.value = "";

        this._inputData.focus();
    }

    ordena(coluna){
        if(this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
        }
        this._ordemAtual = coluna; 
    }
}