import { Request, Response } from "express";
import fs from "fs";
import { Hero } from "../_interfaces";
import { v4 as uuidv4 } from "uuid";

const filePath = "superheroes.json";
export const filterUserByObj = async (req: Request, res: Response) => {
  let { search, filterBy, limit, page } = req.query;

  if (!search) search = "";
  if (!filterBy) filterBy = "name";
  if (!limit) limit = "24";
  if (!page) page = "1";

  const parsedLimit = parseInt(limit as string);
  const parsedPage = parseInt(page as string);

  if (isNaN(parsedLimit) || isNaN(parsedPage)) {
    res.status(400).json({ error: "Invalid parameters" });
    return;
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);
    const filteredResults = jsonData.filter((item: any) =>
      item[filterBy as string]
        .toLowerCase()
        .includes((search as string).toLowerCase())
    );

    const startIndex = (parsedPage - 1) * parsedLimit;
    const endIndex = startIndex + parsedLimit;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);
    const totalResults = filteredResults.length;
    const totalPages = Math.ceil(totalResults / parsedLimit);
    const prevPage = parsedPage > 1 ? parsedPage - 1 : null;
    const nextPage = parsedPage < totalPages ? parsedPage + 1 : null;

    res.json({
      totalResults,
      data: paginatedResults,
      currentPage: parsedPage,
      totalPages,
      prevPage,
      nextPage,
    });
  });
};

export const getHeroById = async (req: Request, res: Response) => {
  const { id } = req.params;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);
    const hero = jsonData.filter((item: Hero) => item._id == id)[0];
    if (hero) {
      res.send(hero);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  });
};

export const addItem = async (req: Request, res: Response) => {
  const newItem: Hero = req.body;
  const newId = uuidv4();
  newItem._id = newId;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    let jsonData: Hero[] = [];
    if (data) {
      jsonData = JSON.parse(data) as Hero[];
    }

    const existingItem = jsonData.find(
      (item) =>
        item._id === newItem._id ||
        item.name.toLowerCase() === newItem.name.toLowerCase()
    );
    if (existingItem) {
      res
        .status(400)
        .json({ error: "Ya Existe un superheroe con este nombre" });
      return;
    }

    jsonData.unshift(newItem);

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(201).json(newItem);
    });
  });
};

export const updateItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedItem: Hero = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    let jsonData = JSON.parse(data);
    const index = jsonData.findIndex((item: any) => item.id === id);

    if (index === -1) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    jsonData[index] = { ...jsonData[index], ...updatedItem };

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.json(updatedItem);
    });
  });
};

export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    let jsonData = JSON.parse(data);
    const index = jsonData.findIndex((item: any) => item._id === id);

    if (index === -1) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    jsonData.splice(index, 1);

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.json({ message: "Item deleted successfully" });
    });
  });
};
