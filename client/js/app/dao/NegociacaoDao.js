class NegociacaoDao {
    constructor(connection){
        this._connection = connection;
        this._store = 'negociacoes'; //aponta para o indexDB
    }

    adiciona(negociacao){
        return new Promise((res, rej) => {
            let request = this._connection.transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .add(negociacao);

            request.onsuccess = e => {
                res();
            };
            request.onerror = e => {
                console.log(e.target.error);
                rej("Não foi possível adicionar a negociação");
            };
        });
    }

    listaTodos(){
        return new Promise((res, rej) => {
            let cursor = this._connection.transaction([this._store], 'readwrite')
                .objectStore('negociacoes')
                .openCursor();

            let negociacoes = [];

            cursor.onsuccess = e => {
                let atual = e.target.result;

                if (atual){
                    var dado = atual.value;
                    negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
                    atual.continue();
                } else {
                    res(negociacoes);
                }
            };

            cursor.onerror = e => {
                console.log(e.target.error.name);
                rej("Não foi possível listar negociações")
            }
        });
    }

    apagaTodos(){
        return new Promise((res, rej) => {
            let request = this._connection.transaction([this._store], 'readwrite')
                .objectStore('negociacoes')
                .clear();

            request.onsuccess = e => res("Negociações apagadas com sucesso");
            request.onerror = e => {
                console.log(e.target.error);
                rej("Não foi possível apagar negociações");
            };
        });
    }
}