export class CategoryDto {
  id: string;
  name: string;
  description?: string | null;

  constructor(id: string, name: string, description?: string | null) {
    this.id = id;
    this.name = name;
    this.description = description ?? null;
  }
}
