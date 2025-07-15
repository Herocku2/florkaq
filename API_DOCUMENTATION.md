# API Documentation - FlorkaFun

## Base URL
- Development: `http://localhost:1337/api`
- GraphQL: `http://localhost:1337/graphql`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Tokens
- `GET /tokens` - Listar todos los tokens
- `GET /tokens/:id` - Obtener token específico
- `POST /tokens` - Crear nuevo token (admin)
- `PUT /tokens/:id` - Actualizar token (admin)
- `DELETE /tokens/:id` - Eliminar token (admin)

### Votaciones
- `GET /votaciones` - Listar votaciones
- `GET /votaciones/activas` - Obtener votaciones activas
- `POST /votaciones/:id/votar` - Emitir voto
- `GET /votaciones/:id/resultados` - Obtener resultados

### Usuarios
- `GET /usuarios/me` - Obtener perfil actual
- `PUT /usuarios/me` - Actualizar perfil
- `POST /usuarios/conectar-wallet` - Conectar wallet Solana

### Foros
- `GET /foros` - Listar foros
- `POST /foros` - Crear foro (moderador/admin)
- `GET /foros/:id` - Obtener foro específico

### Comentarios
- `GET /comentarios` - Listar comentarios
- `POST /comentarios` - Crear comentario
- `PUT /comentarios/:id` - Actualizar comentario
- `DELETE /comentarios/:id` - Eliminar comentario (moderador/admin)

### Paquetes
- `GET /paquetes` - Listar paquetes disponibles

### Solicitudes Token
- `GET /solicitudes-token` - Listar solicitudes
- `POST /solicitudes-token` - Crear solicitud
- `PUT /solicitudes-token/:id` - Actualizar solicitud (admin)

### Swaps
- `GET /swaps` - Listar swaps del usuario
- `POST /swaps` - Crear operación de swap
- `GET /swaps/:id` - Obtener swap específico

## GraphQL Schema

```graphql
type Token {
  id: ID!
  nombre: String!
  descripcion: String!
  mintAddress: String
  imagen: UploadFile
  fechaLanzamiento: DateTime!
  estado: ENUM_TOKEN_ESTADO!
  red: ENUM_TOKEN_RED!
}

type Votacion {
  id: ID!
  titulo: String!
  fechaInicio: DateTime!
  fechaFin: DateTime!
  activa: Boolean!
  candidatos: JSON!
  resultados: JSON
  totalVotos: Int
}

type Usuario {
  id: ID!
  nombre: String!
  email: String!
  walletSolana: String
  rol: ENUM_USUARIO_ROL!
  fechaRegistro: DateTime
  activo: Boolean
}
```

## Error Responses

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Error message",
    "details": {}
  }
}
```

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user