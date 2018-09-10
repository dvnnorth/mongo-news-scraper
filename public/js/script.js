window.onload = () => {
    // Scrape on click event listener to generate modal for scrape confirmation
    let scrapeButtons = document.querySelectorAll('.scrape');
    scrapeButtons.forEach(element => {
        element.addEventListener('click', () => {
            axios.get('/api/modal/scrape')
                .then((modalHTML) => {

                });
        });
    });


    // Save on click event listener to save an article
    let saveButtons = document.querySelectorAll('.save');
    saveButtons.forEach(element => {
        element.addEventListener('click', () => {
            let url = `/api/save/${element.dataset.id}`;;
            axios.put(url)
                .then();
        });
    });
};