import app from "./app.js";

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server listening on Port ${process.env.PORT}`);
});
