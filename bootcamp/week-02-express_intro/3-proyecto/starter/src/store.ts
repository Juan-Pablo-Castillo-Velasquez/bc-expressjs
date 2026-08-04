import type { Sponsor, CreateSponsorDto, UpdateSponsorDto } from './types.js';

// Store en memoria — simula una base de datos sin persistencia
const sponsorsList: Sponsor[] = []; // Cambiado a minúscula/plural para evitar conflictos de nombres
let nextId = 1;

// Retorna todos los patrocinadores del array
export function getAll(): Sponsor[] {
  return sponsorsList;
}

// Retorna el patrocinador con el id dado, o undefined si no existe
export function getById(id: number): Sponsor | undefined {
  return sponsorsList.find(sponsor => sponsor.id === id);
}

// Crea un nuevo patrocinador con un id autoincremental y lo guarda
// SOLUCIÓN: Se cambia el tipo de 'data' a CreateSponsorDto para evitar el error del ID
export function create(data: CreateSponsorDto): Sponsor {
  const newSponsor: Sponsor = { 
    id: nextId++, 
    ...data,
    createdAt: new Date() 
  };
  sponsorsList.push(newSponsor);
  return newSponsor;
}

// Actualiza el patrocinador con el id dado y lo retorna, o undefined si no existe
export function update(id: number, data: UpdateSponsorDto): Sponsor | undefined {
  const sponsorIndex = sponsorsList.findIndex(sponsor => sponsor.id === id);
  
  if (sponsorIndex === -1) {
    return undefined;
  }

  // Mezcla los datos existentes con los nuevos cambios recibidos
  sponsorsList[sponsorIndex] = {
    ...sponsorsList[sponsorIndex],
    ...data
  };

  return sponsorsList[sponsorIndex];
}

// Elimina el patrocinador con el id dado y retorna true, o false si no existe
export function remove(id: number): boolean {
  const sponsorIndex = sponsorsList.findIndex(sponsor => sponsor.id === id);
  
  if (sponsorIndex === -1) {
    return false;
  }

  sponsorsList.splice(sponsorIndex, 1);
  return true;
}
