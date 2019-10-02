var ConnectionFactory = (function() {
    const stores = ['negociacoes'];
    const dbVersion = 4;
    const dbName = 'aluraframe';

    var connection = null;
    var close = null;

    return class ConnectionFactory {

        constructor(){
            throw new Error('ConnectionFactory é estático.')
        }

        static getConnection(){
            return new Promise((res, rej) => {
                let openRequest = window.indexedDB.open(dbName, dbVersion);

                openRequest.onupgradeneeded = e => {
                    this._createStores(e.target.result);
                };

                openRequest.onsuccess = e => {
                    if (!connection) connection = e.target.result;

                    close = connection.close.bind(connection);
                    connection.close = function () {
                        throw new Error("Não é possível fechar a conexão diretamente. Tente usar 'closeConnection'.")
                    }
                    res(connection);
                };

                openRequest.onerror = e => {
                    console.log(e.target.error)
                    rej(e.target.error.name);
                };

            });
        }

        static _createStores(connection){
            stores.forEach(store => {
                if (connection.objectStoreNames.contains(store)) 
                    connection.deleteObjectStore(store)
                
                connection.createObjectStore(store, {autoIncrement:true});
            });
        }

        static closeConnection(){
            
            if (connection){
                close();
                connection = null;
            }

        }
    }
})();