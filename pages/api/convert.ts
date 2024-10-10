import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import util from 'util'
import { v4 as uuidv4 } from 'uuid'
import pdf from 'pdf-parse'
import { Document, Packer, Paragraph, TextRun } from 'docx'

export const config = {
  api: {
    bodyParser: false,
  },
}

const mkdirPromise = util.promisify(fs.mkdir)
const readFilePromise = util.promisify(fs.readFile)
const writeFilePromise = util.promisify(fs.writeFile)

const tmpDir = path.join(process.cwd(), 'tmp')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않는 메소드입니다.' })
  }

  // 임시 디렉토리 생성
  try {
    await mkdirPromise(tmpDir, { recursive: true })
  } catch (error) {
    console.error('임시 디렉토리 생성 실패:', error)
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }

  const form = formidable({
    uploadDir: tmpDir,
    keepExtensions: true,
    filename: (name, ext, part, form) => {
      return `${uuidv4()}${ext}`
    },
  })

  try {
    const [fields, files] = await new Promise<
      [formidable.Fields, formidable.Files]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const file = Array.isArray(files.file) ? files.file[0] : files.file
    const convertTo = Array.isArray(fields.convertTo)
      ? fields.convertTo[0]
      : fields.convertTo

    if (!file || !convertTo) {
      return res
        .status(400)
        .json({ message: '파일 또는 변환 형식이 누락되었습니다.' })
    }

    const inputPath = file.filepath
    const outputPath = path.join(tmpDir, `${uuidv4()}.${convertTo}`)

    // PDF를 DOCX로 변환
    if (
      path.extname(inputPath).toLowerCase() === '.pdf' &&
      convertTo === 'docx'
    ) {
      const pdfBuffer = await readFilePromise(inputPath)
      const pdfData = await pdf(pdfBuffer)

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun(pdfData.text)],
              }),
            ],
          },
        ],
      })

      const docxBuffer = await Packer.toBuffer(doc)
      await writeFilePromise(outputPath, docxBuffer)
    } else {
      throw new Error('지원하지 않는 변환 형식입니다.')
    }

    const outputFile = await readFilePromise(outputPath)
    res.setHeader('Content-Type', `application/${convertTo}`)
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=converted.${convertTo}`,
    )
    res.send(outputFile)

    // 임시 파일 삭제
    fs.unlinkSync(inputPath)
    fs.unlinkSync(outputPath)
  } catch (error) {
    console.error('파일 변환 중 오류 발생:', error)
    res.status(500).json({ message: '파일 변환에 실패했습니다.' })
  } finally {
    // 임시 디렉토리 내의 모든 파일 삭제
    fs.readdir(tmpDir, (err, files) => {
      if (err) throw err

      for (const file of files) {
        fs.unlink(path.join(tmpDir, file), err => {
          if (err) throw err
        })
      }
    })
  }
}
