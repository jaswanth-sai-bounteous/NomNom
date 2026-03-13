import { Request, Response } from "express";

import * as productService from "../services/productService";

const parseNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseNumber(req.query.page, 1);
    const limit = parseNumber(req.query.limit, 9);
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : undefined;
    const categoryId =
      typeof req.query.categoryId === "string"
        ? req.query.categoryId.trim()
        : undefined;

    const result = await productService.getProducts({
      page,
      limit,
      search: search || undefined,
      categoryId: categoryId || undefined,
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const result = await productService.searchProducts(q);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed" });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const result = await productService.getProductsByCategory(id);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch products by category" });
  }
};
