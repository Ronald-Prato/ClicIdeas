/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAllFormCommon = `query GetAllFormCommon {
  getAllFormCommon {
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
export const getAllFormRed = `query GetAllFormRed {
  getAllFormRed {
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
export const getAllUsers = `query GetAllUsers {
  getAllUsers {
    codane
    id
    incentivo
    localidad
    nombreie
    referencia
  }
}
`;
export const getFilteredUsers = `query GetFilteredUsers($incentivo: String!) {
  getFilteredUsers(incentivo: $incentivo) {
    codane
    id
    incentivo
    localidad
    nombreie
    referencia
  }
}
`;
export const getFormCommon = `query GetFormCommon($id: ID!) {
  getFormCommon(id: $id) {
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
export const getFormRed = `query GetFormRed($id: ID!) {
  getFormRed(id: $id) {
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
export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    codane
    id
    incentivo
    localidad
    nombreie
    referencia
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModelTodoFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      codane
      id
      incentivo
      localidad
      nombreie
      referencia
    }
  }
}
`;
export const listFormsCommon = `query ListFormsCommon(
  $filter: ModelTodoFilterInput
  $limit: Int
  $nextToken: String
) {
  listFormsCommon(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
}
`;
export const listFormsRed = `query ListFormsRed(
  $filter: ModelTodoFilterInput
  $limit: Int
  $nextToken: String
) {
  listFormsRed(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
}
`;
