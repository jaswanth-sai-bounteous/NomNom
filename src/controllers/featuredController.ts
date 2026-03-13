import { Request, Response } from "express";
import * as featuredService from "../services/featuredService";

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {

    const products = await featuredService.getFeaturedProducts();

    res.json({
      featured: products
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch featured products"
    });

  }
};

export const addFeaturedProduct = async (req: Request, res: Response) => {
  try {

    const { foodId } = req.body;

    const featured = await featuredService.addFeaturedProduct(foodId);

    res.status(201).json({
      message: "Product added to featured",
      featured
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to add featured product"
    });

  }
};