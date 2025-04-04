import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";
import { Category } from "../models/category.model.js";
import { CategoryRepository } from "../repositories/category.repository.js";

export class CategoryService {
  private categoryRepository = new CategoryRepository();

  async getAll(): Promise<Category[]> {
    return this.categoryRepository.getAll();
  }

  async getById(id: string): Promise<Category> {
    const category = await this.categoryRepository.getById(id);

    if (!category) throw new NotFoundError("Category not found.");

    return category;
  }

  async getByUserId(userId: string): Promise<Category[]> {
    return this.categoryRepository.getByUserId(userId);
  }

  async save(category: Category): Promise<Category> {
    if (!category.name) throw new ValidationError("Name is required.");
    if (!category.type) throw new ValidationError("Type is required.");

    return await this.categoryRepository.save(category);
  }

  async update(
    id: string,
    updates: Partial<Category>
  ): Promise<Category | null> {
    const category = await this.categoryRepository.getById(id);

    if (!category) throw new NotFoundError("Category not found.");

    return this.categoryRepository.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.getById(id);

    if (!category) throw new NotFoundError("Category not found.");

    await this.categoryRepository.delete(id);
  }
}
