document.onload = () => {
    document.querySelector('.scrape').addEventListener('click', () => {
        axios.get('/api/modal/scrape')
            .then((modalHTML) => {

            });
    });
};