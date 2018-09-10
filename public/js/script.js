window.onload = () => {

    // Set home and saved URLs
    let homeURL = window.location.protocol + '//' + window.location.host + '/';
    let savedURL = window.location.protocol + '//' + window.location.host + '/saved';

    // Scrape on click event listener to generate modal for scrape confirmation
    let scrapeButtons = document.querySelectorAll('.scrape');
    scrapeButtons.forEach(element => {
        element.addEventListener('click', () => {
            axios({
                method: 'post',
                url: '/api/modal',
                data: {
                    title: 'Scraping - Are You Sure?',
                    body: 'Scraping will clear all unsaved articles. Make sure you have saved the articles you want to save!',
                    confirm: 'Scrape'
                }
            })
                .then((response) => {
                    let modal = document.getElementById('modalID');
                    let modalBody = document.getElementById('modalBody');
                    modalBody.innerHTML = response.data;
                    let modalInstance = new Modal(modal);

                    // Setup scrape confirm event listener
                    // Actually scrape and go to home page
                    let scrapeConfirm = document.querySelector('#modalConfirm');
                    scrapeConfirm.addEventListener('click', () => {
                        axios.get('/api/scrape')
                            .then(() => {
                                window.location = homeURL;
                            });
                    });

                    modalInstance.show();
                });
        });
    });


    // Save on click event listener to save an article
    let saveButtons = document.querySelectorAll('.save');
    saveButtons.forEach(element => {
        element.addEventListener('click', () => {
            let url = `/api/save/${element.dataset.id}`;
            axios.put(url)
                .then((response) => {
                    console.log(response);
                    window.location = savedURL;
                });
        });
    });

    // Delete on click listener for removing saved articles
    let clearFromSaveButtons = document.querySelectorAll('.save-remove');
    clearFromSaveButtons.forEach(element => {
        element.addEventListener('click', () => {
            let url = `/api/save/${element.dataset.id}`;
            axios.delete(url)
                .then((response) => {
                    console.log(response);
                    window.location.reload(true);
                });
        });
    });
};