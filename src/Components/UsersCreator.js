import React, { useState, useEffect, useContext } from 'react'
import { Button } from 'antd'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import * as mutations from '../graphql/mutations'

const UserCreator = () => {

    const [commons, setData] = useState([
        { referencia: "nula", localidad: "ANTONIO NARIÑO", codane: "111001011908", nombreie: "COLEGIO ESCUELA NORMAL SUPERIOR DISTRITAL MARIA MONTESSORI(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001011908" },
        { referencia: "nula", localidad: "BARRIOS UNIDOS", codane: "111001010421", nombreie: "COLEGIO JORGE ELIECER GAITAN(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001010421" },
        { referencia: "nula", localidad: "BOSA", codane: "111001100064", nombreie: "COLEGIO ARGELIA(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001100064" },
        { referencia: "nula", localidad: "BOSA", codane: "111001098876", nombreie: "COLEGIO LA ESPERANZA(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001098876" },
        { referencia: "nula", localidad: "BOSA", codane: "111001098884", nombreie: "COLEGIO LOS NARANJOS(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001098884" },
        { referencia: "nula", localidad: "BOSA", codane: "111001104051", nombreie: "COLEGIO SAN IGNACIO(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001104051" },
        { referencia: "nula", localidad: "BOSA", codane: "111001100072", nombreie: "COLEGIO SANTIAGO DE LAS ATALAYAS(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001100072" },
        { referencia: "nula", localidad: "CIUDAD BOLIVAR", codane: "111001100013", nombreie: "COLEGIO BUENAVISTA(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001100013" },
        { referencia: "nula", localidad: "CIUDAD BOLIVAR", codane: "111001100021", nombreie: "COLEGIO GIMNASIO SABIO CALDAS(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001100021" },
        { referencia: "nula", localidad: "CIUDAD BOLIVAR", codane: "111001107115", nombreie: "COLEGIO JOSE MARIA VARGAS VILA(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001107115" },
        { referencia: "nula", localidad: "ENGATIVA", codane: "111001015806", nombreie: "COLEGIO JORGE GAITAN CORTES(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001015806" },
        { referencia: "nula", localidad: "ENGATIVA", codane: "111001109550", nombreie: "COLEGIO RODOLFO LLINAS(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001109550" },
        { referencia: "nula", localidad: "ENGATIVA", codane: "111001098931", nombreie: "COLEGIO TORQUIGUA(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001098931" },
        { referencia: "nula", localidad: "KENNEDY", codane: "111001098892", nombreie: "COLEGIO BELLAVISTA(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001098892" },
        { referencia: "nula", localidad: "KENNEDY", codane: "111001100056", nombreie: "COLEGIO JAIME HERNANDO GARZON FORERO(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001100056" },
        { referencia: "nula", localidad: "RAFAEL URIBE URIBE", codane: "111001098965", nombreie: "COLEGIO SANTA LUCIA(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001098965" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001102075", nombreie: "COLEGIO ENTRE NUBES SUR ORIENTAL(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001102075" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001016004", nombreie: "COLEGIO LA BELLEZA LOS LIBERTADORES(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001016004" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001098817", nombreie: "COLEGIO NUEVA ROMA(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001098817" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001098825", nombreie: "COLEGIO SAN VICENTE(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001098825" },
        { referencia: "nula", localidad: "SANTAFE", codane: "111001100030", nombreie: "COLEGIO LA GIRALDA(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001100030" },
        { referencia: "nula", localidad: "SUBA", codane: "111001098949", nombreie: "COLEGIO BILBAO(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001098949" },
        { referencia: "nula", localidad: "SUBA", codane: "111001800163", nombreie: "COLEGIO FILARMONICO JORGE MARIO BERGOGLIO(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001800163" },
        { referencia: "nula", localidad: "SUBA", codane: "111001104264", nombreie: "COLEGIO GERARDO MOLINA RAMIREZ(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001104264" },
        { referencia: "nula", localidad: "SUBA", codane: "111001104043", nombreie: "COLEGIO JOSE MARIA VELAZ(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001104043" },
        { referencia: "nula", localidad: "USAQUEN", codane: "111001098612", nombreie: "COLEGIO LA ESTRELLITA(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001098612" },
        { referencia: "nula", localidad: "USME", codane: "111001098850", nombreie: "COLEGIO CHUNIZA FAMACO(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001098850" },
        { referencia: "nula", localidad: "USME", codane: "111001102008", nombreie: "COLEGIO JUAN LUIS LONDOÑO(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001102008" },
        { referencia: "nula", localidad: "USME", codane: "111001100081", nombreie: "COLEGIO MIRAVALLE(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001100081" },
        { referencia: "nula", localidad: "USME", codane: "111001098841", nombreie: "COLEGIO SAN JOSE DE USME(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001098841" },
        { referencia: "nula", localidad: "USME", codane: "111001013935", nombreie: "COLEGIO SANTA MARTHA(IED)", incentivo: "Experiencias Exitosas en Permanencia escolar", id: "EEX_111001013935" },
        { referencia: "nula", localidad: "BOSA", codane: "111001013676", nombreie: "COLEGIO NUEVO CHILE(IED)", incentivo: "Modelos flexibles", id: "MEF_111001013676" },
        { referencia: "nula", localidad: "CIUDAD BOLIVAR", codane: "111001086801", nombreie: "COLEGIO CEDID CIUDAD BOLIVAR, (IED)", incentivo: "Modelos flexibles", id: "MEF_111001086801" },
        { referencia: "nula", localidad: "CIUDAD BOLIVAR", codane: "111001044385", nombreie: "COLEGIO GUILLERMO CANO ISAZA(IED)", incentivo: "Modelos flexibles", id: "MEF_111001044385" },
        { referencia: "nula", localidad: "ENGATIVA", codane: "111001108901", nombreie: "COLEGIO CHARRY(IED)", incentivo: "Modelos flexibles", id: "MEF_111001108901" },
        { referencia: "nula", localidad: "FONTIBON", codane: "111279000362", nombreie: "COLEGIO COSTA RICA(IED)", incentivo: "Modelos flexibles", id: "MEF_111279000362" },
        { referencia: "nula", localidad: "KENNEDY", codane: "111001011321", nombreie: "COLEGIO CARLOS ARTURO TORRES(IED)", incentivo: "Modelos flexibles", id: "MEF_111001011321" },
        { referencia: "nula", localidad: "KENNEDY", codane: "111001010910", nombreie: "COLEGIO NACIONAL NICOLAS ESGUERRA(IED)", incentivo: "Modelos flexibles", id: "MEF_111001010910" },
        { referencia: "nula", localidad: "PUENTE ARANDA", codane: "111001011274", nombreie: "COLEGIO ANDRES BELLO(IED)", incentivo: "Modelos flexibles", id: "MEF_111001011274" },
        { referencia: "nula", localidad: "RAFAEL URIBE URIBE", codane: "111001012611", nombreie: "COLEGIO BRAVO PAEZ(IED)", incentivo: "Modelos flexibles", id: "MEF_111001012611" },
        { referencia: "nula", localidad: "RAFAEL URIBE URIBE", codane: "111001011819", nombreie: "COLEGIO LICEO FEMENINO MERCEDES NARIÑO(IED)", incentivo: "Modelos flexibles", id: "MEF_111001011819" },
        { referencia: "nula", localidad: "RAFAEL URIBE URIBE", codane: "111001076376", nombreie: "COLEGIO MARRUECOS Y MOLINOS(IED)", incentivo: "Modelos flexibles", id: "MEF_111001076376" },
        { referencia: "nula", localidad: "RAFAEL URIBE URIBE", codane: "111001010928", nombreie: "COLEGIO RESTREPO MILLAN(IED)", incentivo: "Modelos flexibles", id: "MEF_111001010928" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001035530", nombreie: "COLEGIO JOSE FELIX RESTREPO(IED)", incentivo: "Modelos flexibles", id: "MEF_111001035530" },
        { referencia: "nula", localidad: "SANTAFE", codane: "111001010839", nombreie: "COLEGIO EXTERNADO NACIONAL CAMILO TORRES(IED)", incentivo: "Modelos flexibles", id: "MEF_111001010839" },
        { referencia: "nula", localidad: "SUBA", codane: "111769000174", nombreie: "COLEGIO FILARMONICO SIMON BOLIVAR(IED)", incentivo: "Modelos flexibles", id: "MEF_111769000174" },
        { referencia: "nula", localidad: "SUBA", codane: "111769003424", nombreie: "COLEGIO GERARDO PAREDES(IED)", incentivo: "Modelos flexibles", id: "MEF_111769003424" },
        { referencia: "nula", localidad: "USME", codane: "111850001428", nombreie: "COLEGIO ALMIRANTE PADILLA(IED)", incentivo: "Modelos flexibles", id: "MEF_111850001428" },
        { referencia: "nula", localidad: "BARRIOS UNIDOS", codane: "111001024830", nombreie: "COLEGIO FRANCISCO PRIMERO S.S. (IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001024830" },
        { referencia: "nula", localidad: "BARRIOS UNIDOS", codane: "111001028258", nombreie: "COLEGIO RAFAEL BERNAL JIMENEZ(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001028258" },
        { referencia: "nula", localidad: "BOSA", codane: "111001014109", nombreie: "COLEGIO BRASILIA - BOSA, (IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001014109" },
        { referencia: "nula", localidad: "BOSA", codane: "111001002909", nombreie: "COLEGIO CARLOS ALBAN HOLGUIN(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001002909" },
        { referencia: "nula", localidad: "BOSA", codane: "111001104329", nombreie: "COLEGIO CARLOS PIZARRO LEON GOMEZ(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001104329" },
        { referencia: "nula", localidad: "BOSA", codane: "111001107875", nombreie: "COLEGIO CIUDADELA EDUCATIVA DE BOSA, (IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001107875" },
        { referencia: "nula", localidad: "BOSA", codane: "111001107867", nombreie: "COLEGIO KIMI PERNIA DOMICO(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001107867" },
        { referencia: "nula", localidad: "BOSA", codane: "111001104183", nombreie: "COLEGIO LEONARDO POSADA PEDRAZA(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001104183" },
        { referencia: "nula", localidad: "CIUDAD BOLIVAR", codane: "111001035572", nombreie: "COLEGIO ACACIA II(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001035572" },
        { referencia: "nula", localidad: "CIUDAD BOLIVAR", codane: "111001044385", nombreie: "COLEGIO GUILLERMO CANO ISAZA(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001044385" },
        { referencia: "nula", localidad: "CIUDAD BOLIVAR", codane: "111001047678", nombreie: "COLEGIO PARAISO MIRADOR(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001047678" },
        { referencia: "nula", localidad: "FONTIBON", codane: "111279000125", nombreie: "COLEGIO VILLEMAR EL CARMEN(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111279000125" },
        { referencia: "nula", localidad: "KENNEDY", codane: "111001013129", nombreie: "COLEGIO CLASS(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001013129" },
        { referencia: "nula", localidad: "KENNEDY", codane: "111001015598", nombreie: "COLEGIO LAS AMERICAS(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001015598" },
        { referencia: "nula", localidad: "KENNEDY", codane: "111001013102", nombreie: "COLEGIO SAN PEDRO CLAVER(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001013102" },
        { referencia: "nula", localidad: "PUENTE ARANDA", codane: "111001011274", nombreie: "COLEGIO ANDRES BELLO(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001011274" },
        { referencia: "nula", localidad: "PUENTE ARANDA", codane: "111001014869", nombreie: "COLEGIO LUIS VARGAS TEJADA(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001014869" },
        { referencia: "nula", localidad: "RAFAEL URIBE URIBE", codane: "111001030015", nombreie: "COLEGIO ENRIQUE OLAYA HERRERA(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001030015" },
        { referencia: "nula", localidad: "RAFAEL URIBE URIBE", codane: "111001036765", nombreie: "COLEGIO JOSE MARTI(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001036765" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001012475", nombreie: "COLEGIO AGUAS CLARAS(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001012475" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001102016", nombreie: "COLEGIO ALDEMAR ROJAS PLAZAS(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001102016" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001027324", nombreie: "COLEGIO FLORENTINO GONZALEZ(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001027324" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001018341", nombreie: "COLEGIO FRANCISCO JAVIER MATIZ(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001018341" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001035530", nombreie: "COLEGIO JOSE FELIX RESTREPO(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001035530" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001018252", nombreie: "COLEGIO JOSE MARIA CARBONELL(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001018252" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001035602", nombreie: "COLEGIO JUAN EVANGELISTA GOMEZ(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001035602" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001018368", nombreie: "COLEGIO LA VICTORIA(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001018368" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001030066", nombreie: "COLEGIO MANUELITA SAENZ(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001030066" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001086789", nombreie: "COLEGIO RAFAEL NUÑEZ(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001086789" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001014176", nombreie: "COLEGIO SAN CRISTOBAL SUR(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001014176" },
        { referencia: "nula", localidad: "SAN CRISTOBAL", codane: "111001032280", nombreie: "COLEGIO TECNICO TOMAS RUEDA VARGAS(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001032280" },
        { referencia: "nula", localidad: "TUNJUELITO", codane: "111001009652", nombreie: "COLEGIO CENTRO INTEGRAL JOSE MARIA CORDOBA(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001009652" },
        { referencia: "nula", localidad: "TUNJUELITO", codane: "111001014214", nombreie: "COLEGIO CIUDAD DE BOGOTA(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001014214" },
        { referencia: "nula", localidad: "TUNJUELITO", codane: "111001012271", nombreie: "COLEGIO RAFAEL URIBE URIBE(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001012271" },
        { referencia: "nula", localidad: "USAQUEN", codane: "111001029955", nombreie: "COLEGIO AGUSTIN FERNANDEZ(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001029955" },
        { referencia: "nula", localidad: "USME", codane: "211001094832", nombreie: "COLEGIO CIUDAD DE VILLAVICENCIO(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_211001094832" },
        { referencia: "nula", localidad: "USME", codane: "111001104337", nombreie: "COLEGIO EDUARDO UMAÑA MENDOZA(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001104337" },
        { referencia: "nula", localidad: "USME", codane: "111850001576", nombreie: "COLEGIO FEDERICO GARCIA LORCA(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111850001576" },
        { referencia: "nula", localidad: "USME", codane: "111001016039", nombreie: "COLEGIO ORLANDO FALS BORDA(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001016039" },
        { referencia: "nula", localidad: "USME", codane: "111001107760", nombreie: "COLEGIO PAULO FREIRE(IED)", incentivo: "Progreso en Permanencia escolar", id: "PER_111001107760" },
        { referencia: "nula", localidad: "ANTONIO NARIÑO", codane: "111001012602", nombreie: "COLEGIO ATANASIO GIRARDOT(IED)", incentivo: "Disminución de la reprobación escolar", id: "DIS_111001012602" },
        { referencia: "nula", localidad: "CIUDAD BOLIVAR", codane: "111001044385", nombreie: "COLEGIO GUILLERMO CANO ISAZA(IED)", incentivo: "Disminución de la reprobación escolar", id: "DIS_111001044385" }
    ])
    const [red, setRed] = useState([
        { referencia: "nula", localidad: "Nodo01", codane: "Nodo01", nombreie: "Redes - Nodo 01", incentivo: "Red de Permanencia escolar", id: "RED_NODO_01" },
        { referencia: "nula", localidad: "Nodo02", codane: "Nodo02", nombreie: "Redes - Nodo 02", incentivo: "Red de Permanencia escolar", id: "RED_NODO_02" },
        { referencia: "nula", localidad: "Nodo03", codane: "Nodo03", nombreie: "Redes - Nodo 03", incentivo: "Red de Permanencia escolar", id: "RED_NODO_03" },
        { referencia: "nula", localidad: "Nodo04", codane: "Nodo04", nombreie: "Redes - Nodo 04", incentivo: "Red de Permanencia escolar", id: "RED_NODO_04" },
        { referencia: "nula", localidad: "Nodo05", codane: "Nodo05", nombreie: "Redes - Nodo 05", incentivo: "Red de Permanencia escolar", id: "RED_NODO_05" },
        { referencia: "nula", localidad: "Nodo06", codane: "Nodo06", nombreie: "Redes - Nodo 06", incentivo: "Red de Permanencia escolar", id: "RED_NODO_06" },
        { referencia: "nula", localidad: "Nodo07", codane: "Nodo07", nombreie: "Redes - Nodo 07", incentivo: "Red de Permanencia escolar", id: "RED_NODO_07" },
        { referencia: "nula", localidad: "Nodo08", codane: "Nodo08", nombreie: "Redes - Nodo 08", incentivo: "Red de Permanencia escolar", id: "RED_NODO_08" },
        { referencia: "nula", localidad: "Nodo09", codane: "Nodo09", nombreie: "Redes - Nodo 09", incentivo: "Red de Permanencia escolar", id: "RED_NODO_09" },
        { referencia: "nula", localidad: "Nodo10", codane: "Nodo10", nombreie: "Redes - Nodo 10", incentivo: "Red de Permanencia escolar", id: "RED_NODO_10" },
        { referencia: "nula", localidad: "Nodo11", codane: "Nodo11", nombreie: "Redes - Nodo 11", incentivo: "Red de Permanencia escolar", id: "RED_NODO_11" },
        { referencia: "nula", localidad: "Nodo12", codane: "Nodo12", nombreie: "Redes - Nodo 12", incentivo: "Red de Permanencia escolar", id: "RED_NODO_12" },
        { referencia: "nula", localidad: "Nodo13", codane: "Nodo13", nombreie: "Redes - Nodo 13", incentivo: "Red de Permanencia escolar", id: "RED_NODO_13" },
        { referencia: "nula", localidad: "Nodo14", codane: "Nodo14", nombreie: "Redes - Nodo 14", incentivo: "Red de Permanencia escolar", id: "RED_NODO_14" },
        { referencia: "nula", localidad: "Nodo15", codane: "Nodo15", nombreie: "Redes - Nodo 15", incentivo: "Red de Permanencia escolar", id: "RED_NODO_15" },
        { referencia: "nula", localidad: "Nodo16", codane: "Nodo16", nombreie: "Redes - Nodo 16", incentivo: "Red de Permanencia escolar", id: "RED_NODO_16" },
        { referencia: "nula", localidad: "Nodo17", codane: "Nodo17", nombreie: "Redes - Nodo 17", incentivo: "Red de Permanencia escolar", id: "RED_NODO_17" },
        { referencia: "nula", localidad: "Nodo18", codane: "Nodo18", nombreie: "Redes - Nodo 18", incentivo: "Red de Permanencia escolar", id: "RED_NODO_18" },
        { referencia: "nula", localidad: "Nodo19", codane: "Nodo19", nombreie: "Redes - Nodo 19", incentivo: "Red de Permanencia escolar", id: "RED_NODO_19" },
        { referencia: "nula", localidad: "Nodo20", codane: "Nodo20", nombreie: "Redes - Nodo 20", incentivo: "Red de Permanencia escolar", id: "RED_NODO_20" },
        { referencia: "nula", localidad: "Nodo21", codane: "Nodo21", nombreie: "Redes - Nodo 21", incentivo: "Red de Permanencia escolar", id: "RED_NODO_21" },
        { referencia: "nula", localidad: "Nodo22", codane: "Nodo22", nombreie: "Redes - Nodo 22", incentivo: "Red de Permanencia escolar", id: "RED_NODO_22" },
        { referencia: "nula", localidad: "Nodo23", codane: "Nodo23", nombreie: "Redes - Nodo 23", incentivo: "Red de Permanencia escolar", id: "RED_NODO_23" },
        { referencia: "nula", localidad: "Nodo24", codane: "Nodo24", nombreie: "Redes - Nodo 24", incentivo: "Red de Permanencia escolar", id: "RED_NODO_24" },
        { referencia: "nula", localidad: "Nodo25", codane: "Nodo25", nombreie: "Redes - Nodo 25", incentivo: "Red de Permanencia escolar", id: "RED_NODO_25" }

    ])
    const [auth, setAuth] = useState([
        { u: "RED_NODO_14", p: "QjKFCOf" },
        { u: "RED_NODO_15", p: "osJWYXA" },
        { u: "RED_NODO_16", p: "VcveAEu" },
        { u: "RED_NODO_17", p: "KrnNxhH" },
        { u: "RED_NODO_18", p: "nFhMoPQ" },
        { u: "RED_NODO_19", p: "FQoRfnK" },
        { u: "RED_NODO_20", p: "cMjmfda" },
        { u: "RED_NODO_21", p: "yLbwkrA" },
        { u: "RED_NODO_22", p: "vNRpcHG" },
        { u: "RED_NODO_23", p: "TcyUsWY" },
        { u: "RED_NODO_24", p: "SwvWsPy" },
        { u: "RED_NODO_25", p: "JeoTmNb" }
    ])

    const GenerateUsers = data => {
        data.map(async x => {
            let user = await API.graphql(graphqlOperation(mutations.createUser, {
                input: {
                    id: x.id,
                    codane: x.codane,
                    incentivo: x.incentivo,
                    localidad: x.localidad,
                    nombreie: x.nombreie,
                    referencia: x.referencia
                }
            }))
            await console.log(user)
        })
    }
    const AuthUsers = data => {
        data.map(async x => {
            let res = await Auth.signUp({
                username: x.u,
                password: x.p
            })
            await console.log(res)
        })
    }

    return (
        <div>
            <Button onClick={() => GenerateUsers(red)}>Generate Users</Button>
            <Button onClick={() => AuthUsers(auth)}>Auth Users</Button>
        </div>
    )
}

export default UserCreator

/*









*/