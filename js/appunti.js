console.log("Ciao 1");


const uploader = document.querySelector('uc-file-uploader-regular');
uploader.addEventListener('ready', (event) => {

    console.log("Ciao");

    const { success } = event.detail;

    success.forEach(file => {
        const fileUrl = file.cdnUrl;
        fetch("/upload/note");
        console.log('File caricato con successo:', fileUrl);


    });

});