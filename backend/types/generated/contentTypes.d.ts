import type { Attribute, Schema } from '@strapi/strapi';

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Attribute.String;
    registrationToken: Attribute.String & Attribute.Private;
    resetPasswordToken: Attribute.String & Attribute.Private;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    username: Attribute.String;
  };
}

export interface ApiActividadActividad extends Schema.CollectionType {
  collectionName: 'actividades';
  info: {
    description: 'Registro de actividades y logs del sistema';
    displayName: 'Actividad';
    pluralName: 'actividades';
    singularName: 'actividad';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::actividad.actividad',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    descripcion: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    entidadRelacionada: Attribute.String;
    fechaActividad: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    metadatos: Attribute.JSON;
    tipo: Attribute.Enumeration<
      ['voto', 'comentario', 'token_creado', 'swap', 'solicitud', 'moderacion']
    > &
      Attribute.Required;
    tipoEntidad: Attribute.Enumeration<
      ['token', 'votacion', 'foro', 'comentario', 'swap', 'solicitud']
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::actividad.actividad',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    usuario: Attribute.String & Attribute.Required;
  };
}

export interface ApiCandidatoCandidato extends Schema.CollectionType {
  collectionName: 'candidatos';
  info: {
    description: 'Candidatos para votaciones de tokens';
    displayName: 'Candidato';
    pluralName: 'candidatos';
    singularName: 'candidato';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    activo: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    categoria: Attribute.Enumeration<['meme', 'utility', 'gaming', 'defi']> &
      Attribute.DefaultTo<'meme'>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::candidato.candidato',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    descripcion: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    fechaCreacion: Attribute.DateTime & Attribute.Required;
    imagen: Attribute.Media<'images'>;
    mintAddress: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    nombre: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::candidato.candidato',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    votos: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
  };
}

export interface ApiComentarioComentario extends Schema.CollectionType {
  collectionName: 'comentarios';
  info: {
    description: 'Comentarios en foros y tokens';
    displayName: 'Comentario';
    pluralName: 'comentarios';
    singularName: 'comentario';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    aprobado: Attribute.Boolean & Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::comentario.comentario',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    fechaCreacion: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    foroRelacionado: Attribute.String;
    texto: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    tokenRelacionado: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::comentario.comentario',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    usuario: Attribute.String & Attribute.Required;
  };
}

