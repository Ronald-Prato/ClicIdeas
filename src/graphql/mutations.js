/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createFormCommon = `mutation CreateFormCommon($input: FormCommonInput!) {
  createFormCommon(input: $input) {
    correoResponsable
    downloadRoute
    id
    otraTematica
    personaResponsable
    telefonoResponsable
    tematicaProyecto
    tituloProyecto
    madeBy
  }
}
`;
export const createFormRed = `mutation CreateFormRed($input: FormRedInput!) {
  createFormRed(input: $input) {
    correoResponsable
    downloadRoute
    id
    iedDesignada
    iedNodo
    numeroNodo
    otraTematica
    personaResponsable
    telefonoResponsable
    tematicaProyecto
    tituloProyecto
    madeBy
  }
}
`;
export const createUser = `mutation CreateUser($input: UserInput!) {
  createUser(input: $input) {
    codane
    id
    incentivo
    localidad
    nombreie
    referencia
  }
}
`;
export const updateUser = `mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    codane
    id
    incentivo
    localidad
    nombreie
    referencia
  }
}
`;
export const updateFormCommon = `mutation UpdateFormCommon($id: ID!, $input: FormCommonUpdate!) {
  updateFormCommon(id: $id, input: $input) {
    correoResponsable
    downloadRoute
    id
    otraTematica
    personaResponsable
    telefonoResponsable
    tematicaProyecto
    tituloProyecto
    madeBy
  }
}
`;
export const updateFormRed = `mutation UpdateFormRed($id: ID!, $input: FormRedUpdate!) {
  updateFormRed(id: $id, input: $input) {
    correoResponsable
    downloadRoute
    id
    iedDesignada
    iedNodo
    numeroNodo
    otraTematica
    personaResponsable
    telefonoResponsable
    tematicaProyecto
    tituloProyecto
    madeBy
  }
}
`;
