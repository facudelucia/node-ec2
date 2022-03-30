const express = require('express');
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream } = require('./s3')
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('<h1>Express Demo App</h1> <h4>Message: Success Facundo!</h4> <p>Version 1.1</p>');
})

app.get('/products', (req, res) => {
  res.send([
    {
      productId: '101',
      price: 100
    },
    {
      productId: '102',
      price: 150
    }
  ])
})

app.get('/images/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})

app.post('/images', upload.single('image'), async (req, res) => {
  const file = req.file
  console.log(file)

  // apply filter
  // resize 

 const result = await uploadFile(file)
  await unlinkFile(file.path)
  console.log(result)
  res.send({imagePath: `/images/${result.Key}`})
})

app.listen(port, ()=> {
  console.log(`Demo app is up and listening to port: ${port}`);
})
 