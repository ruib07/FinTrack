import bcrypt from "bcrypt";
import jwt from "jwt-simple";
import { ValidationError } from "../errors/validation.error.js";
import { User } from "../models/user.model.js";
import { UserRepository } from "../repositories/user.repository.js";
import { PasswordValidator } from "../utils/password-validator.js";

const secret = process.env.JWT_SECRET;

export class AuthenticationService {
  private userRepository = new UserRepository();

  async signin(email: string, password: string) {
    const user = await this.userRepository.getByEmail(email);

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new ValidationError("Invalid authentication.");

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency,
    };

    const token = jwt.encode(payload, secret!);
    return { token, user: payload };
  }

  async signup(user: Omit<User, "id">) {
    if (!user.name) throw new ValidationError("Name is required.");
    if (!user.email) throw new ValidationError("Email is required.");
    if (!user.currency) throw new ValidationError("Currency is required.");
    if (!user.password) throw new ValidationError("Password is required.");
    if (user.password) PasswordValidator.validate(user.password);

    const hashedPassword = await bcrypt.hash(user.password, 10);

    return await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });
  }
}
