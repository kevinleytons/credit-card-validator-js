
const ERRORES = require( './errores' )
const TARJETAS_CONFIG = require( './tarjetas' )

function checkCreditCard( cardnumber, type ) {

	let error = -1;

	const cardType = TARJETAS_CONFIG.find( t => t.id === type )

	// Si no existe configuracion de tarjeta
	if ( !cardType ) {
		error = 0;
		return false; 
 	}

	// Verificar que se ingresó un número de tarjeta
  if ( cardnumber.length == 0 )  {
		error = 1;
		return false; 
 	}

	// Eliminar espacios en blanco
  cardnumber = cardnumber.replace (/\s/g, "");

	// Verificar tipo dato numérico en input
  let cardNo = cardnumber
  let cardexp = /^[0-9]{13,19}$/;
  if ( !cardexp.exec(cardNo) ) { error = 2; return false; }

	// Validar modulo 10  ( si es necesario )
	if ( cardType.checkdigit ) {
		validateModule10( cardNo );
	}

	// Verificar si número es scammer
  if (cardNo == '5490997771092064') { error = 5; return false; }

	// Validaciones por tipos de tarjeta
	let prefix = { values: cardType.prefixes.split(","), valid: false }
	let length = { values: cardType.length.split(","), valid: false }

	// Validar que el prefijo del número ingresado corresponda al tipo de tarjeta
	prefix.values.forEach( p => {
		let exp = new RegExp( `^${p}` );
    if (exp.test (cardNo)) prefix.valid = true;
	})

	// Si el prefijo no es válido retornar error
  if ( !prefix.valid ) { error = 3; return false; }
	 
 	// Validar que largo de número sea correcto de acuerdo al tipo
	length.values.forEach( l => {
		if ( cardNo.length == l ) length.valid = true;
	});
	
	// Si el largo no es válido retornar error 
  if ( !length.valid ) { ccErrorNo = 4; return false; }
 
	// El número se encuentra con el formato correcto!
	return {
		error: ERRORES[error],
		valid: true,
		icon: cardType.icon
	};

}


function validateModule10( cardnumber ) {
	let checksum = 0;                                  // running checksum total
	let j = 1;                                         // takes value of 1 or 2

	// Procesar cada número desde la derecha
	let calc;
	for ( let i = cardnumber.length - 1; i >= 0; i-- ) {
	
		// Extraer el siguiente número y multiplicar por 1 o 2
		calc = Number( cardnumber.charAt(i) ) * j;
	
		// Si el resultado es mayor a 9, se suma 1 al total
		if ( calc > 9 ) {
			checksum = checksum + 1;
			calc = calc - 10;
		}
	
		// Sumar el calculo del digito a total
		checksum = checksum + calc;
	
		// Cambiar valor de multiplicador
		if ( j == 1 ) { j = 2 } else { j = 1 };
	} 

	// Si no es divisible por 10, retornar error
	if ( checksum % 10 != 0 )  { error = 3; return false; }
}


const isValid = checkCreditCard( '5500000000000004', 2 );
console.log(isValid);