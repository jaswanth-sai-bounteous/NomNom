import { Request, Response } from "express";
import * as categoryService from "../services/categoryService";

export const getAllCategories = async (req: Request, res: Response) => {
  try {

    const categories = await categoryService.getAllCategories();

    res.json({ categories });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch categories"
    });

  }
};

export const getCategoryById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {

    const { id } = req.params;

    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.json(category);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch category"
    });

  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {

    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
      message: "Category created",
      category
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create category"
    });

  }
};