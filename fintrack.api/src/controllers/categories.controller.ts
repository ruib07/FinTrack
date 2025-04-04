import { Request, Response } from "express";
import { Category } from "../models/category.model.js";
import { CategoryService } from "../services/category.service.js";

export class CategoriesController {
  static async getAll(req: Request, res: Response) {
    res.send(await new CategoryService().getAll());
  }

  static async getById(req: Request, res: Response) {
    let categoryId = req.params.id;

    res.send(await new CategoryService().getById(categoryId));
  }

  static async getByUserId(req: Request, res: Response) {
    let userId = req.params.userId;

    res.send(await new CategoryService().getByUserId(userId));
  }

  static async create(req: Request, res: Response) {
    const category = req.body as Category;

    const createdCategory = await new CategoryService().save(category);

    res.status(201).send({
      message: "Category created successfully.",
      id: createdCategory.id,
    });
  }

  static async update(req: Request, res: Response) {
    let categoryId = req.params.id;
    let category = req.body as Category;

    await new CategoryService().update(categoryId, category);

    res.send({
      message: "Category updated successfully.",
    });
  }

  static async delete(req: Request, res: Response) {
    let categoryId = req.params.id;

    await new CategoryService().delete(categoryId);
    res.status(204).end();
  }
}
