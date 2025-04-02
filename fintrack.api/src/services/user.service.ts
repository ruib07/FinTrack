import { NotFoundError } from "../errors/not-found.error.js";
import { User } from "../models/user.model.js";
import { UserRepository } from "../repositories/user.repository.js";
import { PasswordValidator } from "../utils/password-validator.js";

export class UserService {
  private userRepository = new UserRepository();

  async getAll(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.getById(id);

    if (!user) throw new NotFoundError("User not found.");

    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.getById(id);

    if (!user) throw new NotFoundError("User not found.");
    if (updates.password) PasswordValidator.validate(updates.password);

    return this.userRepository.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.getById(id);

    if (!user) throw new NotFoundError("User not found.");

    await this.userRepository.delete(id);
  }
}
