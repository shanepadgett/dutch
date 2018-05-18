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

                    let items = []

                    $.each(textOverlay["Lines"], function (index, value) {
                        // console.log(JSON.stringify(value,null,2))
                        console.log(index, value)

                        let text = ''

                        for (let i in value.Words) {
                            text += ` ${value.Words[i].WordText}`
                        }

                        let obj = {
                            index: index,
                            text: text.trim(),
                            top: value.MinTop,
                            left: value.Words[0].Left,
                            lineHeight: value.MaxHeight
                        }

                        items.push(obj)


                    })

                    items
                        .sort(function (a, b) {
                            return a.top - b.top
                        })

                    // for (let i = 0; i < arr.length - 1; i++) {
                    //     arr[i].line = marginalLineCount

                    //     if (arr[i + 1].yAnchorPoint - arr[i].yAnchorPoint >= arr[i].heightBounding / 2)
                    //         marginalLineCount++
                    // }

                    console.log(items) //here
                })
            }
        }
    })
})