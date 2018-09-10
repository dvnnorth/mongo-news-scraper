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
                .then(() => {
                    window.location = savedURL;
                });
        });
    });

    // Delete on click listener for removing saved articles
    let clearFromSaveButtons = document.querySelectorAll('.save-remove');
    clearFromSaveButtons.forEach(element => {
        element.addEventListener('click', () => {
            let url = `/api/save/${element.dataset.id}`;
            axios({
                method: 'delete',
                url: url
            })
                .then(() => {
                    window.location.reload(true);
                })
                .catch(err => axios.post('/api/log', { log: err }));
        });
    });

    // Display node modal and submit note
    // Delete everything from database on clear
    let noteButtons = document.querySelectorAll('.note');
    noteButtons.forEach(element => {
        element.addEventListener('click', () => {
            let title = element.parentElement.previousElementSibling.innerText;
            let body = '<div class="form-group">' +
                '<label for="titleinput">Title:</label>' +
                '<br><input type="text" id="titleinput" name="title" size=40></div>' +
                '<div class="form-group">' +
                '<label for="bodyinput">Note:</label>' +
                '<textarea id="bodyinput" class="form-control" name="body"></textarea></div>' +
                '<span id="errorDisplay" class="text-danger"></span>';
            axios({
                method: 'post',
                url: '/api/modal',
                data: {
                    title: `Note - ${title}`,
                    body: body,
                    confirm: 'Submit'
                }
            })
                .then((response) => {
                    let modal = document.getElementById('modalID');
                    let modalBody = document.getElementById('modalBody');
                    modalBody.innerHTML = response.data;
                    let modalInstance = new Modal(modal);
                    let submitConfirm = document.querySelector('#modalConfirm');
                    let url = `/api/articles/notes/${element.dataset.id}`;

                    axios.get(url)
                        .then((response) => {
                            let note;
                            let titleinput = document.querySelector('#titleinput');
                            let bodyinput = document.querySelector('#bodyinput');
                            if (response.data && response.data.hasOwnProperty('note')) {
                                note = response.data.note;
                            }
                            if (note) {
                                titleinput.value = note.title.trim();
                                bodyinput.value = note.body.trim();
                            }
                            submitConfirm.addEventListener('click', () => {
                                let data = {};
                                if (titleinput.value && bodyinput.value) {
                                    data.title = titleinput.value.trim();
                                    data.body = bodyinput.value.trim();
                                    axios({
                                        method: 'post',
                                        url: url,
                                        data: data
                                    })
                                        .then(() => {
                                            window.location = homeURL;
                                        })
                                        .catch(err => {
                                            document.querySelector('#errorDisplay').innerText = err;
                                        });
                                }
                                else {
                                    document.querySelector('#errorDisplay').innerText = 'Neither "Title" nor "Note" field can be blank!';
                                }
                            });
                        });

                    modalInstance.show();
                });
        });
    });

    // Delete everything from database on clear
    let clearButtons = document.querySelectorAll('.clear');
    clearButtons.forEach(element => {
        element.addEventListener('click', () => {
            axios({
                method: 'post',
                url: '/api/modal',
                data: {
                    title: 'Delete Everything - Are You Sure?',
                    body: 'If you click delete, you will delete every article, saved and unsaved!',
                    confirm: 'Delete Everything'
                }
            })
                .then((response) => {
                    let modal = document.getElementById('modalID');
                    let modalBody = document.getElementById('modalBody');
                    modalBody.innerHTML = response.data;
                    let modalInstance = new Modal(modal);

                    // Setup scrape confirm event listener
                    // Actually scrape and go to home page
                    let clearConfirm = document.querySelector('#modalConfirm');
                    clearConfirm.addEventListener('click', () => {
                        axios.delete('/api/clear')
                            .then(() => {
                                window.location = homeURL;
                            });
                    });

                    modalInstance.show();
                });
        });
    });
};