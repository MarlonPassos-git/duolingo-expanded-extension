import fs from 'fs'

export function deleteFileOrDir(path: string, pathTemp = false) {
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isDirectory()) {
      const files = fs.readdirSync(path)
      if (!files.length) return fs.rmdirSync(path)
      for (const file in files) {
        const currentPath = path + '/' + files[file]
        if (!fs.existsSync(currentPath)) continue
        if (fs.lstatSync(currentPath).isFile()) {
          fs.unlinkSync(currentPath)
          continue
        }
        if (fs.lstatSync(currentPath).isDirectory() && !fs.readdirSync(currentPath).length) {
          fs.rmdirSync(currentPath)
        }
        else {
          this.deleteFileOrDir(currentPath, path)
        }
      }
      this.deleteFileOrDir(path)
    }
    else {
      fs.unlinkSync(path)
    }
  }
  if (pathTemp) this.deleteFileOrDir(pathTemp)
}
