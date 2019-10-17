import React, { useState, useEffect, useContext } from 'react'
import { CSVLink, CSVDownload } from "react-csv";

const Csv = () => {


    const data = [
        { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
        { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
        { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
    ];
    // CÓDIGO DANE	IED	LOCALIDAD	CORREO ELECTRÓNICO	INCENTIVO AL QUE SE PRESENTA	DATOS CONTACTO	RECTOR	NOMBRES RESPONSABLES	NÚMERO ESTUDIANTES IED	NÚMERO DOCENTES IED	NÚMERO NODO	IED QUE PARTICIPAN EN NODO	IED DESIGNADA	PERSONA RESPONSABLE	CORREO RESPONSABLE	TELÉFONO RESPONSABLE	TÍTULO EXPERIENCIA	TEMÁTICA EXPERIENCIA	OTRA TEMÁTICA	CRITERIO PARTICIPACIÓN 1	CRITERIO PARTICIPACIÓN 2	CRITERIO PARTICIPACIÓN 3	CRITERIO PARTICIPACIÓN 4	CRITERIO PARTICIPACIÓN 5	JUSTIFICACIÓN PARTICIPACIÓN	CRITERIO INTEGRALIDAD 1	CRITERIO INTEGRALIDAD 2	CRITERIO INTEGRALIDAD 3	CRITERIO INTEGRALIDAD 4	JUSTIFICACIÓN INTEGRALIDAD	CRITERIO MEJORAMIENTO 1	CRITERIO MEJORAMIENTO 2	JUSTIFICACIÓN MEJORAMIENTO	CRITERIO OPORTUNIDAD 1	CRITERIO OPORTUNIDAD 2	JUSTIFICACIÓN OPORTUNIDAD	CRITERIO RECONOCIMIENTO 1	CRITERIO RECONOCIMIENTO 2	CRITERIO RECONOCIMIENTO 3	JUSTIFICACIÓN RECONOCIMIENTO	CRITERIO ADECUACIÓN 1	CRITERIO ADECUACIÓN 2	CRITERIO ADECUACIÓN 3	JUSTIFICACION ADECUACIÓN	CRITERIO SEGUIMIENTO 1	CRITERIO SEGUIMIENTO 2	JUSTIFICACIÓN SEGUIMIENTO	CRITERIO RETROALIMENTACIÓN 1	CRITERIO RETROALIMENTACIÓN 2	CRITERIO RETROALIMENTACIÓN 3	JUSTIFICACIÓN RETROALIMENTACIÓN	CRITERIO PARTICIPACION RED DE BUENAS PRACTICAS	DESCRIPCIÓN PARTICIPACION	CRITERIO SOCIALIZACION	DESCRIPCIÓN SOCIALIZACIÓN	CRITERIO ACTUALIZACION	DESCRIPCIÓN ACTUALIZACIÓN	PUNTAJE TOTAL EVALUACIÓN	PUNTOS FUERTES POSTULACIÓN	POTENCIAL IMPLEMENTACIÓN	PUNTOS DÉBILES POSTULACIÓN	IMPACTO EN EJECUCIÓN	ELEMENTOS INNOVADORES	JUSTIFICACIÓN ELEMENTOS INNOVADORES	COHERENCIA POSTULACIÓN VISITA	JUSTIFICACIÓN COHERENCIA POSTULACIÓN VISITA	COMPETENCIA EQUIPO	JUSTIFICACIÓN COMPETENCIA EQUIPO	ESTÁNDARES DE CALIDAD	JUSTIFICACIÓN ESTÁNDARES DE CALIDAD	IMPACTO EN LA COMUNIDAD	JUSTIFICACIÓN IMPACTO EN LA COMUNIDAD	RECIBE RECONOCIMIENTO	JUSTIFICACIÓN RECIBE RECONOCIMIENTO	PUNTAJE TOTAL VISITA	EVALUADOR	RUTA ARCHIVO	RUTA ARCHIVO EVALUACION
    return (
        <div className=''>
            <CSVLink data={data}>Download me</CSVLink>

            <CSVDownload data={data} target="_blank" />
        </div>
    )
}

export default Csv