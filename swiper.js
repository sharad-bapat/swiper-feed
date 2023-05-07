
let currentIndex = 0
let items = [];

var container = document.getElementById("main");
container.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});
container.addEventListener('touchend', function (event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;

    // calculate swipe direction
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    // check which direction has greater distance and use that as the swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            console.log('swipe right');
            if (currentIndex > 0) {
                currentIndex--;
                showItem(currentIndex);
            }

        } else {
            console.log('swipe left');
            if (currentIndex < items.length - 1) {
                currentIndex++;
                showItem(currentIndex);
            } else {
                container.innerHTML = `<div style="text-align: center;display:flex; justify-content:center;align-items:center;font-size:48px;height: 100vh;" >No more articles</div>`;
            }
        }
    }
});

function showItem(index) {
    // console.log(items[index])
    try {

        var container1 = document.getElementById("content");
        const item = items[index];

        const div = document.createElement('div');

        const datediv = document.createElement('p')
        const date = new Date(item.published);
        const formattedDate = date.toLocaleString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
        datediv.innerHTML = `<p class="text-centre">${formattedDate}</p>`;

        const title = document.createElement('div');
        title.innerHTML = `<h1 class="fw-bold mt-4 mb-4">${item.title}</h1>`;


        let contentText = item.content ? item.content : ``;
        let symmaryText = item.summary ? item.summary : ``;

        const content = document.createElement('div');
        content.innerHTML = `<p class="mt-4">${contentText.length > 1 ? contentText : symmaryText}</p>`;




        const imgsrc = document.createElement('img');
        let visual = item.visual ? item.visual : "wp.png"
        imgsrc.setAttribute('src', visual);
        imgsrc.setAttribute('alt', 'image');
        imgsrc.classList.add("mx-auto", "d-block");
        // mx-auto d-block

        // Define the regular expression pattern for a valid URL
        const urlPattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[\:?\d]*)\S*$/;


        // Check which variable has a valid URL
        let validUrl;
        if (urlPattern.test(item.originID)) {
            validUrl = item.originID;
        } else if (urlPattern.test(item.canonicalUrl)) {
            validUrl = item.canonicalUrl;
        } else {
            validUrl = "No valid URL found";
        }


        const link = document.createElement('p');
        // let url1 = item.originID ? item.originID : ``;
        // let url2 = item.canonicalUrl ? item.canonicalUrl : ``;
        let hostname = "";

        // hostname = new URL(validUrl) ? new URL(validUrl).hostname : ``

        try {
            hostname = new URL(validUrl).hostname
        } catch {
            hostname = ""
        }

        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://www.google.com/s2/favicons?domain=${hostname}&sz=${36}`)




        link.innerHTML = `<a href="${validUrl}" target="_blank">${hostname}</a>`;
        link.className = 'small text-muted';

        const topDiv = document.createElement('div');
        topDiv.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${hostname}&sz=${64}" alt="Logo" height="16" class="d-inline-block align-text-center me-2"><a href="${validUrl}" target="_blank" class="text-muted">${hostname}</a>`
        topDiv.className = 'mb-3';

        // console.log(hostname, item.published)


        // div.appendChild(button);
        div.appendChild(topDiv);
        div.appendChild(imgsrc);
        div.appendChild(title);
        div.appendChild(datediv);
        div.appendChild(content);
        // div.appendChild(link);
        // div.appendChild(shareDiv);

        container1.innerHTML = '';
        container1.appendChild(div);

        // var shareButton = document.getElementById("shareButton")
        // shareButton.addEventListener('click', () => {
        //     share(item.title, "Built by Sharad Bapat", validUrl)
        // });
        // var openBUtton = document.getElementById("openBUtton")
        // openBUtton.addEventListener('click', () => {
        //     window.location(item.link);
        // });


        //remove the image in body if already in header
        const images = container1.querySelectorAll('img');
        const srcMap = {};
        for (const image of images) {
            if (image.src.split('?').shift() in srcMap) {
                image.remove();
            } else {
                srcMap[image.src.split('?').shift()] = true;
            }
        }

    } catch (err) {
        console.log(err.stack, err.message);
    }
}


getData();

async function getData() {
    items = [];
    currentIndex = 0;
    if (!getLocalStorage("swiper_feed")) {
        try {
            const response = await fetch(`https://damp-queen-0d6b.sixyjntpqun7805.workers.dev/`);
            const data = await response.json();
            setLocalStorage("swiper_feed", data, 30 * 60000);
            // console.log(data)
            items = data.sort((a, b) => b.published - a.published);
            showItem(0);
        } catch (error) {
            console.error(`${error.stack}`);
        }
    } else {
        items = getLocalStorage("swiper_feed").sort((a, b) => b.published - a.published);
        showItem(0);
    }

}

function share(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
    } else {
        console.log('Web Share API not supported');
    }
}




