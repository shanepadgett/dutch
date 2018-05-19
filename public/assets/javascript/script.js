$(document).ready(function () {
    $('html, body').animate({
        scrollTop: 0
    })
})

let file = null

function renderImg() {
    file = $("input:file")[0].files[0]

    let reader = new FileReader()
    reader.onloadend = function () {
        $('.img-preview').attr('src', reader.result)
    }

    if (file) {
        $('.file-input-label a').html(`<i class="fas fa-image fa-lg"></i> ${file.name}`)
        reader.readAsDataURL(file)
        $('.img-wrapper')
            .animate({
                height: '530px'
            }, function () {
                $('.img-preview').fadeIn()
            })
    }
}

$('.analyze-btn').on('click', function (event) {
    event.preventDefault()

    $('.progress-bar')
        .animate({
            width: '100%'
        }, function () {
            $('html, body').animate({
                scrollTop: ($('.item-container').offset().top) - 73
            }, 1000)
        })

    let formData = new FormData()

    formData.append("file", file)
    formData.append("language", "eng")
    formData.append("apikey", "302d46a6e388957")
    formData.append("isOverlayRequired", true)

    $.ajax({
        url: 'https://api.ocr.space/parse/image',
        data: formData,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (ocrParsedResult) {
            let parsedResults = ocrParsedResult["ParsedResults"]
            let ocrExitCode = ocrParsedResult["OCRExitCode"]
            let isErroredOnProcessing = ocrParsedResult["IsErroredOnProcessing"]
            let errorMessage = ocrParsedResult["ErrorMessage"]
            let errorDetails = ocrParsedResult["ErrorDetails"]
            let processingTimeInMilliseconds = ocrParsedResult["ProcessingTimeInMilliseconds"]
            if (parsedResults != null) {
                $.each(parsedResults, function (index, value) {
                    let exitCode = value["FileParseExitCode"]
                    let parsedText = value["ParsedText"]
                    let errorMessage = value["ParsedTextFileName"]
                    let errorDetails = value["ErrorDetails"]
                    let textOverlay = value["TextOverlay"]
                    let pageText = '';
                    switch (+exitCode) {
                        case 1:
                            pageText = parsedText
                            break
                        case 0:
                        case -10:
                        case -20:
                        case -30:
                        case -99:
                        default:
                            pageText += "Error: " + errorMessage
                            break
                    }

                    let arr = []

                    $.each(textOverlay["Lines"], function (index, value) {
                        // console.log(JSON.stringify(value,null,2))

                        let text = ''
                        let amounts = []
                        let descriptions = []
                        let items = []

                        for (let i in value.Words)
                            text += ` ${value.Words[i].WordText}`

                        let obj = {
                            index: index,
                            text: text.trim(),
                            top: value.MinTop,
                            left: value.Words[0].Left,
                            lineHeight: value.MaxHeight
                        }
                        arr.push(obj)
                    })

                    arr
                        .sort(function (a, b) {
                            return a.top - b.top
                        })

                    function cleanFloat(string) {
                        string = string
                            .replace(/ /g, '')
                            .replace(/I/g, '1')
                            .replace(/\,/g, '.')
                            .replace(/\$/g, '')

                        return parseFloat(string)
                    }

                    function cleanString(string) {

                    }

                    arr.forEach(item =>
                        item.text.replace(/[^0-9]/g, '').length > 1 &&
                        (item.text.indexOf('.') !== -1 || item.text.indexOf(',') !== -1) &&
                        !(isNaN(parseFloat(item.text))) &&
                        item.text.indexOf('/') === -1 ?
                        amounts.push(item) : descriptions.push(item))

                    amounts.forEach(item => item.text = cleanFloat(item.text))

                    for (let i in amounts) {
                        for (let j in descriptions) {
                            if (Math.abs(descriptions[j].top - amounts[i].top) < amounts[i].lineHeight / 2) {
                                let obj = {
                                    name: descriptions[j].text,
                                    amount: amounts[i].text,
                                    type: null
                                }
                                items.push(obj)
                            }
                        }
                    }

                    console.log(items) //here
                })
            }
        }
    })
})