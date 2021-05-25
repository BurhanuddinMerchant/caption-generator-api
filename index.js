const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cp = require("child_process");
// configuring multer
let upload = multer({ dest: "image/" });

const port = process.env.PORT || 3000;
const app = new express();
app.use(express.json());
let exec_options = {
  cwd: null,
  env: null,
  shell: "powershell.exe",
  encoding: "utf8",
  timeout: 0,
  maxBuffer: 200 * 1024,
  killSignal: "SIGTERM",
};
app.post("/predict", upload.single("predict"), async (req, res) => {
  try {
    fs.rename("./image/" + req.file.filename, "./image/predict.jpg", (e) => {});
    cp.exec("py model.py", exec_options, (err, stdout, stderr) => {
      if (err) {
        throw "an error occured";
      }
      let list = stdout.split(" ");
      list.pop();
      res.send({ message: "successfull", data: list });
    });
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: "An error occured !!!!!!", e });
  }
});
app.listen(port, () => {
  console.log(`Server up on port ${port} : http://localhost:${port}`);
});
