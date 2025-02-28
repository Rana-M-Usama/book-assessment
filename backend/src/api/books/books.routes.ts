import { Router } from "express";
import { BookController } from "./books.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createBookSchema } from "./books.schema";

const router = Router();
const bookController = new BookController();

router.post("/", validateRequest(createBookSchema), bookController.createBook);
router.get("/", bookController.getBooks);
router.put(
  "/:id",
  validateRequest(createBookSchema),
  bookController.updateBook
);
router.delete("/:id", bookController.deleteBook);

export default router;
