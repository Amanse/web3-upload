import process from 'process'
import minimist from 'minimist'
import express from 'express'
import http from 'http'
import fs from 'fs'
import { Web3Storage, getFilesFromPath } from 'web3.storage'

const app = express()

app.post('/upload/', function(req, res) {
  const {url, fname} = req.params
  const path = `~/downloads/fname`
  const request = http.get(url, function(response) {
    if (response.statusCode === 200) {
      var file = fs.createWriteStream(path);
      response.pipe(file)
    }
  })
  main(path)
})

async function main (filePath) {
  //const args = minimist(process.argv.slice(2))
  const token = args.token | process.env.TOKEN

  if (!token) {
    return console.error('A token is needed. You can create one on https://web3.storage')
  }

  if (args._.length < 1) {
    return console.error('Please supply the path to a file or directory')
  }

  const storage = new Web3Storage({ token })
  const files = filePath

  for (const path of args._) {
    const pathFiles = await getFilesFromPath(path)
    files.push(...pathFiles)
  }

  console.log(`Uploading ${files.length} files`)
  const cid = await storage.put(files)
  console.log('Content added with CID:', cid)
	console.log(`Link to file https://dweb.link/ipfs/${cid}`) 
}

app.listen(8080)