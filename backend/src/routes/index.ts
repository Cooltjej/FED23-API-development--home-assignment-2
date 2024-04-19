import express, { Request, Response } from "express";

const router = express.Router();


/**
 * GET /
 */
router.get("/", (req: Request, res: Response) => {
  res.send({
    message: "I am a parrot - echo, echo 🦜 https://www.youtube.com/watch?v=vZw35VUBdzo",
  });
});

/**
 * Catch-all route handler
 */
router.use((req: Request, res: Response) => {
  // Respond with 404 and a message in JSON-format
  res.status(404).send({
    message: "Not Found",
  });
});

export default router;