export interface ApiForoForo extends Schema.CollectionType {
  collectionName: 'foros';
  info: {
    description: 'Foros de discusi\u00F3n para tokens';
    displayName: 'Foro';
    pluralName: 'foros';
    singularName: 'foro';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    activo: Attribute.Boolean & Attribute.DefaultTo<true>;
    creador: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::foro.foro', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    descripcion: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    fechaCreacion: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    moderado: Attribute.Boolean & Attribute.DefaultTo<false>;
    titulo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    tokenRelacionado: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::foro.foro', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiNewsNoticia extends Schema.CollectionType {
  collectionName: 'noticias';
  info: {
    description: 'Art\u00EDculos de noticias para el sistema NEWS';
    displayName: 'Noticia';
    pluralName: 'noticias';
    singularName: 'noticia';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    autor: Attribute.Relation<
      'api::news.noticia',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    categoria: Attribute.Enumeration<
      ['mercado', 'plataforma', 'comunidad', 'tecnologia', 'general']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'general'>;
    comentariosHabilitados: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    contenido: Attribute.RichText & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::news.noticia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    destacado: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    estado: Attribute.Enumeration<
      ['borrador', 'revision', 'publicado', 'archivado']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'borrador'>;
    fechaActualizacion: Attribute.DateTime;
    fechaCreacion: Attribute.DateTime & Attribute.Required;
    fechaPublicacion: Attribute.DateTime;
    imagen: Attribute.Media<'images'>;
    resumen: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    slug: Attribute.UID<'api::news.noticia', 'titulo'> & Attribute.Required;
    tags: Attribute.JSON & Attribute.DefaultTo<[]>;
    titulo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::news.noticia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    vistas: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
  };
}

export interface ApiPaquetePaquete extends Schema.CollectionType {
  collectionName: 'paquetes';
  info: {
    description: 'Paquetes de creaci\u00F3n de tokens';
    displayName: 'Paquete';
    pluralName: 'paquetes';
    singularName: 'paquete';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    activo: Attribute.Boolean & Attribute.DefaultTo<true>;
    beneficios: Attribute.JSON & Attribute.Required;
    caracteristicas: Attribute.JSON & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::paquete.paquete',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    nivel: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          max: 4;
          min: 1;
        },
        number
      >;
    nombre: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    precio: Attribute.Decimal & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::paquete.paquete',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProyectoNextProyectoNext extends Schema.CollectionType {
  collectionName: 'proyectos_next';
  info: {
    description: 'Pr\u00F3ximos proyectos de tokens a lanzar';
    displayName: 'Proyecto Next';
    pluralName: 'proyectos-next';
    singularName: 'proyecto-next';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    categoria: Attribute.Enumeration<['meme', 'utility', 'gaming', 'defi']> &
      Attribute.DefaultTo<'meme'>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::proyecto-next.proyecto-next',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    descripcion: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    destacado: Attribute.Boolean & Attribute.DefaultTo<false>;
    equipo: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    estado: Attribute.Enumeration<
      ['proximo', 'en-desarrollo', 'lanzado', 'cancelado']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'proximo'>;
    fechaLanzamiento: Attribute.DateTime & Attribute.Required;
    imagen: Attribute.Media<'images'>;
    nombre: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    progreso: Attribute.Integer &
      Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    sitioWeb: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    twitter: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::proyecto-next.proyecto-next',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRankingRanking extends Schema.CollectionType {
  collectionName: 'rankings';
  info: {
    description: 'Top 3 de tokens m\u00E1s votados de todos los tiempos';
    displayName: 'Ranking';
    pluralName: 'rankings';
    singularName: 'ranking';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    activo: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::ranking.ranking',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    fechaActualizacion: Attribute.DateTime & Attribute.Required;
    pagina: Attribute.Enumeration<['home', 'next']> &
      Attribute.Required &
      Attribute.DefaultTo<'home'>;
    posicion: Attribute.Integer &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMax<
        {
          max: 3;
          min: 1;
        },
        number
      >;
    token: Attribute.Relation<
      'api::ranking.ranking',
      'oneToOne',
      'api::token.token'
    >;
    totalVotos: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::ranking.ranking',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSolicitudTokenSolicitudToken extends Schema.CollectionType {
  collectionName: 'solicitudes_token';
  info: {
    description: 'Solicitudes de creaci\u00F3n de tokens';
    displayName: 'Solicitud Token';
    pluralName: 'solicitudes-token';
    singularName: 'solicitud-token';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    aprobado: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::solicitud-token.solicitud-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    datosToken: Attribute.JSON & Attribute.Required;
    estado: Attribute.Enumeration<['pendiente', 'aprobado', 'rechazado']> &
      Attribute.Required &
      Attribute.DefaultTo<'pendiente'>;
    fechaCreacion: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    fechaPago: Attribute.DateTime;
    notas: Attribute.Text;
    paquete: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::solicitud-token.solicitud-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    usuario: Attribute.String & Attribute.Required;
  };
}

export interface ApiSwapSwap extends Schema.CollectionType {
  collectionName: 'swaps';
  info: {
    description: 'Operaciones de intercambio de tokens';
    displayName: 'Swap';
    pluralName: 'swaps';
    singularName: 'swap';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cantidadDestino: Attribute.Decimal & Attribute.Required;
    cantidadOrigen: Attribute.Decimal & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::swap.swap', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    estado: Attribute.Enumeration<['pendiente', 'completado', 'fallido']> &
      Attribute.Required &
      Attribute.DefaultTo<'pendiente'>;
    fechaCompletado: Attribute.DateTime;
    fechaCreacion: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    tasaCambio: Attribute.Decimal & Attribute.Required;
    tokenDestino: Attribute.String & Attribute.Required;
    tokenOrigen: Attribute.String & Attribute.Required;
    txHashSolana: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::swap.swap', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    usuario: Attribute.String & Attribute.Required;
  };
}

export interface ApiTokenToken extends Schema.CollectionType {
  collectionName: 'tokens';
  info: {
    description: 'Tokens meme en la plataforma FlorkaFun';
    displayName: 'Token';
    pluralName: 'tokens';
    singularName: 'token';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::token.token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    descripcion: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    estado: Attribute.Enumeration<['lanzado', 'proximo', 'inactivo']> &
      Attribute.Required &
      Attribute.DefaultTo<'inactivo'>;
    fechaLanzamiento: Attribute.DateTime & Attribute.Required;
    imagen: Attribute.Media<'images'>;
    mintAddress: Attribute.String &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    nombre: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    red: Attribute.Enumeration<['solana-mainnet', 'solana-devnet']> &
      Attribute.Required &
      Attribute.DefaultTo<'solana-mainnet'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::token.token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUsuarioUsuario extends Schema.CollectionType {
  collectionName: 'usuarios';
  info: {
    description: 'Usuarios de la plataforma FlorkaFun';
    displayName: 'Usuario';
    pluralName: 'usuarios';
    singularName: 'usuario';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    activo: Attribute.Boolean & Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::usuario.usuario',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email & Attribute.Required & Attribute.Unique;
    fechaRegistro: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    nombre: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
    rol: Attribute.Enumeration<['usuario', 'moderador', 'admin']> &
      Attribute.Required &
      Attribute.DefaultTo<'usuario'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::usuario.usuario',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    walletSolana: Attribute.String &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
  };
}

export interface ApiVotacionVotacion extends Schema.CollectionType {
  collectionName: 'votaciones';
  info: {
    description: 'Votaciones para tokens meme en FlorkaFun';
    displayName: 'Votacion';
    pluralName: 'votaciones';
    singularName: 'votacion';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    activa: Attribute.Boolean & Attribute.DefaultTo<true>;
    candidatos: Attribute.Relation<
      'api::votacion.votacion',
      'manyToMany',
      'api::candidato.candidato'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::votacion.votacion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    descripcion: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    fechaFin: Attribute.DateTime & Attribute.Required;
    fechaInicio: Attribute.DateTime & Attribute.Required;
    titulo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Attribute.DefaultTo<'Votaci\u00F3n Semanal de Tokens Meme'>;
    tokenGanador: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    totalVotos: Attribute.Integer & Attribute.DefaultTo<0>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::votacion.votacion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiVotoVoto extends Schema.CollectionType {
  collectionName: 'votos';
  info: {
    description: 'Votos emitidos en votaciones';
    displayName: 'Voto';
    pluralName: 'votos';
    singularName: 'voto';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    candidatoVotado: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::voto.voto', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    fechaVoto: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    ipAddress: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::voto.voto', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    usuario: Attribute.String & Attribute.Required;
    votacion: Attribute.String & Attribute.Required;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    timezone: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    isEntryValid: Attribute.Boolean;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Attribute.String;
    caption: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ext: Attribute.String;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    height: Attribute.Integer;
    mime: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    size: Attribute.Decimal & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    url: Attribute.String & Attribute.Required;
    width: Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    type: Attribute.String & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    resetPasswordToken: Attribute.String & Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::actividad.actividad': ApiActividadActividad;
      'api::candidato.candidato': ApiCandidatoCandidato;
      'api::comentario.comentario': ApiComentarioComentario;
      'api::foro.foro': ApiForoForo;
      'api::news.noticia': ApiNewsNoticia;
      'api::paquete.paquete': ApiPaquetePaquete;
      'api::proyecto-next.proyecto-next': ApiProyectoNextProyectoNext;
      'api::ranking.ranking': ApiRankingRanking;
      'api::solicitud-token.solicitud-token': ApiSolicitudTokenSolicitudToken;
      'api::swap.swap': ApiSwapSwap;
      'api::token.token': ApiTokenToken;
      'api::usuario.usuario': ApiUsuarioUsuario;
      'api::votacion.votacion': ApiVotacionVotacion;
      'api::voto.voto': ApiVotoVoto;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
