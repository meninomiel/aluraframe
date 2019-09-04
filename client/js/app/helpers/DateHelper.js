class DateHelper {

    static textoParaData(texto) {   
        if(!/\d{2}\/\d{2}\/\d{4}/.test(texto)) throw new Error("Data deve estar no formato dd/mm/aaaa");
           
        return new Date(
            ...texto
                .split("/")
                .map((item, indice) => item - indice % 2)
        );
    }

    static dataParaTexto(data){
        
        return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`
    }
}