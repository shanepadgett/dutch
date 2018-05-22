$(document).ready(function () {
    $('html, body').animate({
        scrollTop: 0
    })
    $('[data-toggle="tooltip"]').tooltip()
})


// Render Receipt Image, Prepare Data For OCR
//-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-//
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

// Process OCR Receipt Image
//-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-//
$('.analyze-btn').on('click', function (event) {
    event.preventDefault()

    $('.progress-bar')
        .animate({
            width: '100%'
        }, function () {
            $('html, body').animate({
                scrollTop: ($('.item-container').offset().top) - 74
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
            let processingInMilliseconds = ocrParsedResult["ProcessingInMilliseconds"]
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

                        let text = ''

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

                    let receipt = {
                        location: null,
                        date: null,
                        items: [],
                        tax: 0,
                        tip: 0,
                        total: 0,
                        reconciled: false,
                        image: null
                    }
                    let amounts = []
                    let descriptions = []
                    let items = []

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

                    arr.forEach(item =>
                        item.text.replace(/[^0-9]/g, '').length > 1 &&
                        (item.text.indexOf('.') !== -1 || item.text.indexOf(',') !== -1) &&
                        !(isNaN(cleanFloat(item.text))) &&
                        item.text.indexOf('/') === -1 ?
                        amounts.push(item) : descriptions.push(item))

                    amounts.forEach(item => item.text = cleanFloat(item.text))

                    for (let i in amounts) {
                        for (let j in descriptions) {
                            if (Math.abs(descriptions[j].top - amounts[i].top) < amounts[i].lineHeight / 2) {

                                let taxKeywords = new RegExp('(tax|%|gst)', 'g')
                                let totalKeywords = new RegExp('(sub|total|subtotal|balance|due)', 'g')
                                let ignoreKeywords = new RegExp('(cash|change|payment)', 'g')

                                let obj = {
                                    name: descriptions[j].text,
                                    amount: amounts[i].text,
                                    quantity: 1,
                                    isTax: taxKeywords.test(descriptions[j].text.toLowerCase()),
                                    isTotal: totalKeywords.test(descriptions[j].text.toLowerCase())
                                }
                                if (!ignoreKeywords.test(descriptions[j].text.toLowerCase()))
                                    items.push(obj)
                            }
                        }
                    }
                    items.forEach(item => item.isTotal ? receipt.total = item.amount :
                        item.isTax ? receipt.tax = item.amount :
                        !item.isTotal && !item.isTax ? receipt.items.push(item) :
                        false
                    )

                    if (Object.keys(receipt.items).reduce(function (previous, key) {
                            return previous + receipt.items[key].amount
                        }, 0) + receipt.tax === receipt.total)
                        receipt.reconciled = true

                    receipt.location = arr[0].text
                    descriptions.forEach(item => item.text.indexOf('/') !== -1 ?
                        item.text.split('/').length === 3 ?
                        receipt.date = item.text :
                        false :
                        false
                    )

                    console.log(formData, receipt) //send obj, create hbs string
                    loadResults(receipt)

                    if (receipt.reconciled)
                        $('#total-amount').removeClass('is-invalid').addClass('is-valid')

                })
            }
        }
    })
})
//Add Items to OCR Results
//-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-//
let itemCount = 1

$('.add-item').on('click', function (event) {
    event.preventDefault()

    appendNewItem()
})

function loadResults(data) {
    if (data.location)
        $('#location').val(data.location)

    if (data.date)
        $('#date').val(data.date)

    if (data.tax)
        $('#tax-amount').val(data.tax)

    if (data.total)
        $('#total-amount').val(data.total)

    data.items.forEach(item => appendNewItem(item.name, item.quantity, makeFloat(item.amount)))
}

