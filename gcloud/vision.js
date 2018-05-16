const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient()
const bucketName = ''
const fileName = ''

client
  .textDetection(`gs://${bucketName}/${fileName}`)
  .then(results => {
    const detections = results[0].textAnnotations
    let arr = []
    let lineObj = []
    let lineArr = []
    let items = []
    let rightBlock = []
    let itemLines = []
    let rightLimit = null
    let resultDocument = null
    let marginalLineCount = 1

    detections.forEach(text => {
      let obj = {
        word: text.description,
        heightBounding: text.boundingPoly.vertices[2].y - text.boundingPoly.vertices[1].y,
        yAnchorPoint: text.boundingPoly.vertices[3].y,
        xBoundLeft: text.boundingPoly.vertices[3].x,
        xBoundRight: text.boundingPoly.vertices[2].x,
        line: null
      }
      arr.push(obj)
    })

    arr
      .sort(function (a, b) {
        if (a.yAnchorPoint === b.yAnchorPoint) {
          return a.xBoundRight - b.xBoundRight
        }
        return a.yAnchorPoint - b.yAnchorPoint
      })

    for (let i = 0; i < arr.length - 1; i++) {
      arr[i].line = marginalLineCount

      if (arr[i + 1].yAnchorPoint - arr[i].yAnchorPoint >= arr[i].heightBounding / 2)
        marginalLineCount++
    }

    arr
      .sort(function (a, b) {
        if (a.line === b.line) {
          return a.xBoundLeft - b.xBoundLeft
        }
        return a.line - b.line
      })

    for (let i in arr) {
      if (!arr[i].line) {
        rightLimit = arr[i].xBoundRight
        resultDocument = arr[i]
      }
    }

    for (let i in arr) {
      if (resultDocument.xBoundRight - arr[i].xBoundRight <= 25 && arr[i].word !== resultDocument.word && !(isNaN(parseFloat(arr[i].word.replace(/[^0-9\.|,]+/g, ''))))) {
        itemLines.push(arr[i].line)
        rightBlock.push(parseFloat(arr[i].word.replace(/,/g, '.').replace(/[^0-9\.]+/g, '')))
      }
    }

    for (let i in arr) {
      if (lineArr.indexOf(arr[i].line) === -1 && arr[i].line)
        lineArr.push(arr[i].line)
    }

    lineArr.map(item => lineObj.push({
      line: item,
      text: ''
    }))

    for (let i in lineObj) {
      for (let j in arr) {
        if (arr[j].line === lineObj[i].line)
          lineObj[i].text += `${arr[j].word} `
      }
    }

    for (let i in lineObj)
      lineObj[i].text = lineObj[i].text.trim()

    for (let i in lineObj) {
      let textArr = lineObj[i].text.split(' ')
      if (lineObj[i].text.indexOf(',') !== -1) {
        if (textArr[textArr.length - 1].indexOf(',') !== -1) {
          textArr[textArr.length - 1] = textArr[textArr.length - 1].replace(/,/g, '.').replace(/[^0-9\.]+/g, '')
          if (!(isNaN(parseFloat(textArr[textArr.length - 1])))) {
            let amount = parseFloat(textArr.splice(textArr.length - 1, 1).join(''))
            if (rightBlock.includes(amount) && itemLines.includes(lineObj[i].line)) {
              let obj = {
                line: lineObj[i].line,
                name: textArr.join(' ').replace(/"/g, ''),
                amount: amount
              }
              items.push(obj)
            }
          }
        }
      }

      if (lineObj[i].text.indexOf('.') !== -1) {
        textArr[textArr.length - 1] = textArr[textArr.length - 1].replace(/[^0-9\.]+/g, '')
        if (!(isNaN(parseFloat(textArr[textArr.length - 1])))) {
          let amount = parseFloat(textArr.splice(textArr.length - 1, 1).join(''))
          if (rightBlock.includes(amount) && itemLines.includes(lineObj[i].line)) {
            let obj = {
              line: lineObj[i].line,
              name: textArr.join(' ').replace(/"/g, ''),
              amount: amount
            }
            items.push(obj)
          }
        }
      }
    }
    //here send
  })
  .catch(err => {
    console.error('ERROR:', err)
  })