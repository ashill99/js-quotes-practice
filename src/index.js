const quotesContainer = document.querySelector("ul#quote-list")

const url = "http://localhost:3000/quotes"
const urlLikes = "http://localhost:3000/quotes?_embed=likes"
const likesUrl = "http://localhost:3000/likes"

// all the likes 

fetch(urlLikes)
.then(response => response.json())
.then(quotesData => {
    quotesData.forEach(function(quotesObject) {
    renderNewQuotes(quotesObject)
    });
})

const likeButton = document.querySelector("button.btn-success")
const newQuoteForm = document.querySelector("form#new-quote-form")

// new quote form 

newQuoteForm.addEventListener('submit', function(event) {

    event.preventDefault()

    const quoteInput = event.target.quote.value 
    const authorInput = event.target.author.value 
    const newQuoteObject = {
        quote: quoteInput,
        author: authorInput,
        likes: 0
    }

    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newQuoteObject)
    })
    .then(response => response.json())
    .then(newQuoteObject => {
        renderNewQuotes(newQuoteObject)
    })
})

// deletes quote 

const quoteDiv = document.querySelector("ul#quote-list")

quoteDiv.addEventListener("click", function(event) {
    // console.log("clicked")
    if(event.target.matches(".btn-danger")) {
        // console.log('clicked delete')
        const id = event.target.dataset.id 
        fetch(`${likesUrl}/${id}`, {
            method: 'DELETE'
        })
        .then((response) => response.json())
        .then((data) => {
            const liToDelete = event.target.closest('li')
            liToDelete.remove()
        })
    }
})

// likes button 

quoteDiv.addEventListener('click', function(event) {
    if(event.target.matches('.btn-success')) {
        // console.log('like clicked')
        const li = event.target.closest("li.quote-card")
        const likeBtn = event.target.closest("button.btn-success")
        const span = likeBtn.querySelector('span')
        const newLikes = parseInt(span.textContent) + 1
        const id = li.dataset.id 

        fetch(`${url}/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({likes: newLikes})
        })
        .then(response => response.json())
        .then(data => {
            // debugger
            span.textContent = `${data.likes}`
        })
    }
})

// renders quote 

function renderNewQuotes(quotesObject) {

        const li = document.createElement("li")
        const blockquote = document.createElement("blockquote")
        const p = document.createElement('p')
        const footer = document.createElement("footer")
        const btnSuccess = document.createElement('button')
        const btnDanger = document.createElement('button')

        li.dataset.id = quotesObject.id 
        li.classList.add('quote-card')
        blockquote.classList.add("blockquote")
        p.classList.add('mb-0')
        footer.classList.add('blockquote-footer')
        btnSuccess.classList.add('btn-success')
        btnDanger.classList.add('btn-danger')

        p.textContent = quotesObject.quote
        footer.textContent = quotesObject.author 
        btnSuccess.innerHTML = `Likes: <span>${quotesObject.likes.length}</span>`
        btnDanger.textContent = "Delete"

        blockquote.append(p, footer, btnSuccess, btnDanger)
        li.append(blockquote)
        quotesContainer.append(li)
}

