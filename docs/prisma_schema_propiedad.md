generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider  = "postgresql" 
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model tipo_caracteristica {
  id              Int            @id @default(autoincrement())
  nombre          String         @unique @db.VarChar(50) // e.g., "GENERAL", "SERVICIO", "AMENITIES"
  caracteristicas caracteristicas[]
}

model caracteristicas {
  id                    Int                          @id @default(autoincrement())
  nombre                String                       @unique @db.VarChar(100)
  tipo_id               Int                          // This is the new foreign key
  tipo_caracteristica   tipo_caracteristica          @relation(fields: [tipo_id], references: [id])
  propiedades_caracteristicas propiedades_caracteristicas[]
}

model citas {
  id                                  Int         @id @default(autoincrement())
  propiedad_id                        Int
  cliente_id                          Int?
  agente_id                           Int
  fecha_hora                          DateTime    @db.Timestamptz(6)
  comentarios                         String?
  estado                              String?     @default("pendiente") @db.VarChar(50)
  fecha_creacion                      DateTime?   @default(now()) @db.Timestamptz(6)
  usuarios_citas_agente_idTousuarios  usuarios    @relation("citas_agente_idTousuarios", fields: [agente_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "fk_citas_agente")
  usuarios_citas_cliente_idTousuarios usuarios?   @relation("citas_cliente_idTousuarios", fields: [cliente_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "fk_citas_cliente")
  propiedades                         propiedades @relation(fields: [propiedad_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "fk_citas_propiedad")
}

model contactos {
  id             Int          @id @default(autoincrement())
  nombre         String       @db.VarChar(100)
  email          String       @db.VarChar(255)
  telefono       String?      @db.VarChar(20)
  mensaje        String
  propiedad_id   Int?
  fecha_contacto DateTime?    @default(now()) @db.Timestamptz(6)
  estado         String?      @default("nuevo") @db.VarChar(50)
  propiedades    propiedades? @relation(fields: [propiedad_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "fk_contactos_propiedad")
}

model imagenes_propiedad {
  id           Int         @id @default(autoincrement())
  propiedad_id Int
  url_imagen   String      @db.VarChar(500)
  es_principal Boolean?    @default(false)
  orden        Int?        @default(0)
  propiedades  propiedades @relation(fields: [propiedad_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_imagenes_propiedad")
}

model propiedades {
  id                          Int                           @id @default(autoincrement())
  titulo                      String                        @db.VarChar(255)
  descripcion                 String?
  area_construida             Decimal?                      @db.Decimal(10, 2)
  area_total                  Decimal?                      @db.Decimal(10, 2)
  habitaciones                Int?
  banos                       Decimal?                      @db.Decimal(3, 1)
  garages                     Int?
  direccion                   String                        @db.VarChar(255)
  latitud                     Decimal?                      @db.Decimal(10, 8)
  longitud                    Decimal?                      @db.Decimal(11, 8)
  estado_propiedad            String?                       @default("disponible") @db.VarChar(50)
  fecha_publicacion           DateTime?                     @default(now()) @db.Timestamptz(6)
  fecha_actualizacion         DateTime?                     @default(now()) @db.Timestamptz(6)
  agente_id                   Int
  tipo_propiedad_id           Int
  ubicacion_id                Int
  superficie_lote             Decimal?                      @db.Decimal(10, 2)
  frente                      Decimal?                      @db.Decimal(10, 2)
  fondo                       Decimal?                      @db.Decimal(10, 2)
  citas                       citas[]
  contactos                   contactos[]
  imagenes_propiedad          imagenes_propiedad[]
  operaciones_propiedad       operaciones_propiedad[]
  usuarios                    usuarios                      @relation(fields: [agente_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "fk_propiedades_agente")
  tipos_propiedad             tipos_propiedad               @relation(fields: [tipo_propiedad_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "fk_propiedades_tipo")
  ubicaciones                 ubicaciones                   @relation(fields: [ubicacion_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "fk_propiedades_ubicacion")
  propiedades_caracteristicas propiedades_caracteristicas[]
}

model tipos_operacion {
  id                    Int                     @id @default(autoincrement())
  nombre               String                  @unique @db.VarChar(50) // "venta", "alquiler", "alquiler_temporal"
  descripcion          String?                 @db.VarChar(200)
  operaciones_propiedad operaciones_propiedad[]
}

model operaciones_propiedad {
  id                  Int         @id @default(autoincrement())
  propiedad_id        Int
  tipo_operacion_id   Int            // Referencia a tipos_operacion
  precio              Decimal     @db.Decimal(15, 2)
  moneda              String?     @default("ARS") @db.VarChar(5)
  disponible          Boolean?    @default(true)
  fecha_creacion      DateTime?   @default(now()) @db.Timestamptz(6)
  fecha_actualizacion DateTime?   @default(now()) @db.Timestamptz(6)
  propiedad           propiedades @relation(fields: [propiedad_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_operaciones_propiedad")
  tipo_operacion      tipos_operacion @relation(fields: [tipo_operacion_id], references: [id])

  @@index([propiedad_id], map: "idx_operaciones_propiedad_propiedad_id")
  @@index([tipo_operacion_id], map: "idx_operaciones_propiedad_tipo")
}

model propiedades_caracteristicas {
  propiedad_id      Int
  caracteristica_id Int
  caracteristicas   caracteristicas @relation(fields: [caracteristica_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_propiedades_caracteristicas_caracteristica")
  propiedades       propiedades     @relation(fields: [propiedad_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_propiedades_caracteristicas_propiedad")

  @@id([propiedad_id, caracteristica_id])
}

model tipos_propiedad {
  id          Int           @id @default(autoincrement())
  nombre      String        @unique @db.VarChar(100)
  propiedades propiedades[]
}

model ubicaciones {
  id            Int           @id @default(autoincrement())
  pais          String        @db.VarChar(100)
  provincia     String        @db.VarChar(100)
  ciudad        String        @db.VarChar(100)
  barrio        String?       @db.VarChar(100)
  codigo_postal String?       @db.VarChar(20)
  propiedades   propiedades[]
}

model usuarios {
  id                               Int           @id @default(autoincrement())
  nombre                           String        @db.VarChar(100)
  apellido                         String        @db.VarChar(100)
  email                            String        @unique @db.VarChar(255)
  password_hash                    String        @db.VarChar(255)
  telefono                         String?       @db.VarChar(20)
  rol                              String?      @default("cliente") @db.VarChar(50)
  fecha_creacion                   DateTime?     @default(now()) @db.Timestamptz(6)
  fecha_actualizacion              DateTime?     @default(now()) @db.Timestamptz(6)
  activo                           Boolean?      @default(true)
  citas_citas_agente_idTousuarios  citas[]       @relation("citas_agente_idTousuarios")
  citas_citas_cliente_idTousuarios citas[]       @relation("citas_cliente_idTousuarios")
  propiedades                      propiedades[]
}
