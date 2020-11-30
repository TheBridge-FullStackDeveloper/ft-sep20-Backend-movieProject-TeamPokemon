/* 
Función que se encarga de crear un nodo del DOM y devolver su referencia.
Los parámetros son:
    * tipoElemento (string): cadena del tipo de nodo a crear ("p", "div", etc.)
    * atributos (array bidimensional): array que define los atributos del nodo a crear.
      El array tiene tantos arrays dentro como atributos a insertar. Cada array consta de dos
      cadenas, la primera con el nombre del argumento y la segunda con el valor. Por ejemplo,
      si se desea añadir class="miclase" id="miID", se ha de escribir [["class", "miclase"],["id", "miID"]]
    * texto (string): cadena del texto del nodo. Útil si se trata de un nodo <p> por ejemplo

Esta factoría evita tener que realizar todas estas acciones repetidamente por todo el código cada vez
que haya que crear elementos del DOM. La función no inserta en el DOM, sólo crea el nodo con sus atributos
y texto y devuelve una referencia al mismo.
*/
export function Factoria(tipoElemento, atributos, texto)
{
    let nodoElemento = null;
    //VALIDACIÓN DE TIPO DE DATOS DE ENTRADA
    if ((tipoElemento === "") || (typeof tipoElemento !== "string")) {
        return nodoElemento;
    } else {
        if (typeof texto !== "string") {
            return nodoElemento;
        }
    }    

    //CREACIÓN DEL NODO DEL ELEMENTO
    nodoElemento = document.createElement(tipoElemento);
    //CREACIÓN DE LOS ATRIBUTOS
    atributos.forEach((dataAtributo) => {
                            if ((typeof dataAtributo[0] === "string") || (typeof dataAtributo[1] === "string"))
                            {
                                let nodoAtributo = document.createAttribute(dataAtributo[0]);
                                nodoAtributo.value = dataAtributo[1];
                                nodoElemento.setAttributeNode(nodoAtributo);
                            }
                        });
    //CREACIÓN DEL TEXTO DEL ELEMENTO
    let nodoTextoElemento = document.createTextNode(texto);
    nodoElemento.appendChild(nodoTextoElemento);
    //Se entrega el elemento creado
    return nodoElemento;
}