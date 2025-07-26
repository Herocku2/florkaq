import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
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
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
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
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
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
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
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
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
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
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
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
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
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
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
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
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
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
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
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
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
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
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
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
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiActividadActividad extends Schema.CollectionType {
  collectionName: 'actividades';
  info: {
    singularName: 'actividad';
    pluralName: 'actividades';
    displayName: 'Actividad';
    description: 'Registro de actividades y logs del sistema';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tipo: Attribute.Enumeration<
      ['voto', 'comentario', 'token_creado', 'swap', 'solicitud', 'moderacion']
    > &
      Attribute.Required;
    descripcion: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    usuario: Attribute.String & Attribute.Required;
    entidadRelacionada: Attribute.String;
    tipoEntidad: Attribute.Enumeration<
      ['token', 'votacion', 'foro', 'comentario', 'swap', 'solicitud']
    >;
    fechaActividad: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    metadatos: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::actividad.actividad',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::actividad.actividad',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCandidatoCandidato extends Schema.CollectionType {
  collectionName: 'candidatos';
  info: {
    singularName: 'candidato';
    pluralName: 'candidatos';
    displayName: 'Candidato';
    description: 'Candidatos para votaciones de tokens';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    nombre: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    descripcion: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    imagen: Attribute.Media;
    votos: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
      }> &
      Attribute.DefaultTo<0>;
    activo: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    fechaCreacion: Attribute.DateTime & Attribute.Required;
    categoria: Attribute.Enumeration<['meme', 'utility', 'gaming', 'defi']> &
      Attribute.DefaultTo<'meme'>;
    mintAddress: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::candidato.candidato',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::candidato.candidato',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiComentarioComentario extends Schema.CollectionType {
  collectionName: 'comentarios';
  info: {
    singularName: 'comentario';
    pluralName: 'comentarios';
    displayName: 'Comentario';
    description: 'Comentarios en foros y tokens';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    texto: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    usuario: Attribute.String & Attribute.Required;
    tokenRelacionado: Attribute.String;
    foroRelacionado: Attribute.String;
    aprobado: Attribute.Boolean & Attribute.DefaultTo<true>;
    fechaCreacion: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::comentario.comentario',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::comentario.comentario',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiForoForo extends Schema.CollectionType {
  collectionName: 'foros';
  info: {
    singularName: 'foro';
    pluralName: 'foros';
    displayName: 'Foro';
    description: 'Foros de discusi\u00F3n para tokens';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    titulo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    descripcion: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
    tokenRelacionado: Attribute.String & Attribute.Required;
    creador: Attribute.String & Attribute.Required;
    moderado: Attribute.Boolean & Attribute.DefaultTo<false>;
    activo: Attribute.Boolean & Attribute.DefaultTo<true>;
    fechaCreacion: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::foro.foro', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::foro.foro', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiNewsNoticia extends Schema.CollectionType {
  collectionName: 'noticias';
  info: {
    singularName: 'noticia';
    pluralName: 'noticias';
    displayName: 'Noticia';
    description: 'Art\u00EDculos de noticias para el sistema NEWS';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    titulo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    slug: Attribute.UID<'api::news.noticia', 'titulo'> & Attribute.Required;
    contenido: Attribute.RichText & Attribute.Required;
    resumen: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    categoria: Attribute.Enumeration<
      ['mercado', 'plataforma', 'comunidad', 'tecnologia', 'general']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'general'>;
    tags: Attribute.JSON & Attribute.DefaultTo<[]>;
    imagen: Attribute.Media;
    destacado: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    estado: Attribute.Enumeration<
      ['borrador', 'revision', 'publicado', 'archivado']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'borrador'>;
    fechaCreacion: Attribute.DateTime & Attribute.Required;
    fechaPublicacion: Attribute.DateTime;
    fechaActualizacion: Attribute.DateTime;
    autor: Attribute.Relation<
      'api::news.noticia',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    vistas: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
      }> &
      Attribute.DefaultTo<0>;
    comentariosHabilitados: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::news.noticia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::news.noticia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPaquetePaquete extends Schema.CollectionType {
  collectionName: 'paquetes';
  info: {
    singularName: 'paquete';
    pluralName: 'paquetes';
    displayName: 'Paquete';
    description: 'Paquetes de creaci\u00F3n de tokens';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    nombre: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    precio: Attribute.Decimal & Attribute.Required;
    caracteristicas: Attribute.JSON & Attribute.Required;
    nivel: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
        max: 4;
      }>;
    beneficios: Attribute.JSON & Attribute.Required;
    activo: Attribute.Boolean & Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::paquete.paquete',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'proyecto-next';
    pluralName: 'proyectos-next';
    displayName: 'Proyecto Next';
    description: 'Pr\u00F3ximos proyectos de tokens a lanzar';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    nombre: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    descripcion: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    imagen: Attribute.Media;
    fechaLanzamiento: Attribute.DateTime & Attribute.Required;
    estado: Attribute.Enumeration<
      ['proximo', 'en-desarrollo', 'lanzado', 'cancelado']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'proximo'>;
    destacado: Attribute.Boolean & Attribute.DefaultTo<false>;
    progreso: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
        max: 100;
      }> &
      Attribute.DefaultTo<0>;
    categoria: Attribute.Enumeration<['meme', 'utility', 'gaming', 'defi']> &
      Attribute.DefaultTo<'meme'>;
    equipo: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    sitioWeb: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    twitter: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::proyecto-next.proyecto-next',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'ranking';
    pluralName: 'rankings';
    displayName: 'Ranking';
    description: 'Top 3 de tokens m\u00E1s votados de todos los tiempos';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    posicion: Attribute.Integer &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMax<{
        min: 1;
        max: 3;
      }>;
    token: Attribute.Relation<
      'api::ranking.ranking',
      'oneToOne',
      'api::token.token'
    >;
    totalVotos: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }> &
      Attribute.DefaultTo<0>;
    fechaActualizacion: Attribute.DateTime & Attribute.Required;
    activo: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::ranking.ranking',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'solicitud-token';
    pluralName: 'solicitudes-token';
    displayName: 'Solicitud Token';
    description: 'Solicitudes de creaci\u00F3n de tokens';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    usuario: Attribute.String & Attribute.Required;
    paquete: Attribute.String & Attribute.Required;
    estado: Attribute.Enumeration<['pendiente', 'aprobado', 'rechazado']> &
      Attribute.Required &
      Attribute.DefaultTo<'pendiente'>;
    datosToken: Attribute.JSON & Attribute.Required;
    fechaPago: Attribute.DateTime;
    aprobado: Attribute.Boolean & Attribute.DefaultTo<false>;
    fechaCreacion: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    notas: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::solicitud-token.solicitud-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::solicitud-token.solicitud-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSwapSwap extends Schema.CollectionType {
  collectionName: 'swaps';
  info: {
    singularName: 'swap';
    pluralName: 'swaps';
    displayName: 'Swap';
    description: 'Operaciones de intercambio de tokens';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    tokenOrigen: Attribute.String & Attribute.Required;
    tokenDestino: Attribute.String & Attribute.Required;
    usuario: Attribute.String & Attribute.Required;
    cantidadOrigen: Attribute.Decimal & Attribute.Required;
    cantidadDestino: Attribute.Decimal & Attribute.Required;
    tasaCambio: Attribute.Decimal & Attribute.Required;
    estado: Attribute.Enumeration<['pendiente', 'completado', 'fallido']> &
      Attribute.Required &
      Attribute.DefaultTo<'pendiente'>;
    txHashSolana: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    fechaCreacion: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    fechaCompletado: Attribute.DateTime;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::swap.swap', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::swap.swap', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiTokenToken extends Schema.CollectionType {
  collectionName: 'tokens';
  info: {
    singularName: 'token';
    pluralName: 'tokens';
    displayName: 'Token';
    description: 'Tokens meme en la plataforma FlorkaFun';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    nombre: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 100;
      }>;
    descripcion: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    mintAddress: Attribute.String &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    imagen: Attribute.Media;
    fechaLanzamiento: Attribute.DateTime & Attribute.Required;
    estado: Attribute.Enumeration<['lanzado', 'proximo', 'inactivo']> &
      Attribute.Required &
      Attribute.DefaultTo<'inactivo'>;
    red: Attribute.Enumeration<['solana-mainnet', 'solana-devnet']> &
      Attribute.Required &
      Attribute.DefaultTo<'solana-mainnet'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::token.token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'usuario';
    pluralName: 'usuarios';
    displayName: 'Usuario';
    description: 'Usuarios de la plataforma FlorkaFun';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    nombre: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 100;
      }>;
    email: Attribute.Email & Attribute.Required & Attribute.Unique;
    walletSolana: Attribute.String &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    rol: Attribute.Enumeration<['usuario', 'moderador', 'admin']> &
      Attribute.Required &
      Attribute.DefaultTo<'usuario'>;
    fechaRegistro: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    activo: Attribute.Boolean & Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::usuario.usuario',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::usuario.usuario',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiVotacionVotacion extends Schema.CollectionType {
  collectionName: 'votaciones';
  info: {
    singularName: 'votacion';
    pluralName: 'votaciones';
    displayName: 'Votacion';
    description: 'Votaciones para tokens meme en FlorkaFun';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    titulo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Attribute.DefaultTo<'Votaci\u00F3n Semanal de Tokens Meme'>;
    descripcion: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    fechaInicio: Attribute.DateTime & Attribute.Required;
    fechaFin: Attribute.DateTime & Attribute.Required;
    activa: Attribute.Boolean & Attribute.DefaultTo<true>;
    tokenGanador: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    totalVotos: Attribute.Integer & Attribute.DefaultTo<0>;
    candidatos: Attribute.Relation<
      'api::votacion.votacion',
      'manyToMany',
      'api::candidato.candidato'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::votacion.votacion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
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
    singularName: 'voto';
    pluralName: 'votos';
    displayName: 'Voto';
    description: 'Votos emitidos en votaciones';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    usuario: Attribute.String & Attribute.Required;
    votacion: Attribute.String & Attribute.Required;
    candidatoVotado: Attribute.String & Attribute.Required;
    fechaVoto: Attribute.DateTime & Attribute.DefaultTo<'now'>;
    ipAddress: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::voto.voto', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::voto.voto', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'plugin::i18n.locale': PluginI18NLocale;
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
    }
  }
}