function appendNewItem(name, quantity, amount) {

    let inputThree = $('<input>')
        .attr({
            type: 'text',
            id: 'item-user',
            placeholder: 'Add User...'
        })
        .addClass('form-control')

    let groupTextThree = $('<div>')
        .addClass('input-group-text')
        .html('<i class="fas fa-user"></i>')

    let prependThree = $('<div>')
        .addClass('input-group-prepend')
        .append(groupTextThree)

    let inputGroupThree = $('<div>')
        .addClass('input-group')
        .append(prependThree, inputThree)

    let formGroupThree = $('<div>')
        .addClass('form-group col-md-6')
        .append(inputGroupThree)

    let inputTwo = $('<input>')
        .attr({
            type: 'text',
            id: 'item-amount',
            placeholder: '0.00'
        })
        .addClass('form-control text-right')

    let groupTextTwo = $('<div>')
        .addClass('input-group-text')
        .text('$')

    let prependTwo = $('<div>')
        .addClass('input-group-prepend')
        .append(groupTextTwo)

    let inputGroupTwo = $('<div>')
        .addClass('input-group')
        .append(prependTwo, inputTwo)

    let formGroupTwo = $('<div>')
        .addClass('form-group col-md-3 col-6 mb-3 mb-md-0')
        .append(inputGroupTwo)

    let inputOne = $('<input>')
        .attr({
            type: 'text',
            id: 'item-quantity',
            placeholder: '1'
        })
        .addClass('form-control text-right')

    let groupTextOne = $('<div>')
        .addClass('input-group-text')
        .text('#')

    let prependOne = $('<div>')
        .addClass('input-group-prepend')
        .append(groupTextOne)

    let inputGroupOne = $('<div>')
        .addClass('input-group')
        .append(prependOne, inputOne)

    let formGroupOne = $('<div>')
        .addClass('form-group col-md-3 col-6 mb-3 mb-md-0')
        .append(inputGroupOne)

    let row = $('<div>')
        .addClass('form-row')
        .append(formGroupOne, formGroupTwo, formGroupThree)

    let buttonName = $('<button>')
        .attr('type', 'button')
        .addClass('btn btn-outline-secondary remove-item-btn btn-block')
        .html('<i class="fas fa-times"></i>')

    let appendName = $('<div>')
        .addClass('input-group-append')
        .append(buttonName)

    let inputName = $('<input>')
        .attr({
            type: 'text',
            id: 'item-name',
            placeholder: 'Enter Item Name...'
        })
        .addClass('form-control')

    let groupTextName = $('<div>')
        .addClass('input-group-text')
        .text(itemCount++)

    let prependName = $('<div>')
        .addClass('input-group-prepend')
        .append(groupTextName)

    let inputGroupName = $('<div>')
        .addClass('input-group')
        .append(prependName, inputName, appendName)

    let formGroupName = $('<div>')
        .addClass('form-group col-12 mb-3')
        .append(inputGroupName)

    let nameRow = $('<div>')
        .addClass('form-row')
        .append(formGroupName)

    let td = $('<td>')
        .append(nameRow, row)

    let tr = $('<tr>')
        .addClass('item-wrapper')
        .append(td)

    if (name)
        inputName.val(name)

    if (quantity)
        inputOne.val(quantity)

    if (amount)
        inputTwo.val(amount)

    $('.items-form-block').append(tr)

}

$(document).on('click', '.remove-item-btn ', function () {
    $(this).closest('.item-wrapper').remove()
})

let globalOption = 'allocate'

$('.split-allocate-btn').on('click', function (event) { //here
    event.preventDefault()

    if (globalOption === $(this)[0].dataset.id)
        return

    globalOption = $(this)[0].dataset.id

    $('.split-allocate-btn')
        .addClass('btn-outline-secondary')
        .removeClass('btn-secondary')

    $(this)
        .removeClass('btn-outline-secondary')
        .addClass('btn-secondary')

})

$('.save-receipt-btn').on('click', function (event) { //here, also add validation, send object to server, route to user page, call user data, load friends, >receipts who's assigned, who's paid, circle w/ tooltips, pull items, >items & who you owe/paid, status - pending, complete, >activity
    event.preventDefault()

    let tax = $('#tax-amount').val().trim()
    let tip = $('#tip-amount').val().trim()

    if (tax === '' || isNaN(tax)) {
        $('#tax-amount').addClass('is-invalid rounded-right').removeClass('is-valid')
    } else {
        $('#tax-amount').removeClass('is-invalid').addClass('is-valid')
        $('#tax-amount').val(makeFloat(tax))
    }

    if (tip === '' || isNaN(tip)) {
        $('#tip-amount').addClass('is-invalid rounded-right').removeClass('is-valid')
    } else {
        $('#tip-amount').removeClass('is-invalid').addClass('is-valid')
        $('#tip-amount').val(makeFloat(tip))
    }


})

function makeFloat(input) {
    return input.toString().indexOf('.') === -1 ? `${input}.00` : input.toString().split('.').pop().length < 2 ? `${input}0` : input
}

$('.clickable-member-badge').on('click', function () {

    let text = $('.add-member-input').val().trim()

    console.log(text)

    if (text === '') {
        $('.add-member-input')
            .focus()
            .select()
        return
    }

    let button = $('<button>')
        .attr('type', 'button')
        .addClass('btn btn-light rounded-circle ml-4')
        .html('<i class="fas fa-times remove-group-member"></i>')

    let img = $('<img>')
        .attr('src', 'http://via.placeholder.com/60x60')
        .addClass('rounded-circle mr-4 add-member-badge')

    let span = $('<span>')
        .addClass('clickable btn')
        .append(img, text, button)


    let group = $('<div>')
        .addClass('form-group col-6')
        .append(span)

    let div = $('<div>')
        .addClass('form-row current-user-member-badge')
        .append(group)

    $('.group-members').append(div)

    $('.add-member-input').val('')
})

$(document).on('click', '.remove-group-member ', function () {
    $(this).closest('.current-user-member-badge').remove()
})