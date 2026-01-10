export interface ObraDigital {
  idObraDigital: number;

  titulo: string;
  descripcion: string;
  fechaPublicacion: string;

  idAutor: number;
  idArchivoPrincipal: number | null;

  urlImagen?: string;

  autor?: { idAutor: number; nombreCompleto: string; seudonimo?: string };
  categoria?: { idCategoria: number; nombreCategoria: string };
  coleccion?: { idColeccion: number; nombreColeccion: string };
}
