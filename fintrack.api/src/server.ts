import app from "./app.js";

app.listen(process.env.NODE_PORT, () => {
  console.log(`Server listening on port ${process.env.NODE_PORT}`);
});
