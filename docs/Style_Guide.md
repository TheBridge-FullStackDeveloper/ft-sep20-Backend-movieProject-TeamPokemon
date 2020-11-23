# Guía de stilo

## ESLint

ESLint es un formateador de código, el cual permite escribir código con una guía de estilo determinada, obteniendo así un código con un estilo consistente como el uso de puntos y comas, llaves en la misma línea o la siguiente, etc

## Obligaciones

|Regla|Uso
|--|--
|Identación|Tabulaciones
|Strings|Comillas dobles
|Puntos y comas|Siempre
|Paréntesis icnecesarios|Nunca
|Uso de variables fuera de ámbito|Nunca
|Llaves|Siempre en la misma línea
|Else|Siempre en la misma línea que la llave
|Parámetros opcionales|Siempre al final
|Igualaciones|Siempre comparación estricta (=== y !==)
|Concatenación de strings|Siempre con template strings
|Nomenclatura de variables|camelCase
|Espacios en comas|uno después
|Espacios entre función e invocación|Nunca
|Funciones flecha|Cuerpo siempre en la misma línea
|Comentarios|Siempre en la línea anterior nunca en la misma
|Saltos de línea|UNIX (\n)
|Espacios entre funciones|Siempre una línea
|Encadenar propiedades|Máximo 2 en la mimsa línea
|Líneas vacías|máximo 2 seguidas
|Ternarios|Siempre que no estén anidados
|Propiedades en JSONs|Entrecomilladas

## Prohibiciones

|Regla|Prohibición
|--|--
|Espacios en RegEx|Más de uno
|Template strings|Cuando no se usen variables
|Alert y Console|Nunca se deberá de usar
|return en Contructor|Nunca
|Decimales flotantes|Nunca (.5, .7, etc)
|Labels|Nunca
|Ámbitos innecesarios|Nunca
|Expresiones no usadas|Nunca
|Yoda|Nunca
|Espacios al final de línea|Nunca
|Comas en el último elemento|Nunca
|Comparaciones por -0|Nunca
|Uso de delete|Nunca

## Recomendaciones

|Regla|Recomendación
|--|--
|Números mágicos|Preferiblemente no
|Declaración de variables|Preferiblemente al comienzo de un ámbito